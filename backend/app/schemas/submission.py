from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel

class AvailableField(BaseModel):
    id: str
    label: str


class ResponseSummary(BaseModel):
    id: int
    response_id: str
    created_at: datetime
    summary: Dict[str, Any]

    class Config:
        from_attributes = True


class ResponseListResponse(BaseModel):
    total: int
    count: int
    limit: int
    offset: int
    responses: List[ResponseSummary]
    available_fields: List[AvailableField]


class ResponseField(BaseModel):
    field_id: int
    field_label: str
    value: Optional[Any] = None
    display_name: Optional[str] = None


class ResponseDetail(BaseModel):
    response_id: str
    created_at: datetime
    responses: List[ResponseField]

    class Config:
        from_attributes = True

