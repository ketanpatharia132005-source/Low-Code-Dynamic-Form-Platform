from fastapi import FastAPI
from app.database import engine
from app.base import Base
from app.routers import user

from app.models.user import User
from app.routers import field_types
from app.models.form import Form
from app.models.field import Field
from app.models.form_version import FormVersion
from fastapi.middleware.cors import CORSMiddleware
from app.routers import forms


app = FastAPI(
    title="Low-Code Dynamic Form Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)
app.include_router(user.router)

app.include_router(field_types.router)
app.include_router(forms.router)

@app.get("/")
def root():
    return {
        "message": "Welcome to Low-Code Dynamic Form Platform"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "message": "Backend is running"
    }

#Temporary code
@app.get("/db-test")
def db_test():
    try:
        connection = engine.connect()
        connection.close()
        return {"message": "Database Connected Successfully"}
    except Exception as e:
        return {"error": str(e)}