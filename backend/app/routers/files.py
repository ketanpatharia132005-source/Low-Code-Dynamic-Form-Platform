from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from pathlib import Path

from app.database import get_db
from app.services.file_service import FileService, UPLOAD_DIR
from app.models.file_storage import FileStorage

router = APIRouter(
    prefix="/files",
    tags=["Files"],
)


@router.post("/upload")
def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """
    Upload a single file and return its unique file key.
    """

    saved_file = FileService.save_file(
        db=db,
        file=file,
    )

    return {
        "message": "File uploaded successfully",
        "file_id": saved_file.id,
        "file_key": saved_file.file_key,
        "original_name": saved_file.original_name,
        "content_type": saved_file.content_type,
        "size": saved_file.size,
    }


@router.get("/{file_key}")
def download_file(
    file_key: str,
    db: Session = Depends(get_db),
):
    """
    Download a previously uploaded file using its file_key.
    """

    file_record = (
        db.query(FileStorage)
        .filter(FileStorage.file_key == file_key)
        .first()
    )

    if not file_record:
        raise HTTPException(status_code=404, detail="File not found")

    file_path = UPLOAD_DIR / file_record.file_key

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Physical file not found")

    return FileResponse(
        path=file_path,
        media_type=file_record.content_type,
        filename=file_record.original_name,
    )