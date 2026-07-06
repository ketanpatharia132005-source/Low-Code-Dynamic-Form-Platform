from sqlalchemy import Column, Integer, String, ForeignKey, JSON
from sqlalchemy.orm import relationship

from app.base import Base


class Field(Base):
    __tablename__ = "fields"

    id = Column(Integer, primary_key=True, index=True)

    form_id = Column(Integer, ForeignKey("forms.id"), nullable=False)

    label = Column(String, nullable=False)

    field_type = Column(String, nullable=False)

    config = Column(JSON, nullable=False)

    display_order = Column(Integer, default=0)

    form = relationship("Form", back_populates="fields")