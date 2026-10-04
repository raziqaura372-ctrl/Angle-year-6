from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from app.db.session import get_async_db
from app.models.models import User, Submission, Course, SimilarityReport, AuditLog, SystemSetting, UserRole
from app.api.auth import require_role

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/dashboard")
async def get_admin_dashboard(
    current_user: User = Depends(require_role([UserRole.ADMIN])),
    db: AsyncSession = Depends(get_async_db)
):
    users_count = await db.scalar(select(func.count(User.id)))
    courses_count = await db.scalar(select(func.count(Course.id)))
    submissions_count = await db.scalar(select(func.count(Submission.id)))
    avg_sim = await db.scalar(select(func.avg(SimilarityReport.overall_similarity))) or 0.0

    return {
        "total_users": users_count,
        "total_courses": courses_count,
        "total_submissions": submissions_count,
        "average_similarity": round(float(avg_sim), 2),
        "queue_status": "healthy"
    }

@router.get("/settings")
async def get_system_settings(
    current_user: User = Depends(require_role([UserRole.ADMIN])),
    db: AsyncSession = Depends(get_async_db)
):
    result = await db.execute(select(SystemSetting))
    return result.scalars().all()

@router.post("/settings")
async def update_system_setting(
    key: str,
    value: str,
    description: str = None,
    current_user: User = Depends(require_role([UserRole.ADMIN])),
    db: AsyncSession = Depends(get_async_db)
):
    result = await db.execute(select(SystemSetting).where(SystemSetting.key == key))
    setting = result.scalars().first()
    if not setting:
        setting = SystemSetting(key=key, value=value, description=description)
        db.add(setting)
    else:
        setting.value = value
        if description:
            setting.description = description
    await db.commit()
    return {"message": f"Setting '{key}' updated successfully"}

@router.get("/audit-logs")
async def get_audit_logs(
    current_user: User = Depends(require_role([UserRole.ADMIN])),
    db: AsyncSession = Depends(get_async_db)
):
    result = await db.execute(select(AuditLog).order_by(AuditLog.created_at.desc()).limit(100))
    return result.scalars().all()
