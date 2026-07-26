import re
from datetime import datetime


EMAIL_REGEX = re.compile(
    r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"
)


def validate_field(field, value):
    """
    Validate a single field.

    Returns:
        None -> valid
        str  -> error message
    """

    config = field.get("config", {})
    field_type = field.get("field_type", "").lower()

     # ===== DEBUG =====
    print("\n========== VALIDATION ==========")
    print("Label      :", field.get("label"))
    print("Type       :", field_type)
    print("Config     :", config)
    print("Value      :", value)
    print("Min Length :", config.get("min_length"))
    print("Max Length :", config.get("max_length"))
    print("Required   :", config.get("required"))
    print("===============================\n")

    # -----------------------------
    # Required Validation
    # -----------------------------
    if config.get("required", False):
        if value is None or str(value).strip() == "":
            return "This field is required."

    # Empty optional fields are valid
    if value is None or str(value).strip() == "":
        return None

    # -----------------------------
    # TEXT
    # -----------------------------
    if field_type == "text":

        text = str(value)

        min_length = config.get("min_length")
        max_length = config.get("max_length")

        if min_length is not None and len(text) < min_length:
            return f"Minimum {min_length} characters."

        if max_length is not None and len(text) > max_length:
            return f"Maximum {max_length} characters."

    # -----------------------------
    # EMAIL
    # -----------------------------
    elif field_type == "email":

        if not EMAIL_REGEX.match(str(value)):
            return "Invalid email format."

    # -----------------------------
    # NUMBER
    # -----------------------------
    elif field_type == "number":

        try:
            number = float(value)
        except:
            return "Must be a valid number."

        integer_only = config.get("integer_only", False)

        if integer_only and not number.is_integer():
            return "Must be an integer."

        min_value = config.get("min")

        if min_value is not None and number < min_value:
            return f"Must be >= {min_value}."

        max_value = config.get("max")

        if max_value is not None and number > max_value:
            return f"Must be <= {max_value}."

    # -----------------------------
    # DATE
    # -----------------------------
    elif field_type == "date":

        try:
            date = datetime.strptime(value, "%Y-%m-%d").date()
        except:
            return "Invalid date format."

        min_date = config.get("min_date")
        max_date = config.get("max_date")

        if min_date:
            min_date = datetime.strptime(min_date, "%Y-%m-%d").date()

            if date < min_date:
                return "Date is before minimum allowed date."

        if max_date:
            max_date = datetime.strptime(max_date, "%Y-%m-%d").date()

            if date > max_date:
                return "Date is after maximum allowed date."

    # -----------------------------
    # DROPDOWN
    # -----------------------------
    elif field_type == "dropdown":

        options = config.get("options", [])

        valid_options = [
            option["label"] if isinstance(option, dict) else option
            for option in options
        ]

        if value not in valid_options:
            return "Invalid selection."

    return None


def validate_submission(fields, responses):
    """
    Validate all fields.

    Returns:
        {
            "field_id": {
                "label": "...",
                "message": "..."
            }
        }
    """

    errors = {}

    for field in fields:

        value = responses.get(str(field.get("id")))

        error = validate_field(field, value)

        if error:
            errors[str(field.get("id"))] = {
                "label": field.get("label", "Field"),
                "message": error,
            }

    return errors