from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, JSON, String
from sqlalchemy.orm import relationship

from app.base import Base


class FormVersion(Base):
    __tablename__ = "form_versions"

    id = Column(Integer, primary_key=True, index=True)

    form_id = Column(
        Integer,
        ForeignKey("forms.id"),
        nullable=False
    )

    version_number = Column(Integer, nullable=False)

    snapshot = Column(JSON, nullable=False)

    status = Column(String, default="published", nullable=False)

    published_at = Column(DateTime, default=datetime.utcnow)

    form = relationship(
        "Form",
        back_populates="versions"
    )