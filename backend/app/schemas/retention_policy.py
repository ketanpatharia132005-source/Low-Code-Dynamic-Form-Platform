from pydantic import BaseModel


class RetentionPolicyBase(BaseModel):
    retention_days: int
    action: str = "archive"
    is_active: bool = True


class RetentionPolicyCreate(RetentionPolicyBase):
    pass


class RetentionPolicyResponse(RetentionPolicyBase):
    id: int
    form_id: int

    class Config:
        from_attributes = True