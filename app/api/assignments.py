from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_async_db
from app.models.models import Course, Assignment, User, UserRole
from app.schemas.schemas import AssignmentCreate, AssignmentResponse
from app.api.auth import get_current_user, require_role

router = APIRouter(prefix="/assignments", tags=["Assignments"])

@router.post("/course/{course_id}", response_model=AssignmentResponse, status_code=status.HTTP_201_CREATED)
async def create_assignment(
    course_id: int,
    assignment_in: AssignmentCreate,
    current_user: User = Depends(require_role([UserRole.LECTURER, UserRole.ADMIN])),
    db: AsyncSession = Depends(get_async_db)
):
    result = await db.execute(select(Course).where(Course.id == course_id, Course.instructor_id == current_user.id))
    course = result.scalars().first()
    if not course and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Course not found or permission denied")

    assignment = Assignment(
        course_id=course_id,
        title=assignment_in.title,
        description=assignment_in.description,
        due_date=assignment_in.due_date,
        allow_student_report_view=assignment_in.allow_student_report_view,
        exclude_quotes=assignment_in.exclude_quotes,
        exclude_bibliography=assignment_in.exclude_bibliography,
        min_match_words=assignment_in.min_match_words,
        excluded_phrases=assignment_in.excluded_phrases,
        exclude_from_repository=assignment_in.exclude_from_repository
    )
    db.add(assignment)
    await db.commit()
    await db.refresh(assignment)
    return assignment

@router.get("/course/{course_id}", response_model=list[AssignmentResponse])
async def list_assignments(
    course_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_db)
):
    result = await db.execute(select(Assignment).where(Assignment.course_id == course_id))
    return result.scalars().all()
