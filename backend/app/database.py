from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings

# Create database engine
# Note: For SQLite, we might use connect_args={"check_same_thread": False}, but for PostgreSQL we don't.
engine = create_engine(settings.DATABASE_URL)

# Create session maker
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

# Dependency to get db session in API routers
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
