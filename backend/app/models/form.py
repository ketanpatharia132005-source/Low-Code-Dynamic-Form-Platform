import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship
from app.database import Base

class Form(Base):
    __tablename__ = "forms"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    versions = relationship("FormVersion", back_populates="form", cascade="all, delete-orphan")


class FormVersion(Base):
    __tablename__ = "form_versions"

    id = Column(Integer, primary_key=True, index=True)
    form_id = Column(Integer, ForeignKey("forms.id", ondelete="CASCADE"), nullable=False)
    version_number = Column(Integer, nullable=False, default=1)
    is_published = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    form = relationship("Form", back_populates="versions")
    fields = relationship("Field", back_populates="form_version", order_by="Field.order", cascade="all, delete-orphan")
    submissions = relationship("Submission", back_populates="form_version", cascade="all, delete-orphan")


class Field(Base):
    __tablename__ = "fields"

    id = Column(Integer, primary_key=True, index=True)
    form_version_id = Column(Integer, ForeignKey("form_versions.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(100), nullable=False)  # system key, e.g., "first_name"
    label = Column(String(255), nullable=False)  # display label, e.g., "First Name"
    field_type = Column(String(50), nullable=False)  # "text", "number", "select", "radio", "checkbox", "textarea", "date"
    is_required = Column(Boolean, default=False)
    placeholder = Column(String(255), nullable=True)
    validation_rules = Column(JSON, nullable=True)  # min, max, regex, custom message
    order = Column(Integer, nullable=False, default=0)

    # Relationships
    form_version = relationship("FormVersion", back_populates="fields")
    options = relationship("FieldOption", back_populates="field", order_by="FieldOption.order", cascade="all, delete-orphan")


class FieldOption(Base):
    __tablename__ = "field_options"

    id = Column(Integer, primary_key=True, index=True)
    field_id = Column(Integer, ForeignKey("fields.id", ondelete="CASCADE"), nullable=False)
    label = Column(String(255), nullable=False)  # display label, e.g., "Option A"
    value = Column(String(255), nullable=False)  # store value, e.g., "a"
    order = Column(Integer, nullable=False, default=0)

    # Relationships
    field = relationship("Field", back_populates="options")


class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    form_version_id = Column(Integer, ForeignKey("form_versions.id", ondelete="CASCADE"), nullable=False)
    submitted_data = Column(JSON, nullable=False)  # Key-value JSON representing submitted values
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    form_version = relationship("FormVersion", back_populates="submissions")
