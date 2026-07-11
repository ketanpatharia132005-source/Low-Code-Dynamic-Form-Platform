from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class FormCreate(BaseModel):
    title: str
    description: Optional[str] = None


class FieldCreate(BaseModel):
    label: str
    field_type: str
    config: dict
    display_order: int


class FieldUpdate(BaseModel):
    label: Optional[str] = None
    field_type: Optional[str] = None
    config: Optional[dict] = None
    display_order: Optional[int] = None


class FieldResponse(BaseModel):
    id: int
    form_id: int
    label: str
    field_type: str
    config: dict
    display_order: int

    class Config:
        from_attributes = True


class FormVersionResponse(BaseModel):
    id: int
    form_id: int
    version_number: int
    snapshot: dict
    status: str
    published_at: datetime

    class Config:
        from_attributes = True


class FormResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    owner_id: int
    status: str
    fields: List[FieldResponse] = []

    class Config:
        from_attributes = True


class FormDetailResponse(FormResponse):
    versions: List[FormVersionResponse] = []


class FieldReorderItem(BaseModel):
    field_id: int
    display_order: int

    class Config:
        from_attributes = True