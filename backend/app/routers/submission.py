from typing import List

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.form import (
    SubmissionCreate,
    SubmissionResponse,
)
from app.services.form_service import FormService
from app.models.submission import Submission
from app.models.form_version import FormVersion


router = APIRouter(
    prefix="/submissions",
    tags=["submissions"],
)


@router.post(
    "/version/{form_version_id}",
    response_model=SubmissionResponse,
    status_code=status.HTTP_201_CREATED,
)
def submit_form_data(
    form_version_id: int,
    submission_in: SubmissionCreate,
    db: Session = Depends(get_db),
):
    """Submit responses to a specific published form version."""

    return FormService.submit_data(
        db=db,
        form_version_id=form_version_id,
        submission_in=submission_in,
    )


@router.get(
    "/version/{form_version_id}",
    response_model=List[SubmissionResponse],
)
def get_version_submissions(
    form_version_id: int,
    db: Session = Depends(get_db),
):
    """Retrieve all submissions for a specific form version."""

    return (
        db.query(Submission)
        .filter(
            Submission.form_version_id == form_version_id
        )
        .all()
    )


@router.get(
    "/form/{form_id}",
    response_model=List[SubmissionResponse],
)
def get_form_submissions(
    form_id: int,
    db: Session = Depends(get_db),
):
    submissions = (
        db.query(Submission)
        .join(
            FormVersion,
            Submission.form_version_id == FormVersion.id,
        )
        .filter(
            FormVersion.form_id == form_id
        )
        .all()
    )

    result = []

    for submission in submissions:

        version = (
            db.query(FormVersion)
            .filter(FormVersion.id == submission.form_version_id)
            .first()
        )

        snapshot = version.snapshot or {}
        fields = snapshot.get("fields", [])

        field_labels = {
            str(field["id"]): field["label"]
            for field in fields
        }

        enriched_data = []

        for item in submission.submitted_data:

            enriched_data.append({
                "field_id": item["field_id"],
                "field_label": field_labels.get(
                    str(item["field_id"]),
                    "Unknown Field"
                ),
                "value": item["value"],
                "display_name": item.get("display_name"),
            })

        result.append({
            "id": submission.id,
            "response_id": submission.response_id,
            "form_version_id": submission.form_version_id,
            "submitted_data": enriched_data,
            "created_at": submission.created_at,
        })

    return result