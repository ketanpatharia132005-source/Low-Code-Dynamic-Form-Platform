from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload

from app.database import SessionLocal
from app.dependencies import get_current_user
from app.models.user import User
from app.models.form import Form
from app.schemas.form import FormCreate, FormResponse, FormVersionResponse
from fastapi import APIRouter, Depends, HTTPException

from app.models.field import Field
from app.schemas.form import FieldCreate, FieldUpdate
from app.schemas.form import FieldReorderItem
from app.models.form_version import FormVersion

from app.models.form import FormShareLink
from app.schemas.form import LinkGenerationResponse, PublicFormResponse
    
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
    forms = (
        db.query(Form)
        .filter(Form.owner_id == current_user.id)
        .all()
    )

    return forms


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