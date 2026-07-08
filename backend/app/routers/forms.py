from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.dependencies import get_current_user
from app.models.user import User
from app.models.form import Form
from app.schemas.form import FormCreate, FormResponse
from fastapi import APIRouter, Depends, HTTPException

from app.models.field import Field
from app.schemas.form import FieldCreate, FieldUpdate
from app.schemas.form import FieldReorderItem
    
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

@router.patch("/fields/{field_id}")
def update_field(
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