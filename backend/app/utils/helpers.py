import re

def slugify(text: str) -> str:
    """
    Convert a string label into a system-friendly field name (slug).
    e.g., "First Name!" -> "first_name"
    """
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s_]', '', text)
    text = re.sub(r'[\s_]+', '_', text)
    return text.strip('_')
