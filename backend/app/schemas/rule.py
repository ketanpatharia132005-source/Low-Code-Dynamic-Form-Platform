from enum import Enum

from pydantic import BaseModel


class OperatorEnum(str, Enum):
    equals = "equals"
    not_equals = "not_equals"

    greater_than = "greater_than"
    less_than = "less_than"

    greater_than_or_equal = "greater_than_or_equal"
    less_than_or_equal = "less_than_or_equal"

    contains = "contains"

    starts_with = "starts_with"
    ends_with = "ends_with"

    is_empty = "is_empty"
    is_not_empty = "is_not_empty"


class ActionEnum(str, Enum):
    show = "show"
    hide = "hide"
    require = "require"


class RuleBase(BaseModel):
    trigger_field_id: str
    operator: OperatorEnum
    comparison_value: str = ""
    target_field_id: str
    action: ActionEnum


class RuleCreate(RuleBase):
    pass


class RuleResponse(RuleBase):
    id: int
    form_id: int

    class Config:
        from_attributes = True