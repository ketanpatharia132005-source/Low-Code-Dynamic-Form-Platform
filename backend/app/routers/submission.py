from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.form import Submission, SubmissionCreate
from app.services.form_service import FormService
from app.models.form import Submission as SubmissionModel

router = APIRouter(prefix="/submissions", tags=["submissions"])

@router.post("/version/{form_version_id}", response_model=Submission, status_code=status.HTTP_201_CREATED)
def submit_form_data(form_version_id: int, submission_in: SubmissionCreate, db: Session = Depends(get_db)):
    """Submit responses to a specific published form version."""
    return FormService.submit_data(db=db, form_version_id=form_version_id, submission_in=submission_in)

@router.get("/version/{form_version_id}", response_model=List[Submission])
def get_version_submissions(form_version_id: int, db: Session = Depends(get_db)):
    """Retrieve all collected submissions for a specific form version."""
    return db.query(SubmissionModel).filter(SubmissionModel.form_version_id == form_version_id).all()

@router.get("/form/{form_id}", response_model=List[Submission])
def get_form_submissions(form_id: int, db: Session = Depends(get_db)):
    """Retrieve all submissions across all versions of a specific form."""
    return db.query(SubmissionModel)\
        .join(SubmissionModel.form_version)\
        .filter(SubmissionModel.form_version.has(form_id=form_id))\
        .all()
