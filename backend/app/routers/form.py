from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.form import Form, FormCreate, FormUpdate, FormVersion, FormVersionCreate, FormSimple
from app.services.form_service import FormService

router = APIRouter(prefix="/forms", tags=["forms"])

@router.get("/", response_model=List[Form])
def get_all_forms(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Retrieve all forms with their nested versions and fields."""
    return FormService.get_forms(db=db, skip=skip, limit=limit)

@router.post("/", response_model=Form, status_code=status.HTTP_201_CREATED)
def create_new_form(form_in: FormCreate, db: Session = Depends(get_db)):
    """Create a new form with an initial version and fields."""
    return FormService.create_form(db=db, form_in=form_in)

@router.get("/{form_id}", response_model=Form)
def get_form_by_id(form_id: int, db: Session = Depends(get_db)):
    """Retrieve a specific form by ID."""
    return FormService.get_form_by_id(db=db, form_id=form_id)

@router.put("/{form_id}", response_model=Form)
def update_existing_form(form_id: int, form_in: FormUpdate, db: Session = Depends(get_db)):
    """Update form metadata."""
    return FormService.update_form(db=db, form_id=form_id, form_in=form_in)

@router.delete("/{form_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_form(form_id: int, db: Session = Depends(get_db)):
    """Delete a form and all its nested resources (versions, fields, options)."""
    FormService.delete_form(db=db, form_id=form_id)
    return None

@router.post("/{form_id}/versions", response_model=FormVersion, status_code=status.HTTP_201_CREATED)
def create_new_form_version(form_id: int, version_in: FormVersionCreate, db: Session = Depends(get_db)):
    """Add a new version to an existing form (auto-increments version number)."""
    return FormService.create_form_version(db=db, form_id=form_id, version_in=version_in)
