print("RUNNING: backend/app/main.py")
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import form, forms, submission, user, field_types
from app.database import engine, Base
from app.routers import rule
import app.models
from app.models.file_storage import FileStorage
from app.routers import files

print("\n=== Registered Tables ===")
print(Base.metadata.tables.keys())
print("=========================\n")
# Attempt to auto-create tables during local startup if not running Alembic migrations.
# In production, Alembic migrations are preferred.

Base.metadata.create_all(bind=engine)



app = FastAPI(
    title=settings.PROJECT_NAME,
    description=(
        "A powerful low-code platform for creating dynamic forms, "
        "managing field schemas, versioning workflows, and collecting submissions."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)


# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check endpoint
@app.get(
    "/health",
    status_code=status.HTTP_200_OK,
    tags=["system"],
)
def health_check():
    """System health status check."""
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "database": "connected",
    }


# Mount application routers
app.include_router(
    form.router,
    prefix=settings.API_V1_STR,
)

app.include_router(
    forms.router,
    prefix=settings.API_V1_STR,
)

app.include_router(
    submission.router,
    prefix=settings.API_V1_STR,
)


app.include_router(
    user.router,
    prefix=settings.API_V1_STR,
)
app.include_router(
    field_types.router,
    prefix=settings.API_V1_STR,
)

app.include_router(
    rule.router,
    prefix="/api/v1")

app.include_router(
    files.router,
    prefix=settings.API_V1_STR,
)



if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )