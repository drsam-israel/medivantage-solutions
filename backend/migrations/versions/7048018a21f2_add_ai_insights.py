"""add ai insights

Revision ID: 7048018a21f2
Revises: 5657408d1cd1
Create Date: 2026-08-14 03:50:22.069924
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "7048018a21f2"
down_revision: Union[str, Sequence[str], None] = "5657408d1cd1"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.create_table(
        "ai_insights",
        sa.Column(
            "id",
            sa.Uuid(),
            nullable=False,
        ),
        sa.Column(
            "insight_number",
            sa.String(length=100),
            nullable=False,
        ),
        sa.Column(
            "title",
            sa.String(length=255),
            nullable=False,
        ),
        sa.Column(
            "insight_type",
            sa.String(length=100),
            nullable=False,
        ),
        sa.Column(
            "status",
            sa.String(length=50),
            nullable=False,
        ),
        sa.Column(
            "priority",
            sa.String(length=50),
            nullable=False,
        ),
        sa.Column(
            "risk_level",
            sa.String(length=50),
            nullable=False,
        ),
        sa.Column(
            "description",
            sa.Text(),
            nullable=True,
        ),
        sa.Column(
            "recommendation",
            sa.Text(),
            nullable=True,
        ),
        sa.Column(
            "ai_rationale",
            sa.Text(),
            nullable=True,
        ),
        sa.Column(
            "confidence_score",
            sa.Float(),
            nullable=True,
        ),
        sa.Column(
            "model_name",
            sa.String(length=150),
            nullable=True,
        ),
        sa.Column(
            "model_version",
            sa.String(length=50),
            nullable=True,
        ),
        sa.Column(
            "source_module",
            sa.String(length=100),
            nullable=True,
        ),
        sa.Column(
            "source_reference",
            sa.String(length=150),
            nullable=True,
        ),
        sa.Column(
            "assigned_reviewer",
            sa.String(length=150),
            nullable=True,
        ),
        sa.Column(
            "review_status",
            sa.String(length=50),
            nullable=True,
        ),
        sa.Column(
            "review_comment",
            sa.Text(),
            nullable=True,
        ),
        sa.Column(
            "review_date",
            sa.Date(),
            nullable=True,
        ),
        sa.Column(
            "detected_date",
            sa.Date(),
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
        sa.PrimaryKeyConstraint(
            "id",
        ),
    )

    op.create_index(
        op.f("ix_ai_insights_assigned_reviewer"),
        "ai_insights",
        ["assigned_reviewer"],
        unique=False,
    )

    op.create_index(
        op.f("ix_ai_insights_detected_date"),
        "ai_insights",
        ["detected_date"],
        unique=False,
    )

    op.create_index(
        op.f("ix_ai_insights_insight_number"),
        "ai_insights",
        ["insight_number"],
        unique=True,
    )

    op.create_index(
        op.f("ix_ai_insights_insight_type"),
        "ai_insights",
        ["insight_type"],
        unique=False,
    )

    op.create_index(
        op.f("ix_ai_insights_priority"),
        "ai_insights",
        ["priority"],
        unique=False,
    )

    op.create_index(
        op.f("ix_ai_insights_review_status"),
        "ai_insights",
        ["review_status"],
        unique=False,
    )

    op.create_index(
        op.f("ix_ai_insights_risk_level"),
        "ai_insights",
        ["risk_level"],
        unique=False,
    )

    op.create_index(
        op.f("ix_ai_insights_source_module"),
        "ai_insights",
        ["source_module"],
        unique=False,
    )

    op.create_index(
        op.f("ix_ai_insights_source_reference"),
        "ai_insights",
        ["source_reference"],
        unique=False,
    )

    op.create_index(
        op.f("ix_ai_insights_status"),
        "ai_insights",
        ["status"],
        unique=False,
    )

    op.create_index(
        op.f("ix_ai_insights_title"),
        "ai_insights",
        ["title"],
        unique=False,
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_index(
        op.f("ix_ai_insights_title"),
        table_name="ai_insights",
    )

    op.drop_index(
        op.f("ix_ai_insights_status"),
        table_name="ai_insights",
    )

    op.drop_index(
        op.f("ix_ai_insights_source_reference"),
        table_name="ai_insights",
    )

    op.drop_index(
        op.f("ix_ai_insights_source_module"),
        table_name="ai_insights",
    )

    op.drop_index(
        op.f("ix_ai_insights_risk_level"),
        table_name="ai_insights",
    )

    op.drop_index(
        op.f("ix_ai_insights_review_status"),
        table_name="ai_insights",
    )

    op.drop_index(
        op.f("ix_ai_insights_priority"),
        table_name="ai_insights",
    )

    op.drop_index(
        op.f("ix_ai_insights_insight_type"),
        table_name="ai_insights",
    )

    op.drop_index(
        op.f("ix_ai_insights_insight_number"),
        table_name="ai_insights",
    )

    op.drop_index(
        op.f("ix_ai_insights_detected_date"),
        table_name="ai_insights",
    )

    op.drop_index(
        op.f("ix_ai_insights_assigned_reviewer"),
        table_name="ai_insights",
    )

    op.drop_table(
        "ai_insights",
    )