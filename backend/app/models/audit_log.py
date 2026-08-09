from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func

from app.base import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)

    actor_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    action = Column(String, nullable=False)

    entity_type = Column(String, nullable=False)

    entity_id = Column(String, nullable=True)

    details = Column(JSON, nullable=True)

    records_affected = Column(Integer, default=0)

    ip_address = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())