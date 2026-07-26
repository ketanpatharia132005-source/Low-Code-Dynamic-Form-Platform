from sqlalchemy import Column, Integer, String, ForeignKey, Enum
from sqlalchemy.orm import relationship
import enum
from app.base import Base

class OperatorEnum(str, enum.Enum):
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

class ActionEnum(str, enum.Enum):
    show = "show"
    hide = "hide"
    require = "require"

class ConditionalRule(Base):
    __tablename__ = "conditional_rules"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True)
    form_id = Column(Integer, ForeignKey("forms.id", ondelete="CASCADE"), nullable=False)
    trigger_field_id = Column(String, nullable=False)  # Corresponds to field's tracking identifier
    operator = Column(Enum(OperatorEnum), nullable=False)
    comparison_value = Column(String, default="")
    target_field_id = Column(String, nullable=False)
    action = Column(Enum(ActionEnum), nullable=False)

    form = relationship("Form", back_populates="conditional_rules")