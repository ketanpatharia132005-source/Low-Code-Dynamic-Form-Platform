from sqlalchemy import Column, Integer, String, BigInteger, DateTime
from sqlalchemy.sql import func

from app.database import Base


class FileStorage(Base):
    __tablename__ = "file_storage"

    id = Column(Integer, primary_key=True, index=True)

    # Unique filename stored on disk (UUID-based)
    file_key = Column(String, unique=True, nullable=False, index=True)

    # Original filename uploaded by the user
    original_name = Column(String, nullable=False)

    # MIME type (application/pdf, image/png, etc.)
    content_type = Column(String, nullable=False)

    # File size in bytes
    size = Column(BigInteger, nullable=False)

    # Upload timestamp
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())