import secrets
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_async_db
from app.models.models import Course, CourseEnrollment, User, UserRole
from app.schemas.schemas import CourseCreate, CourseResponse, CourseJoin
from app.api.auth import get_current_user, require_role

router = APIRouter(prefix="/courses", tags=["Courses"])

@router.post("/", response_model=CourseResponse, status_code=status.HTTP_201_CREATED)
async def create_course(
    course_in: CourseCreate,
    current_user: User = Depends(require_role([UserRole.LECTURER, UserRole.ADMIN])),
    db: AsyncSession = Depends(get_async_db)
):
    join_code = secrets.token_hex(4).upper()
    course = Course(
        code=course_in.code,
        title=course_in.title,
        join_code=join_code,
        instructor_id=current_user.id
    )
    db.add(course)
    await db.commit()
    await db.refresh(course)
    return course

@router.get("/", response_model=list[CourseResponse])
async def list_courses(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_db)
):
    if current_user.role in [UserRole.LECTURER, UserRole.ADMIN]:
        result = await db.execute(select(Course).where(Course.instructor_id == current_user.id))
        return result.scalars().all()
    else:
        result = await db.execute(
            select(Course).join(CourseEnrollment).where(CourseEnrollment.student_id == current_user.id)
        )
        return result.scalars().all()

@router.post("/join", response_model=CourseResponse)
async def join_course(
    join_in: CourseJoin,
    current_user: User = Depends(require_role([UserRole.STUDENT])),
    db: AsyncSession = Depends(get_async_db)
):
    result = await db.execute(select(Course).where(Course.join_code == join_in.join_code.strip().upper()))
    course = result.scalars().first()
    if not course:
        raise HTTPException(status_code=404, detail="Course with this join code not found")

    enrollment_check = await db.execute(
        select(CourseEnrollment).where(
            CourseEnrollment.course_id == course.id,
            CourseEnrollment.student_id == current_user.id
        )
    )
    if enrollment_check.scalars().first():
        return course

    enrollment = CourseEnrollment(course_id=course.id, student_id=current_user.id)
    db.add(enrollment)
    await db.commit()
    return course
