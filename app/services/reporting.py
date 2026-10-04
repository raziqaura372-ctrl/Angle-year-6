import os
import csv
import io
from typing import Dict, Any, List
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_pdf_report(
    submission_info: Dict[str, Any],
    report_info: Dict[str, Any],
    matches: List[Dict[str, Any]],
    output_path: str
) -> str:
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        textColor=colors.HexColor('#1B2A41'),
        spaceAfter=6
    )
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        textColor=colors.HexColor('#555555'),
        spaceAfter=12
    )
    meta_style = ParagraphStyle(
        'MetaText',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        textColor=colors.HexColor('#333333')
    )
    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        spaceAfter=4
    )
    disclaimer_style = ParagraphStyle(
        'Disclaimer',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8,
        textColor=colors.HexColor('#C0392B'),
        spaceAfter=10
    )

    story = []

    story.append(Paragraph("VeriDraft Academic Integrity Report", title_style))
    story.append(Paragraph("Official Plagiarism & Similarity Analysis Certificate", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor('#1B2A41'), spaceAfter=15))

    disclaimer_text = (
        "<b>PROMINENT DISCLAIMER:</b> Similarity scores are digital indicators intended to assist human evaluation. "
        "A high similarity percentage does not automatically constitute plagiarism, nor does a low score guarantee originality. "
        "Academic review by course instructors is required."
    )
    story.append(Paragraph(disclaimer_text, disclaimer_style))
    story.append(Spacer(1, 10))

    meta_data = [
        [Paragraph("<b>Student:</b>", meta_style), Paragraph(str(submission_info.get("student_name", "N/A")), body_style),
         Paragraph("<b>Submission ID:</b>", meta_style), Paragraph(str(submission_info.get("submission_id", "N/A")), body_style)],
        [Paragraph("<b>Course:</b>", meta_style), Paragraph(str(submission_info.get("course_title", "N/A")), body_style),
         Paragraph("<b>Date Generated:</b>", meta_style), Paragraph(str(report_info.get("created_at", "N/A")), body_style)],
        [Paragraph("<b>Assignment:</b>", meta_style), Paragraph(str(submission_info.get("assignment_title", "N/A")), body_style),
         Paragraph("<b>File Name:</b>", meta_style), Paragraph(str(submission_info.get("filename", "N/A")), body_style)]
    ]
    meta_table = Table(meta_data, colWidths=[1.1*inch, 2.4*inch, 1.2*inch, 2.3*inch])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8F9FA')),
        ('PADDING', (0,0), (-1,-1), 6),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 15))

    overall = report_info.get("overall_similarity", 0.0)
    score_color = colors.HexColor('#27AE60') if overall < 15 else (colors.HexColor('#E67E22') if overall <= 40 else colors.HexColor('#E74C3C'))

    sim_data = [
        [Paragraph("<b>Overall Similarity Index</b>", meta_style), Paragraph(f"<b>{overall}%</b>", ParagraphStyle('Score', parent=meta_style, fontSize=14, textColor=score_color))],
        [Paragraph("Institutional Repository Matches", body_style), Paragraph(f"{report_info.get('repo_similarity', 0.0)}%", body_style)],
        [Paragraph("Internet & Web Search Matches", body_style), Paragraph(f"{report_info.get('web_similarity', 0.0)}%", body_style)],
        [Paragraph("Open Access & Publications Matches", body_style), Paragraph(f"{report_info.get('open_access_similarity', 0.0)}%", body_style)],
        [Paragraph("Peer Class Submissions Matches", body_style), Paragraph(f"{report_info.get('peer_similarity', 0.0)}%", body_style)],
    ]
    sim_table = Table(sim_data, colWidths=[4.5*inch, 2.5*inch])
    sim_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#EDF2F7')),
        ('PADDING', (0,0), (-1,-1), 6),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E0')),
    ]))
    story.append(sim_table)
    story.append(Spacer(1, 15))

    story.append(Paragraph("<b>Top Matched Sources</b>", styles['Heading2']))
    match_rows = [["#", "Source Title", "Type", "Similarity"]]
    for idx, m in enumerate(matches[:10], start=1):
        if not m.get("is_excluded"):
            match_rows.append([
                str(idx),
                Paragraph(m.get("source_title", "Unknown"), body_style),
                m.get("source_type", "repo"),
                f"{m.get('similarity_percentage', 0.0)}%"
            ])

    if len(match_rows) > 1:
        match_table = Table(match_rows, colWidths=[0.4*inch, 4.2*inch, 1.2*inch, 1.2*inch])
        match_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1B2A41')),
            ('TEXTCOLOR', (0,0), (-1,0), colors.white),
            ('PADDING', (0,0), (-1,-1), 5),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E0')),
        ]))
        story.append(match_table)
    else:
        story.append(Paragraph("No major matched sources detected.", body_style))

    doc.build(story)
    return output_path

def generate_csv_report(matches: List[Dict[str, Any]]) -> str:
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Match ID", "Source Title", "Source Type", "Source URL", "Author",
        "Similarity %", "Submitted Text", "Matched Text", "Page Number", "Is Excluded", "Exclusion Reason"
    ])
    for m in matches:
        writer.writerow([
            m.get("match_id", ""),
            m.get("source_title", ""),
            m.get("source_type", ""),
            m.get("source_url", ""),
            m.get("author", ""),
            m.get("similarity_percentage", 0.0),
            m.get("submitted_text", ""),
            m.get("matched_text", ""),
            m.get("page_number", 1),
            m.get("is_excluded", False),
            m.get("exclusion_reason", "")
        ])
    return output.getvalue()
