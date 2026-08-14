"""add fraud actions

Revision ID: 13bbe4496fa8
Revises: eee14f7120d0
Create Date: 2026-08-13 21:28:51.916595
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "13bbe4496fa8"
down_revision: Union[str, Sequence[str], None] = "eee14f7120d0"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.create_table(
        "fraud_actions",
        sa.Column(
            "id",
            sa.Uuid(),
            nullable=False,
        ),
        sa.Column(
            "action_number",
            sa.String(length=100),
            nullable=False,
        ),
        sa.Column(
            "fraud_case_id",
            sa.Uuid(),
            nullable=False,
        ),
        sa.Column(
            "action_type",
            sa.String(length=100),
            nullable=False,
        ),
        sa.Column(
            "action_description",
            sa.Text(),
            nullable=False,
        ),
        sa.Column(
            "owner",
            sa.String(length=150),
            nullable=False,
        ),
        sa.Column(
            "due_date",
            sa.Date(),
            nullable=True,
        ),
        sa.Column(
            "priority",
            sa.String(length=50),
            nullable=False,
        ),
        sa.Column(
            "status",
            sa.String(length=50),
            nullable=False,
        ),
        sa.Column(
            "estimated_recovery",
            sa.Numeric(
                precision=14,
                scale=2,
            ),
            nullable=False,
        ),
        sa.Column(
            "rationale",
            sa.Text(),
            nullable=True,
        ),
        sa.Column(
            "approved_by",
            sa.String(length=150),
            nullable=True,
        ),
        sa.Column(
            "completed_date",
            sa.Date(),
            nullable=True,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["fraud_case_id"],
            ["fraud_cases.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint(
            "id",
        ),
    )

    op.create_index(
        op.f("ix_fraud_actions_action_number"),
        "fraud_actions",
        ["action_number"],
        unique=True,
    )

    op.create_index(
        op.f("ix_fraud_actions_action_type"),
        "fraud_actions",
        ["action_type"],
        unique=False,
    )

    op.create_index(
        op.f("ix_fraud_actions_completed_date"),
        "fraud_actions",
        ["completed_date"],
        unique=False,
    )

    op.create_index(
        op.f("ix_fraud_actions_due_date"),
        "fraud_actions",
        ["due_date"],
        unique=False,
    )

    op.create_index(
        op.f("ix_fraud_actions_fraud_case_id"),
        "fraud_actions",
        ["fraud_case_id"],
        unique=False,
    )

    op.create_index(
        op.f("ix_fraud_actions_owner"),
        "fraud_actions",
        ["owner"],
        unique=False,
    )

    op.create_index(
        op.f("ix_fraud_actions_priority"),
        "fraud_actions",
        ["priority"],
        unique=False,
    )

    op.create_index(
        op.f("ix_fraud_actions_status"),
        "fraud_actions",
        ["status"],
        unique=False,
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_index(
        op.f("ix_fraud_actions_status"),
        table_name="fraud_actions",
    )

    op.drop_index(
        op.f("ix_fraud_actions_priority"),
        table_name="fraud_actions",
    )

    op.drop_index(
        op.f("ix_fraud_actions_owner"),
        table_name="fraud_actions",
    )

    op.drop_index(
        op.f("ix_fraud_actions_fraud_case_id"),
        table_name="fraud_actions",
    )

    op.drop_index(
        op.f("ix_fraud_actions_due_date"),
        table_name="fraud_actions",
    )

    op.drop_index(
        op.f("ix_fraud_actions_completed_date"),
        table_name="fraud_actions",
    )

    op.drop_index(
        op.f("ix_fraud_actions_action_type"),
        table_name="fraud_actions",
    )

    op.drop_index(
        op.f("ix_fraud_actions_action_number"),
        table_name="fraud_actions",
    )

    op.drop_table(
        "fraud_actions",
    )