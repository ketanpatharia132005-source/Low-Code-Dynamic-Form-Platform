import csv
import io


from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse, JSONResponse
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.form import Form
from app.models.form_version import FormVersion
from app.models.submission import Submission

router = APIRouter(
    prefix="/forms",
    tags=["Export"],
)


@router.get("/{form_id}/export")
def export_form(
    form_id: int,
    format: str = Query(..., pattern="^(csv|json)$"),
    version_id: int | None = None,
    db: Session = Depends(get_db),
):
    # Check form exists
    form = db.query(Form).filter(Form.id == form_id).first()

    if not form:
        raise HTTPException(status_code=404, detail="Form not found")

    # Use selected version or latest published version
    if version_id:
        version = (
            db.query(FormVersion)
            .filter(
                FormVersion.id == version_id,
                FormVersion.form_id == form_id,
            )
            .first()
        )
    else:
        version = (
            db.query(FormVersion)
            .filter(
                FormVersion.form_id == form_id,
            )
            .order_by(FormVersion.version_number.desc())
            .first()
        )

    if not version:
        raise HTTPException(status_code=404, detail="Form version not found")

    submissions = (
        db.query(Submission)
        .filter(
            Submission.form_version_id == version.id
        )
        .all()
    )

    snapshot = version.snapshot or {}
    fields = snapshot.get("fields", [])

    field_labels = {
        str(field["id"]): field["label"]
        for field in fields
    }

    export_rows = []

    for submission in submissions:

        row = {}

        for answer in submission.submitted_data:

            label = field_labels.get(
                str(answer["field_id"]),
                f"Field {answer['field_id']}"
            )

            value = answer["value"]

            if isinstance(value, str):
                file_extensions = (
                   ".pdf",
                   ".doc",
                   ".docx",
                   ".png",
                   ".jpg",
                   ".jpeg",
                   ".gif",
                   ".xlsx",
                   ".xls",
                   ".ppt",
                   ".pptx",
                   ".txt",
               )

                if value.lower().endswith(file_extensions):
                    value = (
                        f"http://127.0.0.1:8001/uploads/forms/{value}"
                    )

            elif isinstance(value, dict):
                if "name" in value:
                    value = value["name"]

            row[label] = value
 
        row["Submitted At"] = submission.created_at.isoformat()

        export_rows.append(row)

    if format == "json":
        return JSONResponse(content=export_rows)

    def generate_csv():

        if not export_rows:
            raise HTTPException(
                status_code=400,
                detail="No submissions found."
            )
         

        output = io.StringIO()

        writer = csv.DictWriter(
           output,
           fieldnames=export_rows[0].keys()
        )

    # Header
        writer.writeheader()
        yield output.getvalue()

        output.seek(0)
        output.truncate(0)

    # Stream one row at a time
        for row in export_rows:

            writer.writerow(row)

            yield output.getvalue()

            output.seek(0)
            output.truncate(0)


    return StreamingResponse(
        generate_csv(),
        media_type="text/csv",
        headers={
            "Content-Disposition":
            f'attachment; filename="form_{form_id}.csv"'
        },
    )