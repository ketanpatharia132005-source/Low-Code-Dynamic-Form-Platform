from fastapi import APIRouter

from app.schemas.field import FieldTypeResponse

router = APIRouter(
    prefix="/field-types",
    tags=["Field Types"]
)


@router.get("/", response_model=list[FieldTypeResponse])
def get_field_types():
    return [
        {
            "type": "text",
            "label": "Text",
            "config": {
                "placeholder": "",
                "min_length": 0,
                "max_length": 255,
                "required": False
            }
        },
        {
            "type": "number",
            "label": "Number",
            "config": {
                "min": None,
                "max": None,
                "integer_only": False,
                "required": False
            }
        },
        {
            "type": "email",
            "label": "Email",
            "config": {
                "placeholder": "",
                "required": False
            }
        },
        {
            "type": "dropdown",
            "label": "Dropdown",
            "config": {
                "options": [],
                "required": False
            }
        },
        {
            "type": "checkbox",
            "label": "Checkbox",
            "config": {
                "options": [],
                "required": False
            }
        },
        {
            "type": "date",
            "label": "Date",
            "config": {
                "min_date": None,
                "max_date": None,
                "required": False
            }
        },
        {
            "type": "file",
            "label": "File Upload",
            "config": {
                "allowed_types": [],
                "max_size_mb": 5,
                "required": False
            }
        },
        {
            "type": "rating",
            "label": "Rating",
            "config": {
                "scale": 5,
                "required": False
            }
        }
    ]