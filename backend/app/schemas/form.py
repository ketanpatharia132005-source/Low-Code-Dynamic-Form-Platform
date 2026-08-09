from datetime import datetime
from typing import List, Optional, Dict, Any

from pydantic import BaseModel


# =========================
# FORM SCHEMAS
# =========================

class FormCreate(BaseModel):
    title: str
    description: Optional[str] = None


class FormUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None


# =========================
# FIELD SCHEMAS
# =========================

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


# =========================
# FORM VERSION SCHEMAS
# =========================

class FormVersionCreate(BaseModel):
    snapshot: dict
    status: Optional[str] = "draft"


class FormVersionResponse(BaseModel):
    id: int
    form_id: int
    version_number: int
    snapshot: dict
    status: str
    published_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# =========================
# FORM RESPONSE SCHEMAS
# =========================

class FormResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    owner_id: int
    status: str
    fields: List[FieldResponse] = []

    class Config:
        from_attributes = True


class FormDetailResponse(FormResponse):
    versions: List[FormVersionResponse] = []


# =========================
# FIELD REORDER
# =========================

class FieldReorderItem(BaseModel):
    field_id: int
    display_order: int

    class Config:
        from_attributes = True


# =========================
# LINK GENERATION
# =========================

class LinkGenerationResponse(BaseModel):
    link_token: str
    form_version_id: int
    url: str


# =========================
# PUBLIC FORM
# =========================

class PublicFormResponse(BaseModel):
    form: Dict[str, Any]
    fields: List[Dict[str, Any]]
    version: int

class SubmissionCreate(BaseModel):
    submitted_data: Dict[str, Any]

class SubmissionDataItem(BaseModel):
    field_id: str
    field_label: str
    value: Any
    display_name: Optional[str] = None


class SubmissionResponse(BaseModel):
    id: int
    response_id: str
    form_version_id: int
    submitted_data: List[SubmissionDataItem]
    created_at: datetime

    class Config:
        from_attributes = True



class FieldDistributionItem(BaseModel):
    label: str
    count: int
    percentage: float


class FieldDistribution(BaseModel):
    field_id: int
    field_label: str
    field_type: str
    distribution: List[FieldDistributionItem]

class AnalyticsResponse(BaseModel):
    total_submissions: int
    completed_forms: int
    incomplete_forms: int
    completion_rate: float
    average_completion_time: int

    field_distributions: List[FieldDistribution] = []

    class Config:
        from_attributes = True