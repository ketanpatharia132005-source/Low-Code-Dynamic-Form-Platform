from sqlalchemy.orm import Session, joinedload
from app.models.form import Form, FormVersion, Field, FieldOption, Submission
from app.schemas.form import FormCreate, FormUpdate, FormVersionCreate, SubmissionCreate, FieldCreate
from typing import List, Optional, Dict, Any
from fastapi import HTTPException, status

class FormService:
    @staticmethod
    def get_forms(db: Session, skip: int = 0, limit: int = 100) -> List[Form]:
        return db.query(Form).offset(skip).limit(limit).all()

    @staticmethod
    def get_form_by_id(db: Session, form_id: int) -> Optional[Form]:
        form = db.query(Form).filter(Form.id == form_id).first()
        if not form:
            raise HTTPException(status_code=404, detail="Form not found")
        return form

    @staticmethod
    def create_form(db: Session, form_in: FormCreate) -> Form:
        # Create form metadata
        db_form = Form(
            title=form_in.title,
            description=form_in.description,
            is_active=form_in.is_active
        )
        db.add(db_form)
        db.flush()  # Get db_form.id

        # Create version 1 by default
        db_version = FormVersion(
            form_id=db_form.id,
            version_number=1,
            is_published=True  # Default to published for initial version
        )
        db.add(db_version)
        db.flush()  # Get db_version.id

        # Add initial fields
        if form_in.initial_fields:
            for i, field_in in enumerate(form_in.initial_fields):
                db_field = Field(
                    form_version_id=db_version.id,
                    name=field_in.name,
                    label=field_in.label,
                    field_type=field_in.field_type,
                    is_required=field_in.is_required,
                    placeholder=field_in.placeholder,
                    validation_rules=field_in.validation_rules,
                    order=field_in.order or i
                )
                db.add(db_field)
                db.flush()

                # Add option elements if type is select/radio/checkbox
                if field_in.options:
                    for opt_i, option_in in enumerate(field_in.options):
                        db_option = FieldOption(
                            field_id=db_field.id,
                            label=option_in.label,
                            value=option_in.value,
                            order=option_in.order or opt_i
                        )
                        db.add(db_option)

        db.commit()
        db.refresh(db_form)
        return db_form

    @staticmethod
    def update_form(db: Session, form_id: int, form_in: FormUpdate) -> Form:
        db_form = FormService.get_form_by_id(db, form_id)
        
        update_data = form_in.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_form, key, value)
            
        db.commit()
        db.refresh(db_form)
        return db_form

    @staticmethod
    def delete_form(db: Session, form_id: int) -> bool:
        db_form = db.query(Form).filter(Form.id == form_id).first()
        if not db_form:
            raise HTTPException(status_code=404, detail="Form not found")
        db.delete(db_form)
        db.commit()
        return True

    @staticmethod
    def create_form_version(db: Session, form_id: int, version_in: FormVersionCreate) -> FormVersion:
        FormService.get_form_by_id(db, form_id) # Verify form exists
        
        # Get latest version number
        latest_version = db.query(FormVersion)\
            .filter(FormVersion.form_id == form_id)\
            .order_by(FormVersion.version_number.desc())\
            .first()
            
        next_version_num = (latest_version.version_number + 1) if latest_version else 1
        
        db_version = FormVersion(
            form_id=form_id,
            version_number=next_version_num,
            is_published=version_in.is_published
        )
        db.add(db_version)
        db.flush()

        # Add fields
        for i, field_in in enumerate(version_in.fields):
            db_field = Field(
                form_version_id=db_version.id,
                name=field_in.name,
                label=field_in.label,
                field_type=field_in.field_type,
                is_required=field_in.is_required,
                placeholder=field_in.placeholder,
                validation_rules=field_in.validation_rules,
                order=field_in.order or i
            )
            db.add(db_field)
            db.flush()

            if field_in.options:
                for opt_i, option_in in enumerate(field_in.options):
                    db_option = FieldOption(
                        field_id=db_field.id,
                        label=option_in.label,
                        value=option_in.value,
                        order=option_in.order or opt_i
                    )
                    db.add(db_option)

        db.commit()
        db.refresh(db_version)
        return db_version

    @staticmethod
    def submit_data(db: Session, form_version_id: int, submission_in: SubmissionCreate) -> Submission:
        # Verify form version exists and is active/published
        version = db.query(FormVersion).filter(FormVersion.id == form_version_id).first()
        if not version:
            raise HTTPException(status_code=404, detail="Form version not found")
            
        # Validate data against version fields
        validated_data = FormService.validate_submission(version, submission_in.submitted_data)
        
        db_submission = Submission(
            form_version_id=form_version_id,
            submitted_data=validated_data
        )
        db.add(db_submission)
        db.commit()
        db.refresh(db_submission)
        return db_submission

    @staticmethod
    def validate_submission(version: FormVersion, data: Dict[str, Any]) -> Dict[str, Any]:
        validated = {}
        fields = version.fields
        
        for field in fields:
            value = data.get(field.name)
            
            # Check required
            if field.is_required and (value is None or value == ""):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Field '{field.label}' ({field.name}) is required."
                )
            
            # Type validations & custom rules (simple demo)
            if value is not None and value != "":
                if field.field_type == "number":
                    try:
                        value = float(value) if "." in str(value) else int(value)
                    except ValueError:
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Field '{field.label}' must be a number."
                        )
                
                # Check option values
                if field.field_type in ["select", "radio"] and field.options:
                    allowed_values = [opt.value for opt in field.options]
                    if str(value) not in allowed_values:
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Value '{value}' for '{field.label}' is not valid. Allowed: {allowed_values}"
                        )
                        
            validated[field.name] = value
            
        return validated
