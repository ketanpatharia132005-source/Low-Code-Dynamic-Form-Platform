from typing import List, Optional

from fastapi import HTTPException
from sqlalchemy.orm import Session

from typing import Any, Dict

from app.models.submission import Submission
from app.schemas.form import SubmissionCreate

from app.models.form import Form
from app.models.form_version import FormVersion
from app.schemas.form import (
    FormCreate,
    FormUpdate,
    FormVersionCreate,
)
from app.services.validation import validate_submission
import uuid


class FormService:

    @staticmethod
    def get_forms(
        db: Session,
        skip: int = 0,
        limit: int = 100,
    ) -> List[Form]:
        return (
            db.query(Form)
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def get_form_by_id(
        db: Session,
        form_id: int,
    ) -> Optional[Form]:
        form = (
            db.query(Form)
            .filter(Form.id == form_id)
            .first()
        )

        if not form:
            raise HTTPException(
                status_code=404,
                detail="Form not found",
            )

        return form

    @staticmethod
    def create_form(
        db: Session,
        form_in: FormCreate,
    ) -> Form:
        db_form = Form(
            title=form_in.title,
            description=form_in.description,
            status="draft",
            owner_id=1,
        )

        db.add(db_form)
        db.flush()

        db_version = FormVersion(
            form_id=db_form.id,
            version_number=1,
            snapshot={},
            status="draft",
        )

        db.add(db_version)

        db.commit()
        db.refresh(db_form)

        return db_form

    @staticmethod
    def update_form(
        db: Session,
        form_id: int,
        form_in: FormUpdate,
    ) -> Form:
        db_form = FormService.get_form_by_id(
            db,
            form_id,
        )

        update_data = form_in.model_dump(
            exclude_unset=True
        )

        for key, value in update_data.items():
            setattr(db_form, key, value)

        db.commit()
        db.refresh(db_form)

        return db_form

    @staticmethod
    def delete_form(
        db: Session,
        form_id: int,
    ) -> bool:
        db_form = (
            db.query(Form)
            .filter(Form.id == form_id)
            .first()
        )

        if not db_form:
            raise HTTPException(
                status_code=404,
                detail="Form not found",
            )

        db.delete(db_form)
        db.commit()

        return True

    @staticmethod
    def create_form_version(
        db: Session,
        form_id: int,
        version_in: FormVersionCreate,
    ) -> FormVersion:
        FormService.get_form_by_id(
            db,
            form_id,
        )

        latest_version = (
            db.query(FormVersion)
            .filter(FormVersion.form_id == form_id)
            .order_by(
                FormVersion.version_number.desc()
            )
            .first()
        )

        if latest_version:
            next_version_number = (
                latest_version.version_number + 1
            )
        else:
            next_version_number = 1

        db_version = FormVersion(
            form_id=form_id,
            version_number=next_version_number,
            snapshot=version_in.snapshot,
            status=version_in.status or "draft",
        )

        db.add(db_version)
        db.commit()
        db.refresh(db_version)

        return db_version
    
    @staticmethod
    def submit_data(
        db: Session,
        form_version_id: int,
        submission_in: SubmissionCreate,
    ) -> Submission:

        version = (
            db.query(FormVersion)
            .filter(FormVersion.id == form_version_id)
            .first()
        )

        if not version:
            raise HTTPException(
                  status_code=404,
                  detail="Form version not found",
            )

        # -----------------------------
        # Load fields from published snapshot
        # -----------------------------
        snapshot = version.snapshot or {}
        fields = snapshot.get("fields", [])
        print(fields)

        # -----------------------------
        # Validate submission
        # -----------------------------
        print("\n========== SUBMIT DATA ==========")
        print("Form Version ID:", form_version_id)
        print("Fields Count:", len(fields))
        print("Fields:", fields)
        print("Submitted Data:", submission_in.submitted_data)
        print("=================================\n")
        
        errors = validate_submission(
            fields,
            submission_in.submitted_data,
        )

        if errors:
            raise HTTPException(
               status_code=400,
               detail={
                 "success": False,
                 "message": "Validation failed.",
                 "errors": errors,
               },
            )

        # -----------------------------
        # Save submission
        # -----------------------------
        db_submission = Submission(
            response_id=f"resp_{uuid.uuid4().hex[:10]}",
            form_version_id=form_version_id,
            submitted_data=submission_in.submitted_data,
        )

        db.add(db_submission)
        db.commit()
        db.refresh(db_submission)

        return db_submission

    @staticmethod
    def get_form_analytics(db: Session, form_id: int):
        # Get all published versions of the form
        version_ids = (
            db.query(FormVersion.id)
            .filter(FormVersion.form_id == form_id)
            .all()
        )

        version_ids = [v.id for v in version_ids]

        if not version_ids:
            return {
                "total_submissions": 0,
                "completed_forms": 0,
                "incomplete_forms": 0,
                "completion_rate": 0.0,
                "average_completion_time": 0,
            }

        total_submissions = (
            db.query(Submission)
            .filter(Submission.form_version_id.in_(version_ids))
            .count()
        )

        completed_forms = total_submissions

        incomplete_forms = 0

        completion_rate = (
            (completed_forms / total_submissions) * 100
            if total_submissions > 0
            else 0.0
        )

        average_completion_time = 0

        # ----------------------------------------
        # Per-field distribution analytics
        # ----------------------------------------

        field_distributions = []

        versions = (
            db.query(FormVersion)
            .filter(FormVersion.form_id == form_id)
            .all()
        )

        for version in versions:

            snapshot = version.snapshot or {}

            fields = snapshot.get("fields", [])

            submissions = (
                db.query(Submission)
                .filter(
                    Submission.form_version_id == version.id
                )
                .all()
            )

            for field in fields:

                if field["field_type"] not in [
                    "dropdown",
                    "rating",
                ]:
                    continue

                counts = {}

                total = 0

                for submission in submissions:

                    submitted = submission.submitted_data or []

                    value = None

                    for response in submitted:

                       if str(response["field_id"]) == str(field["id"]):
                          value = response["value"]
                          break

                    if value is None:
                         continue

                    if isinstance(value,list):
                        for item in value:
                            counts[item] = counts.get(item,0) + 1


                    else:

                      counts[value] = counts.get(value, 0) + 1

                      total += 1

                distribution = []

                for label, count in counts.items():

                    distribution.append({
                        "label": str(label),
                        "count": count,
                        "percentage": round(
                            (count / total) * 100 if total else 0,
                            2,
                        ),
                    })

                field_distributions.append({
                    "field_id": field["id"],
                    "field_label": field["label"],
                    "field_type": field["field_type"],
                    "distribution": distribution,
                })

        return {
            "total_submissions": total_submissions,
            "completed_forms": completed_forms,
            "incomplete_forms": incomplete_forms,
            "completion_rate": round(completion_rate, 2),
            "average_completion_time": average_completion_time,
            "field_distributions": field_distributions,
        }

    