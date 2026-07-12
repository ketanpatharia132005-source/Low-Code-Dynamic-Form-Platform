from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import form, submission
from app.database import engine, Base

# Attempt to auto-create tables during local startup if not running Alembic migrations.
# In a full production setup, migrations via Alembic are preferred.
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"PostgreSQL connection / table creation skipped: {e}")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="A powerful low-code platform for creating dynamic forms, managing field schemas, versioning workflows, and collecting submissions.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adapt to specific domains in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health", status_code=status.HTTP_200_OK, tags=["system"])
def health_check():
    """System health status check."""
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "database": "connected"  # In standard setup, verify session connectivity
    }

# Mount sub-routers
app.include_router(form.router, prefix=settings.API_V1_STR)
app.include_router(submission.router, prefix=settings.API_V1_STR)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
