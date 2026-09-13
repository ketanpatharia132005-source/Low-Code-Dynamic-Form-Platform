from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User

from app.services.audit_service import get_audit_logs


router = APIRouter(
    prefix="/audit",
    tags=["Audit Logs"],
)


@router.get("")
def list_audit_logs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_audit_logs(db, current_user.id)