from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.rule import ConditionalRule
from app.schemas.rule import RuleCreate, RuleResponse


router = APIRouter(
    prefix="/forms/{form_id}/rules",
    tags=["conditional-rules"],
)


@router.post(
    "",
    response_model=RuleResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_rule(
    form_id: int,
    rule_in: RuleCreate,
    db: Session = Depends(get_db),
):
    db_rule = ConditionalRule(
        form_id=form_id,
        trigger_field_id=rule_in.trigger_field_id,
        operator=rule_in.operator,
        comparison_value=rule_in.comparison_value,
        target_field_id=rule_in.target_field_id,
        action=rule_in.action,
    )

    db.add(db_rule)
    db.commit()
    db.refresh(db_rule)

    return db_rule


@router.get(
    "",
    response_model=List[RuleResponse],
)
def get_rules(
    form_id: int,
    db: Session = Depends(get_db),
):
    return (
        db.query(ConditionalRule)
        .filter(ConditionalRule.form_id == form_id)
        .all()
    )


@router.delete(
    "/{rule_id}",
    status_code=status.HTTP_200_OK,
)
def delete_rule(
    form_id: int,
    rule_id: int,
    db: Session = Depends(get_db),
):
    db_rule = (
        db.query(ConditionalRule)
        .filter(
            ConditionalRule.id == rule_id,
            ConditionalRule.form_id == form_id,
        )
        .first()
    )

    if not db_rule:
        raise HTTPException(
            status_code=404,
            detail="Conditional rule not found under this form context.",
        )

    db.delete(db_rule)
    db.commit()

    return {
        "message": "Conditional rule successfully deleted."
    }