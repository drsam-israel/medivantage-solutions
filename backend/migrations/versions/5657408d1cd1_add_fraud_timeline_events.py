"""add fraud timeline events

Revision ID: 5657408d1cd1
Revises: c61019c5436f
Create Date: 2026-08-13 22:13:43.581181
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "5657408d1cd1"
down_revision: Union[str, Sequence[str], None] = "c61019c5436f"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.create_table(
        "fraud_timeline_events",
        sa.Column(
            "id",
            sa.Uuid(),
            nullable=False,
        ),
        sa.Column(
            "event_number",
            sa.String(length=100),
            nullable=False,
        ),
        sa.Column(
            "fraud_case_id",
            sa.Uuid(),
            nullable=False,
        ),
        sa.Column(
            "event_type",
            sa.String(length=100),
            nullable=False,
        ),
        sa.Column(
            "title",
            sa.String(length=255),
            nullable=False,
        ),
        sa.Column(
            "description",
            sa.Text(),
            nullable=True,
        ),
        sa.Column(
            "performed_by",
            sa.String(length=150),
            nullable=False,
        ),
        sa.Column(
            "event_timestamp",
            sa.DateTime(timezone=True),
            nullable=False,
        ),
        sa.Column(
            "source_reference",
            sa.String(length=150),
            nullable=True,
        ),
        sa.Column(
            "status",
            sa.String(length=50),
            nullable=False,
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
        op.f(
            "ix_fraud_timeline_events_event_number"
        ),
        "fraud_timeline_events",
        ["event_number"],
        unique=True,
    )

    op.create_index(
        op.f(
            "ix_fraud_timeline_events_event_timestamp"
        ),
        "fraud_timeline_events",
        ["event_timestamp"],
        unique=False,
    )

    op.create_index(
        op.f(
            "ix_fraud_timeline_events_event_type"
        ),
        "fraud_timeline_events",
        ["event_type"],
        unique=False,
    )

    op.create_index(
        op.f(
            "ix_fraud_timeline_events_fraud_case_id"
        ),
        "fraud_timeline_events",
        ["fraud_case_id"],
        unique=False,
    )

    op.create_index(
        op.f(
            "ix_fraud_timeline_events_performed_by"
        ),
        "fraud_timeline_events",
        ["performed_by"],
        unique=False,
    )

    op.create_index(
        op.f(
            "ix_fraud_timeline_events_source_reference"
        ),
        "fraud_timeline_events",
        ["source_reference"],
        unique=False,
    )

    op.create_index(
        op.f(
            "ix_fraud_timeline_events_status"
        ),
        "fraud_timeline_events",
        ["status"],
        unique=False,
    )

    op.create_index(
        op.f(
            "ix_fraud_timeline_events_title"
        ),
        "fraud_timeline_events",
        ["title"],
        unique=False,
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_index(
        op.f(
            "ix_fraud_timeline_events_title"
        ),
        table_name="fraud_timeline_events",
    )

    op.drop_index(
        op.f(
            "ix_fraud_timeline_events_status"
        ),
        table_name="fraud_timeline_events",
    )

    op.drop_index(
        op.f(
            "ix_fraud_timeline_events_source_reference"
        ),
        table_name="fraud_timeline_events",
    )

    op.drop_index(
        op.f(
            "ix_fraud_timeline_events_performed_by"
        ),
        table_name="fraud_timeline_events",
    )

    op.drop_index(
        op.f(
            "ix_fraud_timeline_events_fraud_case_id"
        ),
        table_name="fraud_timeline_events",
    )

    op.drop_index(
        op.f(
            "ix_fraud_timeline_events_event_type"
        ),
        table_name="fraud_timeline_events",
    )

    op.drop_index(
        op.f(
            "ix_fraud_timeline_events_event_timestamp"
        ),
        table_name="fraud_timeline_events",
    )

    op.drop_index(
        op.f(
            "ix_fraud_timeline_events_event_number"
        ),
        table_name="fraud_timeline_events",
    )

    op.drop_table(
        "fraud_timeline_events",
    )