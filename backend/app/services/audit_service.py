from sqlalchemy.orm import Session

from app.models.audit_log import AuditLog


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

def get_audit_logs(db: Session):
    return (
        db.query(AuditLog)
        .order_by(AuditLog.created_at.desc())
        .all()
    )