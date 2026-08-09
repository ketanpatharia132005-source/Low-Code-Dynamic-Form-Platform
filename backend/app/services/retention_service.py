from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from app.models.retention_policy import RetentionPolicy
from app.models.submission import Submission
from app.models.form_version import FormVersion
from app.services.audit_service import create_audit_log


def run_retention_job(db: Session):
    policies = (
        db.query(RetentionPolicy)
        .filter(RetentionPolicy.is_active == True)
        .all()
    )

    archived_count = 0

    for policy in policies:
        cutoff_date = datetime.utcnow() - timedelta(
            days=policy.retention_days
        )

        submissions = (
            db.query(Submission)
            .join(FormVersion)
            .filter(
                FormVersion.form_id == policy.form_id,
                Submission.created_at < cutoff_date,
                Submission.is_archived == False,
            )
            .all()
        )

        for submission in submissions:
            submission.is_archived = True
            submission.archived_at = datetime.utcnow()
            archived_count += 1

    db.commit()

    create_audit_log(
    db=db,
    actor_id=None,
    action="archive",
    entity_type="submission",
    entity_id=None,
    details={
        "retention_job": True,
    },
    records_affected=archived_count,
    ip_address=None,
)

    return archived_count