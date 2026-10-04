import os
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_async_db
from app.config import settings
from app.models.models import (
    Submission, SimilarityReport, LecturerComment, Assignment, User, UserRole, CaseStatus
)
from app.schemas.schemas import SimilarityReportResponse, CommentCreate, CommentResponse
from app.api.auth import get_current_user, require_role
from app.services.reporting import generate_pdf_report, generate_csv_report

router = APIRouter(prefix="/reports", tags=["Similarity Reports"])

@router.get("/{submission_id}", response_model=SimilarityReportResponse)
async def get_similarity_report(
    submission_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_db)
):
    result = await db.execute(select(Submission).where(Submission.id == submission_id))
    submission = result.scalars().first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")

    if current_user.role == UserRole.STUDENT:
        if submission.student_id != current_user.id:
            raise HTTPException(status_code=403, detail="Permission denied")
        assign_res = await db.execute(select(Assignment).where(Assignment.id == submission.assignment_id))
        assignment = assign_res.scalars().first()
        if assignment and not assignment.allow_student_report_view:
            raise HTTPException(status_code=403, detail="Lecturer has disabled student report view for this assignment")

    report_res = await db.execute(select(SimilarityReport).where(SimilarityReport.submission_id == submission_id))
    report = report_res.scalars().first()
    if not report:
        raise HTTPException(status_code=404, detail="Similarity report not ready yet or not found")

    return {
        "id": report.id,
        "submission_id": report.submission_id,
        "overall_similarity": report.overall_similarity,
        "repo_similarity": report.repo_similarity,
        "web_similarity": report.web_similarity,
        "open_access_similarity": report.open_access_similarity,
        "peer_similarity": report.peer_similarity,
        "matches": report.matches_data,
        "web_search_status": report.web_search_status,
        "created_at": report.created_at
    }

@router.post("/{submission_id}/comment", response_model=CommentResponse)
async def add_lecturer_comment(
    submission_id: int,
    comment_in: CommentCreate,
    current_user: User = Depends(require_role([UserRole.LECTURER, UserRole.ADMIN])),
    db: AsyncSession = Depends(get_async_db)
):
    comment = LecturerComment(
        submission_id=submission_id,
        author_id=current_user.id,
        match_id=comment_in.match_id,
        comment=comment_in.comment,
        is_acceptable_citation=comment_in.is_acceptable_citation
    )
    db.add(comment)
    await db.commit()
    await db.refresh(comment)
    return comment

@router.put("/{submission_id}/case-status")
async def update_case_status(
    submission_id: int,
    new_status: CaseStatus,
    current_user: User = Depends(require_role([UserRole.LECTURER, UserRole.ADMIN])),
    db: AsyncSession = Depends(get_async_db)
):
    result = await db.execute(select(Submission).where(Submission.id == submission_id))
    sub = result.scalars().first()
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found")
    sub.case_status = new_status
    await db.commit()
    return {"message": "Case status updated successfully", "case_status": new_status}

@router.get("/{submission_id}/pdf")
async def export_pdf_report(
    submission_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_db)
):
    sub_res = await db.execute(select(Submission).where(Submission.id == submission_id))
    sub = sub_res.scalars().first()
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found")

    rep_res = await db.execute(select(SimilarityReport).where(SimilarityReport.submission_id == submission_id))
    report = rep_res.scalars().first()
    if not report:
        raise HTTPException(status_code=404, detail="Similarity report not ready")

    pdf_path = os.path.join(settings.REPORTS_DIR, f"report_{submission_id}.pdf")

    submission_info = {
        "submission_id": sub.id,
        "student_name": f"Student ID #{sub.student_id}",
        "course_title": "Academic Integrity Course",
        "assignment_title": f"Assignment #{sub.assignment_id}",
        "filename": sub.filename
    }
    report_info = {
        "overall_similarity": report.overall_similarity,
        "repo_similarity": report.repo_similarity,
        "web_similarity": report.web_similarity,
        "open_access_similarity": report.open_access_similarity,
        "peer_similarity": report.peer_similarity,
        "created_at": str(report.created_at)
    }

    generate_pdf_report(submission_info, report_info, report.matches_data, pdf_path)
    return FileResponse(pdf_path, media_type="application/pdf", filename=f"Similarity_Report_{sub.filename}.pdf")

@router.get("/{submission_id}/csv")
async def export_csv_report(
    submission_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_db)
):
    rep_res = await db.execute(select(SimilarityReport).where(SimilarityReport.submission_id == submission_id))
    report = rep_res.scalars().first()
    if not report:
        raise HTTPException(status_code=404, detail="Similarity report not ready")

    csv_content = generate_csv_report(report.matches_data)
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=matches_submission_{submission_id}.csv"}
    )
