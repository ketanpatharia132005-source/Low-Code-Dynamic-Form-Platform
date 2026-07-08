from pydantic import BaseModel
from typing import Optional, List


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


class FormResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    owner_id: int
    fields: List[FieldResponse] = []

class FieldReorderItem(BaseModel):
    field_id: int
    display_order: int

    class Config:
        from_attributes = True