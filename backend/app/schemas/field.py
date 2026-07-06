from typing import List, Optional, Literal

from pydantic import BaseModel, Field


class TextFieldConfig(BaseModel):
    placeholder: Optional[str] = None
    min_length: int = 0
    max_length: int = 255
    required: bool = False


class NumberFieldConfig(BaseModel):
    min: Optional[float] = None
    max: Optional[float] = None
    integer_only: bool = False
    required: bool = False


class EmailFieldConfig(BaseModel):
    placeholder: Optional[str] = None
    required: bool = False


class DropdownFieldConfig(BaseModel):
    options: List[str]
    required: bool = False


class CheckboxFieldConfig(BaseModel):
    options: List[str]
    required: bool = False


class DateFieldConfig(BaseModel):
    min_date: Optional[str] = None
    max_date: Optional[str] = None
    required: bool = False


class FileUploadFieldConfig(BaseModel):
    allowed_types: List[str]
    max_size_mb: int = 5
    required: bool = False


class RatingFieldConfig(BaseModel):
    scale: int = Field(default=5, ge=1, le=10)
    required: bool = False


class FieldTypeResponse(BaseModel):
    type: Literal[
        "text",
        "number",
        "email",
        "dropdown",
        "checkbox",
        "date",
        "file",
        "rating",
    ]
    label: str
    config: dict