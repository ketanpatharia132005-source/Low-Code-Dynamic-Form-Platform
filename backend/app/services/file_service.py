import os
import uuid
import shutil
from pathlib import Path

from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.models.file_storage import FileStorage

# Upload directory
UPLOAD_DIR = Path("uploads/forms")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


class FileService:

    @staticmethod
    def save_file(
        db: Session,
        file: UploadFile,
        allowed_types=None,
        max_size_mb=10,
        
    ):
        """
        Save uploaded file to local storage after validation.
        Returns metadata for database storage.
        """

        if allowed_types is None:
            allowed_types = []

        # Read file bytes
        contents = file.file.read()

        # File size
        file_size = len(contents)

        # Validate size
        if file_size > max_size_mb * 1024 * 1024:
            raise HTTPException(
                status_code=400,
                detail=f"File exceeds {max_size_mb} MB limit."
            )

        # Validate extension
        extension = os.path.splitext(file.filename)[1].lower()

        if allowed_types:
            normalized = [
                ext if ext.startswith(".") else f".{ext}"
                for ext in allowed_types
            ]

            if extension not in normalized:
                raise HTTPException(
                    status_code=400,
                    detail="Invalid file type."
                )

        # Generate unique filename
        unique_name = f"{uuid.uuid4()}{extension}"

        file_path = UPLOAD_DIR / unique_name

        # Save file
        with open(file_path, "wb") as buffer:
            buffer.write(contents)

        file_record = FileStorage(
            file_key= unique_name,
            original_name= file.filename,
            content_type= file.content_type,
            size= file_size,
        )

        db.add(file_record)
        db.commit()
        db.refresh(file_record)

        return file_record
    