from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.base import Base


class Form(Base):
    __tablename__ = "forms"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)

    fields = relationship("Field", back_populates="form", cascade="all, delete-orphan")