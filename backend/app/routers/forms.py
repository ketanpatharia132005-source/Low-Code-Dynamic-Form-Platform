from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload
from app.services.form_service import FormService
from app.services.validation import validate_submission
from app.models.form_version import FormVersion
import uuid
from app.models.retention_policy import RetentionPolicy
from app.database import SessionLocal
from app.dependencies import get_current_user
from app.models.user import User
from app.models.form import Form
from app.schemas.form import (
    FormCreate,
    FormResponse,
    FormVersionResponse,
    SubmissionResponse,
    AnalyticsResponse,
)
from fastapi import APIRouter, Depends, HTTPException

from app.models.field import Field
from app.schemas.form import FieldCreate, FieldUpdate
from app.schemas.form import FieldReorderItem
from app.models.form_version import FormVersion

from app.models.form import FormShareLink
from app.schemas.form import LinkGenerationResponse, PublicFormResponse
from app.models.submission import Submission
from sqlalchemy import func
from app.models.file_storage import FileStorage
from app.models.rule import ConditionalRule
    
router = APIRouter(
    prefix="/forms",
    tags=["Forms"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def ensure_form_is_editable(form: Form):
    if form.status != "draft":
        raise HTTPException(
            status_code=400,
            detail="Only draft forms can be edited"
        )

def validate_field_config(field_type: str, config: dict):
    if not config:
        return

    if field_type == "rating":
        # Check standard keys like 'max' or 'scale'
        scale = config.get("max", config.get("scale"))
        if scale is not None and (int(scale) < 1 or int(scale) > 10):
            raise ValueError("Rating scale must be between 1 and 10")

    elif field_type == "text":
        min_len = config.get("min_length")
        max_len = config.get("max_length")
        if min_len is not None and max_len is not None and int(min_len) > int(max_len):
            raise ValueError("Text min_length cannot be greater than max_length")

    elif field_type == "number":
        min_val = config.get("min")
        max_val = config.get("max")
        if min_val is not None and max_val is not None and float(min_val) > float(max_val):
            raise ValueError("Number min cannot be greater than max")

    elif field_type in ("dropdown", "checkbox"):
        options = config.get("options", [])
        if isinstance(options, list) and any(not str(opt).strip() for opt in options):
            raise ValueError("Dropdown/checkbox options cannot contain empty strings")

    elif field_type == "file":
        max_size = config.get("max_size_mb")
        if max_size is not None and float(max_size) <= 0:
            raise ValueError("File max_size_mb must be a positive number")

@router.post("/", response_model=FormResponse)
def create_form(
    form: FormCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_form = Form(
        title=form.title,
        description=form.description,
        owner_id=current_user.id
    )

    db.add(new_form)
    db.commit()
    db.refresh(new_form)

    return new_form

@router.post("/{form_id}/fields")
def create_field(
    form_id: int,
    field_data: FieldCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    form = (
        db.query(Form)
        .filter(
            Form.id == form_id,
            Form.owner_id == current_user.id
        )
        .first()
    )

    if not form:
        raise HTTPException(
            status_code=404,
            detail="Form not found"
        )
    ensure_form_is_editable(form)

    try:
        validate_field_config(field_data.field_type, field_data.config)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


    new_field = Field(
        form_id=form_id,
        label=field_data.label,
        field_type=field_data.field_type,
        config=field_data.config,
        display_order=field_data.display_order
    )


    db.add(new_field)
    db.commit()
    db.refresh(new_field)


    return new_field

@router.post("/{form_id}/publish")
def publish_form(
    form_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    form = (
        db.query(Form)
        .filter(
            Form.id == form_id,
            Form.owner_id == current_user.id,
        )
        .first()
    )

    if not form:
        raise HTTPException(
            status_code=404,
            detail="Form not found"
        )

    fields = (
        db.query(Field)
        .filter(Field.form_id == form_id)
        .order_by(Field.display_order)
        .all()
    )

    if len(fields) == 0:
        raise HTTPException(
            status_code=400,
            detail="Cannot publish a form with no fields"
        )

    latest_version = (
        db.query(FormVersion)
        .filter(FormVersion.form_id == form_id)
        .order_by(FormVersion.version_number.desc())
        .first()
    )

    next_version_number = 1
    if latest_version:
        next_version_number = latest_version.version_number + 1

    snapshot = {
        "title": form.title,
        "description": form.description,
        "fields": [
            {
                "id": field.id,
                "label": field.label,
                "field_type": field.field_type,
                "config": field.config,
                "display_order": field.display_order,
            }
            for field in fields
        ],
    }

    new_version = FormVersion(
        form_id=form.id,
        version_number=next_version_number,
        snapshot=snapshot,
        status="published",
    )

    form.status = "published"

    db.add(new_version)
    db.commit()
    db.refresh(new_version)
    db.refresh(form)

    return {
        "message": "Form published successfully",
        "form_id": form.id,
        "status": form.status,
        "version": {
            "id": new_version.id,
            "version_number": new_version.version_number,
            "published_at": new_version.published_at,
        },
    }


@router.post("/{form_id}/archive")
def archive_form(
    form_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    form = (
        db.query(Form)
        .filter(
            Form.id == form_id,
            Form.owner_id == current_user.id,
        )
        .first()
    )

    if not form:
        raise HTTPException(
            status_code=404,
            detail="Form not found"
        )

    if form.status == "archived":
        raise HTTPException(
            status_code=400,
            detail="Form is already archived"
        )

    form.status = "archived"

    db.commit()
    db.refresh(form)

    return {
        "message": "Form archived successfully",
        "form_id": form.id,
        "status": form.status,
    }

@router.get("/{form_id}/versions", response_model=list[FormVersionResponse])
def get_form_versions(
    form_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    form = (
        db.query(Form)
        .filter(
            Form.id == form_id,
            Form.owner_id == current_user.id,
        )
        .first()
    )

    if not form:
        raise HTTPException(
            status_code=404,
            detail="Form not found"
        )

    versions = (
        db.query(FormVersion)
        .filter(FormVersion.form_id == form_id)
        .order_by(FormVersion.version_number.desc())
        .all()
    )

    return versions

@router.get(
    "/{form_id}/submissions",
    response_model=list[SubmissionResponse],
)
def get_form_submissions(
    form_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Verify ownership of the form
    form = (
        db.query(Form)
        .filter(
            Form.id == form_id,
            Form.owner_id == current_user.id,
        )
        .first()
    )

    if not form:
        raise HTTPException(
            status_code=404,
            detail="Form not found",
        )

    # Get all versions of this form
    version_ids = [
        version.id
        for version in (
            db.query(FormVersion.id)
            .filter(FormVersion.form_id == form_id)
            .all()
        )
    ]

    if not version_ids:
        return []

    submissions = (
        db.query(Submission)
        .filter(Submission.form_version_id.in_(version_ids))
        .order_by(Submission.created_at.desc())
        .all()
    )

    # Build lookup from published snapshots
    version_lookup = {
        version.id: version
        for version in db.query(FormVersion)
        .filter(FormVersion.id.in_(version_ids))
        .all()
    }

    response = []

    for submission in submissions:

        version = version_lookup.get(submission.form_version_id)

        field_labels = {}

        if version and version.snapshot:
            for field in version.snapshot.get("fields", []):
                field_labels[str(field["id"])] = field["label"]

        enriched = []

        for item in submission.submitted_data:
            field_id = str(item.get("field_id"))

            value = item.get("value")

            display_name = None
            if isinstance(value, str):
                file_record=(
                    db.query(FileStorage)
                    .filter(FileStorage.file_key == value)
                    .first()
                )

                if file_record:
                    display_name= file_record.original_name

            enriched.append(
                {
                    "field_id": field_id,
                    "field_label": field_labels.get(
                        field_id,
                        f"Field {field_id}",
                    ),
                    "value": item.get("value"),
                    "display_name": display_name,
                }
            )

        response.append(
            SubmissionResponse(
                id=submission.id,
                form_version_id=submission.form_version_id,
                created_at=submission.created_at,
                submitted_data=enriched,
            )
        )

    return response


@router.post("/{form_id}/new-draft")
def edit_as_new_draft(
    form_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    form = (
        db.query(Form)
        .filter(
            Form.id == form_id,
            Form.owner_id == current_user.id,
        )
        .first()
    )

    if not form:
        raise HTTPException(
            status_code=404,
            detail="Form not found"
        )

    if form.status == "draft":
        raise HTTPException(
            status_code=400,
            detail="Form is already a draft"
        )

    if form.status == "archived":
        raise HTTPException(
            status_code=400,
            detail="Archived forms cannot be edited as draft"
        )

    form.status = "draft"

    db.commit()
    db.refresh(form)

    return {
        "message": "Form is now editable as a new draft",
        "form_id": form.id,
        "status": form.status,
    }


@router.patch("/{form_id}/fields/{field_id}")
def update_field(
    form_id: int,
    field_id: int,
    field_data: FieldUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    field = (
        db.query(Field)
        .join(Form)
        .filter(
            Field.id == field_id,
            Field.form_id == form_id,
            Form.owner_id == current_user.id,
        )
        .first()
    )

    if not field:
        raise HTTPException(
            status_code=404,
            detail="Field not found",
        )
    ensure_form_is_editable(field.form)

    update_data = field_data.model_dump(exclude_unset=True)

    new_field_type = update_data.get("field_type", field.field_type)
    new_config = update_data.get("config", field.config)
    
    try:
        validate_field_config(new_field_type, new_config)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    for key, value in update_data.items():
        setattr(field, key, value)

    db.commit()
    db.refresh(field)

    return field


@router.patch("/fields/{field_id}")
def update_field_legacy(
    field_id: int,
    field_data: FieldUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    field = (
        db.query(Field)
        .join(Form)
        .filter(
            Field.id == field_id,
            Form.owner_id == current_user.id,
        )
        .first()
    )

    if not field:
        raise HTTPException(
            status_code=404,
            detail="Field not found",
        )
    ensure_form_is_editable(field.form)

    update_data = field_data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(field, key, value)

    db.commit()
    db.refresh(field)

    return field

@router.delete("/{form_id}/fields/{field_id}", status_code=204)
def delete_field(
    form_id: int,
    field_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    field = (
        db.query(Field)
        .join(Form)
        .filter(
            Field.id == field_id,
            Field.form_id == form_id,
            Form.owner_id == current_user.id,
        )
        .first()
    )

    if field is None:
        raise HTTPException(status_code=404, detail="Field not found")
    ensure_form_is_editable(field.form)

    db.delete(field)
    db.commit()

@router.patch("/{form_id}/fields/reorder")
def reorder_fields(
    form_id: int,
    items: list[FieldReorderItem],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    form = (
        db.query(Form)
        .filter(
            Form.id == form_id,
            Form.owner_id == current_user.id,
        )
        .first()
    )
    if form is None:
        raise HTTPException(status_code=404, detail="Form not found")
    ensure_form_is_editable(form)

    for item in items:
        field = (
            db.query(Field)
            .filter(
                Field.id == item.field_id,
                Field.form_id == form_id,
            )
            .first()
        )
        if field is None:
            raise HTTPException(
                status_code=404,
                detail=f"Field {item.field_id} not found"
            )
        field.display_order = item.display_order

    db.commit()

    return {"message": "Field order updated"}


@router.get("/", response_model=list[FormResponse])
def get_forms(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    latest_published = (
        db.query(
            FormVersion.form_id,
            func.max(FormVersion.published_at).label("latest_published_at")
        )
        .filter(FormVersion.status == "published")
        .group_by(FormVersion.form_id)
        .subquery()
    )

    forms = (
        db.query(Form)
        .outerjoin(
            latest_published,
            Form.id == latest_published.c.form_id
        )
        .filter(Form.owner_id == current_user.id)
        .order_by(
            latest_published.c.latest_published_at.desc().nullslast(),
            Form.created_at.desc()
        )
        .all()
    )

    print("Logged in user:", current_user.id)
    print("Forms returned:", len(forms))
    print(forms)

    return forms

@router.get("/dashboard/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Total forms owned by the current user
    total_forms = (
        db.query(Form)
        .filter(Form.owner_id == current_user.id)
        .count()
    )

    # Published forms
    published_forms = (
        db.query(Form)
        .filter(
            Form.owner_id == current_user.id,
            Form.status == "published",
        )
        .count()
    )

    # All form IDs owned by current user
    form_ids = [
        form.id
        for form in db.query(Form.id)
        .filter(Form.owner_id == current_user.id)
        .all()
    ]

    total_responses = 0

    if form_ids:
        version_ids = [
            version.id
            for version in db.query(FormVersion.id)
            .filter(FormVersion.form_id.in_(form_ids))
            .all()
        ]

        if version_ids:
            total_responses = (
                db.query(Submission)
                .filter(
                    Submission.form_version_id.in_(version_ids)
                )
                .count()
            )

    completion_rate = 0

    if total_forms:
        completion_rate = round(
            (published_forms / total_forms) * 100,
            2,
        )

    return {
        "total_forms": total_forms,
        "published_forms": published_forms,
        "total_responses": total_responses,
        "completion_rate": completion_rate,
    }


@router.delete("/{form_id}", status_code=204)
def delete_form(
    form_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    form = (
        db.query(Form)
        .filter(
            Form.id == form_id,
            Form.owner_id == current_user.id
        )
        .first()
    )

    if not form:
        raise HTTPException(
            status_code=404,
            detail="Form not found"
        )

    # Delete retention policy associated with the form
    retention_policy = (
        db.query(RetentionPolicy)
        .filter(RetentionPolicy.form_id == form_id)
        .first()
    )

    if retention_policy:
        db.delete(retention_policy)

    # Delete the form
    db.delete(form)

    db.commit()


@router.get("/{form_id}", response_model=FormResponse)
def get_form(
    form_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    form = (
        db.query(Form)
        .filter(
            Form.id == form_id,
            Form.owner_id == current_user.id
        )
        .first()
    )

    if not form:
        raise HTTPException(
            status_code=404,
            detail="Form not found"
        )

    return form

@router.post("/{form_id}/generate-link", response_model=LinkGenerationResponse)
def generate_shareable_link(
    form_id: int, 
    db: Session = Depends(get_db), 
    current_user = Depends(get_current_user) # Adjust if your auth dependency is named differently
):
    
    form = db.query(Form).filter(Form.id == form_id, Form.owner_id == current_user.id).first()
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")

   
    published_version = db.query(FormVersion).filter(
        FormVersion.form_id == form_id, 
        FormVersion.status == "published"
    ).order_by(FormVersion.version_number.desc()).first()

    if not published_version:
        raise HTTPException(status_code=400, detail="Form must be published first.")

    
    existing_link = db.query(FormShareLink).filter(
        FormShareLink.form_version_id == published_version.id
    ).first()

    if existing_link:
        token = existing_link.link_token
    else:
        
        new_link = FormShareLink(form_id=form_id, form_version_id=published_version.id)
        db.add(new_link)
        db.commit()
        db.refresh(new_link)
        token = new_link.link_token

    return {
        "link_token": token,
        "form_version_id": published_version.id,
        "url": f"http://localhost:5173/f/{token}" # Adjust the port if your React app runs on a different one
    }


@router.get("/public/{link_token}", response_model=PublicFormResponse)
def get_public_form(link_token: str, db: Session = Depends(get_db)):
    
    share_link = db.query(FormShareLink).filter(FormShareLink.link_token == link_token).first()
    if not share_link:
        raise HTTPException(status_code=404, detail="Link not found.")

    
    form = db.query(Form).filter(Form.id == share_link.form_id).first()
    form_version = db.query(FormVersion).filter(FormVersion.id == share_link.form_version_id).first()
    

    fields = db.query(Field).filter(
        Field.form_version_id == share_link.form_version_id
    ).order_by(Field.order).all()

    return {
        "form": {"id": form.id, "title": form.title, "description": form.description},
        "fields": [field.__dict__ for field in fields], 
        "version": form_version.version_number
    }

@router.get("/share/{token}", response_model=FormResponse)
def get_form_by_token(token: str, db: Session = Depends(get_db)):
    
    share_link = db.query(FormShareLink).filter(FormShareLink.link_token == token).first()
    
    if not share_link:
        raise HTTPException(status_code=404, detail="Form link not found")

    
    form = db.query(Form).options(
        joinedload(Form.fields)
    ).filter(Form.id == share_link.form_id).first()
    
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")


    return form

@router.post("/share/{token}/submit")
def submit_public_form(
    token: str,
    payload: dict,
    db: Session = Depends(get_db),
):
    # Find the share link
    share_link = (
        db.query(FormShareLink)
        .filter(FormShareLink.link_token == token)
        .first()
    )

    if not share_link:
        raise HTTPException(
            status_code=404,
            detail="Form link not found",
        )

    # Get the published form version
    version = (
        db.query(FormVersion)
        .filter(FormVersion.id == share_link.form_version_id)
        .first()
    )

    if not version:
        raise HTTPException(
            status_code=404,
            detail="Published form version not found",
        )

    snapshot = version.snapshot or {}
    fields = snapshot.get("fields", [])

    # Convert frontend responses list into the format expected by validate_submission
    responses = payload.get("responses", [])

    submitted_data = {}
    for item in responses:
        submitted_data[str(item.get("field_id"))] = item.get("value")

    rules = (
        db.query(ConditionalRule)
        .filter(
            ConditionalRule.form_id == share_link.form_id
        )
        .all()
   )

    # Run backend validation
    errors = validate_submission(
        fields, 
        submitted_data,
        [
           {
               "trigger_field_id": rule.trigger_field_id,
               "operator": rule.operator,
               "comparison_value": rule.comparison_value,
               "target_field_id": rule.target_field_id,
               "action": rule.action,
           } 
           for rule in rules
        ],
    )

    if errors:
        raise HTTPException(
            status_code=400,
            detail={
                "message": "Validation failed",
                "errors": errors,
            },
        )

    # Save original response format
    submission = Submission(
        response_id=f"resp_{uuid.uuid4().hex[:10]}",
        form_version_id=share_link.form_version_id,
        submitted_data=responses,
    )

    db.add(submission)
    db.commit()
    db.refresh(submission)

    return {
        "success": True,
        "message": "Thank you! Your response has been recorded.",
        "submission_id": submission.id,
        "response_id": submission.response_id,
        "submitted_at": submission.created_at.isoformat(),
        "form_version_id": submission.form_version_id,
        "summary": {
            "fields_submitted": len(responses),
            "files_uploaded": sum(
                1
                for item in responses
                if isinstance(item.get("value"), str)
                and "." in item.get("value")
            ),
        },
    }

@router.get("/analytics/details")
def get_analytics_details(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # -----------------------------
    # All Forms
    # -----------------------------
    forms = (
        db.query(Form)
        .filter(Form.owner_id == current_user.id)
        .order_by(Form.created_at.desc())
        .all()
    )

    all_forms = []

    for form in forms:
        response_count = (
            db.query(Submission)
            .join(
                FormVersion,
                Submission.form_version_id == FormVersion.id
            )
            .filter(FormVersion.form_id == form.id)
            .count()
        )

        all_forms.append(
            {
                "id": form.id,
                "title": form.title,
                "description": form.description,
                "status": form.status,
                "created_at": form.created_at,
                "responses": response_count,
            }
        )

    # -----------------------------
    # Published Forms
    # -----------------------------
    published_forms = [
        form for form in all_forms
        if form["status"] == "published"
    ]

    # -----------------------------
    # Response Summary
    # -----------------------------
    response_summary = [
        {
            "id": form["id"],
            "title": form["title"],
            "responses": form["responses"],
        }
        for form in all_forms
    ]

    # -----------------------------
    # Completion Stats
    # -----------------------------
    total_forms = len(all_forms)
    published_count = len(published_forms)

    draft_count = len(
        [
            form
            for form in all_forms
            if form["status"] == "draft"
        ]
    )

    archived_count = len(
        [
            form
            for form in all_forms
            if form["status"] == "archived"
        ]
    )

    completion_rate = (
        round((published_count / total_forms) * 100, 2)
        if total_forms
        else 0
    )

    return {
        "all_forms": all_forms,
        "published_forms": published_forms,
        "responses": response_summary,
        "completion": {
            "total_forms": total_forms,
            "published_forms": published_count,
            "draft_forms": draft_count,
            "archived_forms": archived_count,
            "completion_rate": completion_rate,
        },
    }

@router.get(
    "/{form_id}/analytics",
    response_model=AnalyticsResponse,
)
def get_form_analytics(
    form_id: int,
    db: Session = Depends(get_db),
):
    """Get analytics for a form."""
    return FormService.get_form_analytics(
        db=db,
        form_id=form_id,
    )

@router.post("/{form_id}/duplicate")
def duplicate_form(
    form_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Find original form
    original_form = (
        db.query(Form)
        .filter(
            Form.id == form_id,
            Form.owner_id == current_user.id
        )
        .first()
    )

    if not original_form:
        raise HTTPException(
            status_code=404,
            detail="Form not found"
        )

    # -----------------------------
    # Create new draft form
    # -----------------------------
    new_form = Form(
        title=f"{original_form.title} (Copy)",
        description=original_form.description,
        owner_id=current_user.id,
        status="draft"
    )

    db.add(new_form)
    db.commit()
    db.refresh(new_form)

    # -----------------------------
    # Copy Fields
    # -----------------------------
    fields = (
        db.query(Field)
        .filter(Field.form_id == original_form.id)
        .order_by(Field.display_order)
        .all()
    )

    for field in fields:
        copied_field = Field(
            form_id=new_form.id,
            label=field.label,
            field_type=field.field_type,
            config=field.config,
            display_order=field.display_order,
        )

        db.add(copied_field)

    db.commit()

    # -----------------------------
    # Copy Conditional Rules
    # -----------------------------
    rules = (
        db.query(ConditionalRule)
        .filter(ConditionalRule.form_id == original_form.id)
        .all()
    )

    for rule in rules:
        copied_rule = ConditionalRule(
            form_id=new_form.id,
            trigger_field_id=rule.trigger_field_id,
            operator=rule.operator,
            comparison_value=rule.comparison_value,
            target_field_id=rule.target_field_id,
            action=rule.action,
        )

        db.add(copied_rule)

    db.commit()

    return {
        "message": "Form duplicated successfully",
        "new_form_id": new_form.id,
        "title": new_form.title,
        "status": new_form.status,
    }