from datetime import datetime
import secrets

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.base import Base
from sqlalchemy.sql import func


class Form(Base):
    __tablename__ = "forms"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String, nullable=False)
    description = Column(String, nullable=True)

    status = Column(String, default="draft", nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    owner_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    owner = relationship(
        "User",
        back_populates="forms"
    )

    fields = relationship(
        "Field",
        back_populates="form",
        cascade="all, delete-orphan",
        order_by="Field.display_order"
    )

    versions = relationship(
        "FormVersion",
        back_populates="form",
        cascade="all, delete-orphan"
    )

class FormShareLink(Base):
    __tablename__ = "form_share_links"

    id = Column(Integer, primary_key=True, index=True)
    link_token = Column(String, unique=True, index=True, default=lambda: secrets.token_urlsafe(8))
    form_id = Column(Integer, ForeignKey("forms.id", ondelete="CASCADE"), nullable=False)
    form_version_id = Column(Integer, ForeignKey("form_versions.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())