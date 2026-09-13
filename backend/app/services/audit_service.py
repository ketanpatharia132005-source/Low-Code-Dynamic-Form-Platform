from sqlalchemy.orm import Session

from app.models.audit_log import AuditLog
# from sqlalchemy import cast, Integer
# from sqlalchemy.dialects.postgresql import JSONB
from app.models.form import Form


def create_audit_log(
    db: Session,
    actor_id: int | None,
    action: str,
    entity_type: str,
    entity_id: str | None,
    details: dict | None,
    records_affected: int,
    ip_address: str | None,
):
    log = AuditLog(
        actor_id=actor_id,
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        details=details,
        records_affected=records_affected,
        ip_address=ip_address,
    )

    db.add(log)
    db.commit()

    return log

def get_audit_logs(db: Session, actor_id: int):
    owned_form_ids = {
        form_id
        for (form_id,) in (
            db.query(Form.id)
            .filter(Form.owner_id == actor_id)
            .all()
        )
    }

    all_logs = (
        db.query(AuditLog)
        .order_by(AuditLog.created_at.desc())
        .all()
    )

    visible_logs = []

    for log in all_logs:
        if log.actor_id == actor_id:
            visible_logs.append(log)
            continue

        details = log.details or {}
        form_id = details.get("form_id")

        if form_id is not None and int(form_id) in owned_form_ids:
            visible_logs.append(log)

    return visible_logs