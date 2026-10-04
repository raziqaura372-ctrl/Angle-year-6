import os
import hashlib
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_async_db
from app.config import settings
from app.models.models import Submission, Assignment, Course, User, UserRole
from app.schemas.schemas import SubmissionResponse
from app.api.auth import get_current_user, require_role
from app.workers.tasks import process_submission_task

router = APIRouter(prefix="/submissions", tags=["Submissions"])

ALLOWED_EXTENSIONS = {"pdf", "docx", "odt", "txt", "rtf"}

@router.post("/assignment/{assignment_id}", response_model=SubmissionResponse, status_code=status.HTTP_201_CREATED)
async def upload_submission(
    assignment_id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(require_role([UserRole.STUDENT, UserRole.LECTURER, UserRole.ADMIN])),
    db: AsyncSession = Depends(get_async_db)
):
    ext = file.filename.split(".")[-1].lower() if "." in file.filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Unsupported file extension .{ext}. Allowed: {ALLOWED_EXTENSIONS}")

    file_bytes = await file.read()
    if len(file_bytes) > settings.MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"File exceeds maximum size limit of {settings.MAX_FILE_SIZE_MB}MB")

    file_hash = hashlib.sha256(file_bytes).hexdigest()

    safe_filename = os.path.basename(file.filename)
    file_path = os.path.join(settings.UPLOAD_DIR, f"{file_hash}_{safe_filename}")
    with open(file_path, "wb") as f:
        f.write(file_bytes)

    submission = Submission(
        assignment_id=assignment_id,
        student_id=current_user.id,
        filename=file.filename,
        file_path=file_path,
        file_type=ext,
        file_size_bytes=len(file_bytes),
        file_hash=file_hash,
        status="pending",
        progress=0
    )
    db.add(submission)
    await db.commit()
    await db.refresh(submission)

    process_submission_task.delay(submission.id)

    return submission

@router.get("/assignment/{assignment_id}", response_model=list[SubmissionResponse])
async def list_submissions(
    assignment_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_db)
):
    if current_user.role == UserRole.STUDENT:
        result = await db.execute(
            select(Submission).where(Submission.assignment_id == assignment_id, Submission.student_id == current_user.id)
        )
    else:
        result = await db.execute(select(Submission).where(Submission.assignment_id == assignment_id))
    return result.scalars().all()

@router.get("/{submission_id}", response_model=SubmissionResponse)
async def get_submission_status(
    submission_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_db)
):
    result = await db.execute(select(Submission).where(Submission.id == submission_id))
    sub = result.scalars().first()
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found")
    if current_user.role == UserRole.STUDENT and sub.student_id != current_user.id:
        raise HTTPException(status_code=403, detail="Permission denied")
    return sub
