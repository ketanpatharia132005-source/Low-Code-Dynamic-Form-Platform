from typing import List
from datetime import date

from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import and_, func

from app.database import get_db
from app.schemas.form import (
    SubmissionCreate,
    SubmissionResponse,
)
from typing import Optional
from app.schemas.submission import (
    ResponseListResponse,
    ResponseSummary,
    ResponseDetail,
    ResponseField,
    AvailableField,
)
from app.services.form_service import FormService
from app.models.submission import Submission
from app.models.form_version import FormVersion
from app.schemas.bulk_delete import BulkDeleteRequest
from app.services.audit_service import create_audit_log

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

@router.get(
    "/form/{form_id}/responses",
    response_model=ResponseListResponse,
)
def browse_form_responses(
    form_id: int,
    from_date: Optional[date] = None,
    to_date: Optional[date] = None,
    field_id: Optional[int] = None,
    field_value: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 20,
    offset: int = 0,
    db: Session = Depends(get_db),
):
    query = (
        db.query(Submission)
        .join(
            FormVersion,
            Submission.form_version_id == FormVersion.id,
        )
        .filter(FormVersion.form_id == form_id)
    )

    if from_date:
        query = query.filter(
            func.date(Submission.created_at) >= from_date
        )

    if to_date:
        query = query.filter(
            func.date(Submission.created_at) <= to_date
        )

    submissions = query.order_by(
        Submission.created_at.desc()
    ).all()

    filtered = []

    for submission in submissions:

        version = (
            db.query(FormVersion)
            .filter(
                FormVersion.id == submission.form_version_id
            )
            .first()
        )

        snapshot = version.snapshot or {}
        fields = snapshot.get("fields", [])

        available_fields = [
            AvailableField(
               id=str(field["id"]),
               label=field["label"],
            )
            for field in fields
        ]

        field_labels = {
            str(field["id"]): field["label"]
            for field in fields
        }

        summary = {}

        matched = True

        for item in submission.submitted_data:

            label = field_labels.get(
                str(item["field_id"]),
                "Unknown Field",
            )

            value = str(item.get("value", ""))

            if len(summary) < 2:
                summary[label] = value

            if field_id is not None:
                if (
                    item["field_id"] == field_id
                    and field_value
                    and field_value.lower() not in value.lower()
                ):
                    matched = False

            if search:
                found = any(
                    search.lower() in str(v.get("value", "")).lower()
                    for v in submission.submitted_data
                )
                if not found:
                    matched = False

        if matched:
            filtered.append(
                ResponseSummary(
                    id=submission.id,
                    response_id=submission.response_id,
                    created_at=submission.created_at,
                    summary=summary,
                )
            )

    total = len(filtered)

    responses = filtered[offset:offset + limit]

    return {
        "total": total,
        "count": len(responses),
        "limit": limit,
        "offset": offset,
        "responses": responses,
        "available_fields":available_fields,
    }

@router.get("/responses/all")
def browse_all_responses(
    from_date: Optional[date] = None,
    to_date: Optional[date] = None,
    search: Optional[str] = None,
    limit: int = 20,
    offset: int = 0,
    db: Session = Depends(get_db),
):
    query = (
        db.query(Submission, FormVersion.form_id)
        .join(
            FormVersion,
            Submission.form_version_id == FormVersion.id,
        )
    )

    if from_date:
        query = query.filter(
            func.date(Submission.created_at) >= from_date
        )

    if to_date:
        query = query.filter(
            func.date(Submission.created_at) <= to_date
        )

    results = []

    submissions = (
        query
        .order_by(Submission.created_at.desc())
        .all()
    )

    for submission, form_id in submissions:

        version = (
            db.query(FormVersion)
            .filter(
                FormVersion.id == submission.form_version_id
            )
            .first()
        )

        snapshot = version.snapshot or {}
        fields = snapshot.get("fields", [])

        field_labels = {
            str(field["id"]): field["label"]
            for field in fields
        }

        summary = {}

        for item in submission.submitted_data:

            label = field_labels.get(
                str(item["field_id"]),
                "Unknown Field",
            )

            value = str(item.get("value", ""))

            if len(summary) < 2:
                summary[label] = value

        if search:
            search_text = search.lower()

            searchable_values = [
                str(item.get("value", "")).lower()
                for item in submission.submitted_data
            ]

            if not any(
                search_text in value
                for value in searchable_values
            ):
                continue

        results.append({
            "id": submission.id,
            "response_id": submission.response_id,
            "form_id": form_id,
            "form_version_id": submission.form_version_id,
            "created_at": submission.created_at,
            "summary": summary,
        })

    total = len(results)

    responses = results[offset:offset + limit]

    return {
        "total": total,
        "count": len(responses),
        "limit": limit,
        "offset": offset,
        "responses": responses,
    }

@router.get(
    "/form/{form_id}/responses/{response_id}",
    response_model=ResponseDetail,
)
def get_response_detail(
    form_id: int,
    response_id: str,
    db: Session = Depends(get_db),
):
    submission = (
        db.query(Submission)
        .join(
            FormVersion,
            Submission.form_version_id == FormVersion.id,
        )
        .filter(
            FormVersion.form_id == form_id,
            Submission.response_id == response_id,
        )
        .first()
    )

    if not submission:
        raise HTTPException(
            status_code=404,
            detail="Response not found",
        )

    version = (
        db.query(FormVersion)
        .filter(
            FormVersion.id == submission.form_version_id
        )
        .first()
    )

    snapshot = version.snapshot or {}
    fields = snapshot.get("fields", [])

    field_labels = {
        str(field["id"]): field["label"]
        for field in fields
    }

   

    responses = []

    for item in submission.submitted_data:

        responses.append(
            ResponseField(
                field_id=item["field_id"],
                field_label=field_labels.get(
                    str(item["field_id"]),
                    "Unknown Field",
                ),
                value=item.get("value"),
                display_name=item.get("display_name"),
            )
        )

    return ResponseDetail(
        response_id=submission.response_id,
        created_at=submission.created_at,
        responses=responses,
    )

@router.delete("/form/{form_id}/responses/bulk")
def bulk_delete_responses(
    form_id: int,
    request: BulkDeleteRequest,
    db: Session = Depends(get_db),
):
    submissions = (
        db.query(Submission)
        .join(
            FormVersion,
            Submission.form_version_id == FormVersion.id,
        )
        .filter(
            FormVersion.form_id == form_id,
            Submission.response_id.in_(request.response_ids),
        )
        .all()
    )

    if not submissions:
        raise HTTPException(
            status_code=404,
            detail="No matching responses found",
        )

    deleted_count = len(submissions)

    deleted_ids = []

    for submission in submissions:
        deleted_ids.append(submission.response_id)
        db.delete(submission)

    db.commit()

    create_audit_log(
        db=db,
        actor_id=None,
        action="bulk_delete",
        entity_type="submission",
        entity_id=None,
        details={
            "form_id": form_id,
            "response_ids": deleted_ids,
        },
        records_affected=deleted_count,
        ip_address=None,
    )

    return {
        "message": "Responses deleted successfully",
        "deleted": deleted_count,
    }