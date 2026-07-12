from pydantic import BaseModel, Field as PydanticField
from typing import List, Optional, Dict, Any
from datetime import datetime

# Field Option Schemas
class FieldOptionBase(BaseModel):
    label: str
    value: str
    order: int = 0

class FieldOptionCreate(FieldOptionBase):
    pass

class FieldOption(FieldOptionBase):
    id: int
    field_id: int

    class Config:
        from_attributes = True


# Field Schemas
class FieldBase(BaseModel):
    name: str
    label: str
    field_type: str
    is_required: bool = False
    placeholder: Optional[str] = None
    validation_rules: Optional[Dict[str, Any]] = None
    order: int = 0

class FieldCreate(FieldBase):
    options: Optional[List[FieldOptionCreate]] = []

class Field(FieldBase):
    id: int
    form_version_id: int
    options: List[FieldOption] = []

    class Config:
        from_attributes = True


# Submission Schemas
class SubmissionBase(BaseModel):
    submitted_data: Dict[str, Any]

class SubmissionCreate(SubmissionBase):
    pass

class Submission(SubmissionBase):
    id: int
    form_version_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Form Version Schemas
class FormVersionBase(BaseModel):
    version_number: int = 1
    is_published: bool = False

class FormVersionCreate(FormVersionBase):
    fields: List[FieldCreate] = []

class FormVersion(FormVersionBase):
    id: int
    form_id: int
    created_at: datetime
    fields: List[Field] = []

    class Config:
        from_attributes = True


# Form Schemas
class FormBase(BaseModel):
    title: str
    description: Optional[str] = None
    is_active: bool = True

class FormCreate(FormBase):
    # Creating a form usually creates version 1 by default with fields
    initial_fields: Optional[List[FieldCreate]] = []

class FormUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None

class Form(FormBase):
    id: int
    created_at: datetime
    updated_at: datetime
    versions: List[FormVersion] = []

    class Config:
        from_attributes = True


# Simple schemas for listing / lightweight responses
class FormSimple(FormBase):
    id: int
    created_at: datetime
    updated_at: datetime
    latest_version_number: Optional[int] = None
    submission_count: int = 0

    class Config:
        from_attributes = True
