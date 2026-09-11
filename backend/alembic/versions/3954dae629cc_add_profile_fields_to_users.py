"""add profile fields to users

Revision ID: 3954dae629cc
Revises: db548434ab2f
Create Date: 2026-08-10 11:29:49.971120

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.

revision: str = "3954dae629cc"
down_revision: Union[str, Sequence[str], None] = "db548434ab2f"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.add_column(
        "users",
        sa.Column(
            "full_name",
            sa.String(length=150),
            nullable=True
        )
    )

    op.add_column(
        "users",
        sa.Column(
            "date_of_birth",
            sa.String(length=20),
            nullable=True
        )
    )

    op.add_column(
        "users",
        sa.Column(
            "phone",
            sa.String(length=20),
            nullable=True
        )
    )

    op.add_column(
        "users",
        sa.Column(
            "bio",
            sa.String(length=500),
            nullable=True
        )
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_column("users", "bio")
    op.drop_column("users", "phone")
    op.drop_column("users", "date_of_birth")
    op.drop_column("users", "full_name")