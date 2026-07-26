from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, JSON, String
from sqlalchemy.orm import relationship

from app.base import Base


class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)

    response_id = Column(
        String(50),
        unique=True,
        nullable=False,
        index=True,
    )

    form_version_id = Column(
        Integer,
        ForeignKey("form_versions.id", ondelete="CASCADE"),
        nullable=False,
    )

    submitted_data = Column(JSON, nullable=False)

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )

    form_version = relationship(
        "FormVersion",
        back_populates="submissions",
    )