from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.retention_policy import RetentionPolicy
from app.schemas.retention_policy import (
    RetentionPolicyCreate,
    RetentionPolicyResponse,
)
from app.services.retention_service import run_retention_job

router = APIRouter(
    prefix="/retention",
    tags=["Retention Policy"],
)
@router.post("/run")
def run_retention(db: Session = Depends(get_db)):
    count = run_retention_job(db)

    return {
        "message": "Retention job completed",
        "archived": count,
    }
@router.get(
    "/{form_id}",
    response_model=RetentionPolicyResponse,
)
def get_retention_policy(
    form_id: int,
    db: Session = Depends(get_db),
):
    policy = (
        db.query(RetentionPolicy)
        .filter(RetentionPolicy.form_id == form_id)
        .first()
    )

    if not policy:
        raise HTTPException(
            status_code=404,
            detail="Retention policy not found",
        )

    return policy

@router.post(
    "/{form_id}",
    response_model=RetentionPolicyResponse,
)
def save_retention_policy(
    form_id: int,
    payload: RetentionPolicyCreate,
    db: Session = Depends(get_db),
):
    policy = (
        db.query(RetentionPolicy)
        .filter(RetentionPolicy.form_id == form_id)
        .first()
    )

    if policy:
        policy.retention_days = payload.retention_days
        policy.action = payload.action
        policy.is_active = payload.is_active
    else:
        policy = RetentionPolicy(
            form_id=form_id,
            retention_days=payload.retention_days,
            action=payload.action,
            is_active=payload.is_active,
        )
        db.add(policy)

    db.commit()
    db.refresh(policy)

    return policy

