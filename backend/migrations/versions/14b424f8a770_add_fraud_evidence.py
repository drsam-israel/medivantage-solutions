"""add fraud evidence

Revision ID: 14b424f8a770
Revises: 3caf48cbce71
Create Date: 2026-08-13 20:50:46.063440
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "14b424f8a770"
down_revision: Union[str, Sequence[str], None] = "3caf48cbce71"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.create_table(
        "fraud_evidence",
        sa.Column(
            "id",
            sa.Uuid(),
            nullable=False,
        ),
        sa.Column(
            "evidence_number",
            sa.String(length=100),
            nullable=False,
        ),
        sa.Column(
            "fraud_case_id",
            sa.Uuid(),
            nullable=False,
        ),
        sa.Column(
            "evidence_type",
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
            "source_reference",
            sa.String(length=150),
            nullable=True,
        ),
        sa.Column(
            "uploaded_by",
            sa.String(length=150),
            nullable=True,
        ),
        sa.Column(
            "uploaded_date",
            sa.Date(),
            nullable=False,
        ),
        sa.Column(
            "status",
            sa.String(length=50),
            nullable=False,
        ),
        sa.Column(
            "verification_notes",
            sa.Text(),
            nullable=True,
        ),
        sa.Column(
            "storage_reference",
            sa.String(length=255),
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
        op.f(
            "ix_fraud_evidence_evidence_number"
        ),
        "fraud_evidence",
        ["evidence_number"],
        unique=True,
    )

    op.create_index(
        op.f(
            "ix_fraud_evidence_evidence_type"
        ),
        "fraud_evidence",
        ["evidence_type"],
        unique=False,
    )

    op.create_index(
        op.f(
            "ix_fraud_evidence_fraud_case_id"
        ),
        "fraud_evidence",
        ["fraud_case_id"],
        unique=False,
    )

    op.create_index(
        op.f(
            "ix_fraud_evidence_source_reference"
        ),
        "fraud_evidence",
        ["source_reference"],
        unique=False,
    )

    op.create_index(
        op.f(
            "ix_fraud_evidence_status"
        ),
        "fraud_evidence",
        ["status"],
        unique=False,
    )

    op.create_index(
        op.f(
            "ix_fraud_evidence_title"
        ),
        "fraud_evidence",
        ["title"],
        unique=False,
    )

    op.create_index(
        op.f(
            "ix_fraud_evidence_uploaded_by"
        ),
        "fraud_evidence",
        ["uploaded_by"],
        unique=False,
    )

    op.create_index(
        op.f(
            "ix_fraud_evidence_uploaded_date"
        ),
        "fraud_evidence",
        ["uploaded_date"],
        unique=False,
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_index(
        op.f(
            "ix_fraud_evidence_uploaded_date"
        ),
        table_name="fraud_evidence",
    )

    op.drop_index(
        op.f(
            "ix_fraud_evidence_uploaded_by"
        ),
        table_name="fraud_evidence",
    )

    op.drop_index(
        op.f(
            "ix_fraud_evidence_title"
        ),
        table_name="fraud_evidence",
    )

    op.drop_index(
        op.f(
            "ix_fraud_evidence_status"
        ),
        table_name="fraud_evidence",
    )

    op.drop_index(
        op.f(
            "ix_fraud_evidence_source_reference"
        ),
        table_name="fraud_evidence",
    )

    op.drop_index(
        op.f(
            "ix_fraud_evidence_fraud_case_id"
        ),
        table_name="fraud_evidence",
    )

    op.drop_index(
        op.f(
            "ix_fraud_evidence_evidence_type"
        ),
        table_name="fraud_evidence",
    )

    op.drop_index(
        op.f(
            "ix_fraud_evidence_evidence_number"
        ),
        table_name="fraud_evidence",
    )

    op.drop_table(
        "fraud_evidence",
    )