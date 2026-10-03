import os
import logging
from celery import Task
from app.workers.celery_app import celery_app
from app.db.session import SyncSessionLocal
from app.models.models import (
    Submission, ExtractedDocument, SimilarityReport, Assignment,
    SourceDocument, CourseEnrollment, User
)
from app.services.extraction import extract_document_content
from app.services.detection import DetectionPipeline, build_peer_similarity_matrix
from app.services.web_search import query_web_sources
from app.services.open_access import search_crossref, search_arxiv, search_wikipedia

logger = logging.getLogger(__name__)

@celery_app.task(bind=True, name="tasks.process_submission")
def process_submission_task(self, submission_id: int):
    db = SyncSessionLocal()
    try:
        submission = db.query(Submission).filter(Submission.id == submission_id).first()
        if not submission:
            logger.error(f"Submission {submission_id} not found.")
            return

        submission.status = "processing"
        submission.progress = 10
        db.commit()

        with open(submission.file_path, "rb") as f:
            file_bytes = f.read()

        raw_text, paragraphs, lang, word_count = extract_document_content(
            file_bytes, submission.file_type
        )

        submission.progress = 30
        db.commit()

        ext_doc = db.query(ExtractedDocument).filter(ExtractedDocument.submission_id == submission_id).first()
        if not ext_doc:
            ext_doc = ExtractedDocument(
                submission_id=submission_id,
                raw_text=raw_text,
                clean_text=raw_text.lower(),
                paragraphs=paragraphs,
                detected_language=lang,
                word_count=word_count
            )
            db.add(ext_doc)
        else:
            ext_doc.raw_text = raw_text
            ext_doc.clean_text = raw_text.lower()
            ext_doc.paragraphs = paragraphs
            ext_doc.detected_language = lang
            ext_doc.word_count = word_count
        db.commit()

        submission.progress = 50
        db.commit()

        pipeline = DetectionPipeline()

        past_submissions = db.query(Submission).join(ExtractedDocument).filter(
            Submission.id != submission_id,
            Submission.status == "completed"
        ).all()

        for ps in past_submissions:
            student = db.query(User).filter(User.id == ps.student_id).first()
            assignment = db.query(Assignment).filter(Assignment.id == ps.assignment_id).first()

            if student and student.opt_out_repository:
                continue
            if assignment and assignment.exclude_from_repository:
                continue

            if ps.extracted_doc:
                pipeline.index_document(
                    doc_id=f"sub_{ps.id}",
                    title=f"Submission {ps.filename}",
                    text=ps.extracted_doc.raw_text,
                    source_type="repository",
                    author=student.full_name if student else "Anonymous",
                    paragraphs=ps.extracted_doc.paragraphs
                )

        assignment = db.query(Assignment).filter(Assignment.id == submission.assignment_id).first()
        if assignment and assignment.source_documents:
            for sd in assignment.source_documents:
                pipeline.index_document(
                    doc_id=f"src_{sd.id}",
                    title=sd.title,
                    text=sd.content,
                    source_type=sd.source_type,
                    author=sd.author
                )

        submission.progress = 70
        db.commit()

        web_results, web_status = query_web_sources(raw_text[:200])
        for wr in web_results:
            pipeline.index_document(
                doc_id=f"web_{hash(wr['url'])}",
                title=wr["title"],
                text=wr["snippet"],
                source_type="web",
                url=wr["url"],
                author="Web Source"
            )

        oa_results = search_crossref(raw_text[:200]) + search_arxiv(raw_text[:200]) + search_wikipedia(raw_text[:200])
        for oar in oa_results:
            pipeline.index_document(
                doc_id=f"oa_{hash(oar['title'])}",
                title=oar["title"],
                text=oar["snippet"],
                source_type=oar["source_type"],
                url=oar.get("url"),
                author=oar.get("author", "Academic Publisher")
            )

        excluded_phrases_list = (assignment.excluded_phrases or "").split("\n") if assignment else []

        overall_sim, repo_sim, web_sim, oa_sim, peer_sim, matches = pipeline.analyze_submission(
            submission_text=raw_text,
            paragraphs=paragraphs,
            settings_exclude_quotes=assignment.exclude_quotes if assignment else True,
            settings_exclude_bib=assignment.exclude_bibliography if assignment else True,
            min_match_words=assignment.min_match_words if assignment else 5,
            excluded_phrases=excluded_phrases_list
        )

        submission.progress = 90
        db.commit()

        report = db.query(SimilarityReport).filter(SimilarityReport.submission_id == submission_id).first()
        if not report:
            report = SimilarityReport(
                submission_id=submission_id,
                overall_similarity=overall_sim,
                repo_similarity=repo_sim,
                web_similarity=web_sim,
                open_access_similarity=oa_sim,
                peer_similarity=peer_sim,
                matches_data=matches,
                web_search_status=web_status
            )
            db.add(report)
        else:
            report.overall_similarity = overall_sim
            report.repo_similarity = repo_sim
            report.web_similarity = web_sim
            report.open_access_similarity = oa_sim
            report.peer_similarity = peer_sim
            report.matches_data = matches
            report.web_search_status = web_status

        submission.status = "completed"
        submission.progress = 100
        db.commit()

    except Exception as e:
        logger.error(f"Failed to process submission {submission_id}: {e}")
        submission.status = "failed"
        submission.error_message = str(e)
        db.commit()
    finally:
        db.close()
