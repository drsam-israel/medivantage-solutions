"""add fraud cases

Revision ID: db57bda7ae36
Revises: d1de10fcde0d
Create Date: 2026-08-13 19:49:47.275547
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "db57bda7ae36"
down_revision: Union[str, Sequence[str], None] = "d1de10fcde0d"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.create_table(
        "fraud_cases",
        sa.Column(
            "id",
            sa.Uuid(),
            nullable=False,
        ),
        sa.Column(
            "case_number",
            sa.String(length=100),
            nullable=False,
        ),
        sa.Column(
            "title",
            sa.String(length=255),
            nullable=False,
        ),
        sa.Column(
            "case_type",
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
            "investigation_stage",
            sa.String(length=100),
            nullable=False,
        ),
        sa.Column(
            "source",
            sa.String(length=100),
            nullable=False,
        ),
        sa.Column(
            "description",
            sa.Text(),
            nullable=True,
        ),
        sa.Column(
            "member_id",
            sa.Uuid(),
            nullable=True,
        ),
        sa.Column(
            "provider_id",
            sa.Uuid(),
            nullable=True,
        ),
        sa.Column(
            "primary_claim_id",
            sa.Uuid(),
            nullable=True,
        ),
        sa.Column(
            "assigned_investigator",
            sa.String(length=150),
            nullable=True,
        ),
        sa.Column(
            "investigation_unit",
            sa.String(length=150),
            nullable=True,
        ),
        sa.Column(
            "opened_date",
            sa.Date(),
            nullable=False,
        ),
        sa.Column(
            "target_resolution_date",
            sa.Date(),
            nullable=True,
        ),
        sa.Column(
            "closed_date",
            sa.Date(),
            nullable=True,
        ),
        sa.Column(
            "ai_confidence",
            sa.Float(),
            nullable=True,
        ),
        sa.Column(
            "suspected_exposure",
            sa.Numeric(
                precision=14,
                scale=2,
            ),
            nullable=False,
        ),
        sa.Column(
            "validated_exposure",
            sa.Numeric(
                precision=14,
                scale=2,
            ),
            nullable=False,
        ),
        sa.Column(
            "prevented_loss",
            sa.Numeric(
                precision=14,
                scale=2,
            ),
            nullable=False,
        ),
        sa.Column(
            "recovery_potential",
            sa.Numeric(
                precision=14,
                scale=2,
            ),
            nullable=False,
        ),
        sa.Column(
            "recovered_amount",
            sa.Numeric(
                precision=14,
                scale=2,
            ),
            nullable=False,
        ),
        sa.Column(
            "currency",
            sa.String(length=10),
            nullable=False,
        ),
        sa.Column(
            "fraud_summary",
            sa.Text(),
            nullable=True,
        ),
        sa.Column(
            "ai_rationale",
            sa.Text(),
            nullable=True,
        ),
        sa.Column(
            "final_outcome",
            sa.String(length=100),
            nullable=True,
        ),
        sa.Column(
            "closure_rationale",
            sa.Text(),
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
            ["member_id"],
            ["members.id"],
            ondelete="SET NULL",
        ),
        sa.ForeignKeyConstraint(
            ["primary_claim_id"],
            ["claims.id"],
            ondelete="SET NULL",
        ),
        sa.ForeignKeyConstraint(
            ["provider_id"],
            ["providers.id"],
            ondelete="SET NULL",
        ),
        sa.PrimaryKeyConstraint(
            "id",
        ),
    )

    op.create_index(
        op.f(
            "ix_fraud_cases_assigned_investigator"
        ),
        "fraud_cases",
        ["assigned_investigator"],
        unique=False,
    )

    op.create_index(
        op.f(
            "ix_fraud_cases_case_number"
        ),
        "fraud_cases",
        ["case_number"],
        unique=True,
    )

    op.create_index(
        op.f(
            "ix_fraud_cases_case_type"
        ),
        "fraud_cases",
        ["case_type"],
        unique=False,
    )

    op.create_index(
        op.f(
            "ix_fraud_cases_closed_date"
        ),
        "fraud_cases",
        ["closed_date"],
        unique=False,
    )

    op.create_index(
        op.f(
            "ix_fraud_cases_final_outcome"
        ),
        "fraud_cases",
        ["final_outcome"],
        unique=False,
    )

    op.create_index(
        op.f(
            "ix_fraud_cases_investigation_stage"
        ),
        "fraud_cases",
        ["investigation_stage"],
        unique=False,
    )

    op.create_index(
        op.f(
            "ix_fraud_cases_investigation_unit"
        ),
        "fraud_cases",
        ["investigation_unit"],
        unique=False,
    )

    op.create_index(
        op.f(
            "ix_fraud_cases_member_id"
        ),
        "fraud_cases",
        ["member_id"],
        unique=False,
    )

    op.create_index(
        op.f(
            "ix_fraud_cases_opened_date"
        ),
        "fraud_cases",
        ["opened_date"],
        unique=False,
    )

    op.create_index(
        op.f(
            "ix_fraud_cases_primary_claim_id"
        ),
        "fraud_cases",
        ["primary_claim_id"],
        unique=False,
    )

    op.create_index(
        op.f(
            "ix_fraud_cases_priority"
        ),
        "fraud_cases",
        ["priority"],
        unique=False,
    )

    op.create_index(
        op.f(
            "ix_fraud_cases_provider_id"
        ),
        "fraud_cases",
        ["provider_id"],
        unique=False,
    )

    op.create_index(
        op.f(
            "ix_fraud_cases_risk_level"
        ),
        "fraud_cases",
        ["risk_level"],
        unique=False,
    )

    op.create_index(
        op.f(
            "ix_fraud_cases_source"
        ),
        "fraud_cases",
        ["source"],
        unique=False,
    )

    op.create_index(
        op.f(
            "ix_fraud_cases_status"
        ),
        "fraud_cases",
        ["status"],
        unique=False,
    )

    op.create_index(
        op.f(
            "ix_fraud_cases_target_resolution_date"
        ),
        "fraud_cases",
        ["target_resolution_date"],
        unique=False,
    )

    op.create_index(
        op.f(
            "ix_fraud_cases_title"
        ),
        "fraud_cases",
        ["title"],
        unique=False,
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_index(
        op.f(
            "ix_fraud_cases_title"
        ),
        table_name="fraud_cases",
    )

    op.drop_index(
        op.f(
            "ix_fraud_cases_target_resolution_date"
        ),
        table_name="fraud_cases",
    )

    op.drop_index(
        op.f(
            "ix_fraud_cases_status"
        ),
        table_name="fraud_cases",
    )

    op.drop_index(
        op.f(
            "ix_fraud_cases_source"
        ),
        table_name="fraud_cases",
    )

    op.drop_index(
        op.f(
            "ix_fraud_cases_risk_level"
        ),
        table_name="fraud_cases",
    )

    op.drop_index(
        op.f(
            "ix_fraud_cases_provider_id"
        ),
        table_name="fraud_cases",
    )

    op.drop_index(
        op.f(
            "ix_fraud_cases_priority"
        ),
        table_name="fraud_cases",
    )

    op.drop_index(
        op.f(
            "ix_fraud_cases_primary_claim_id"
        ),
        table_name="fraud_cases",
    )

    op.drop_index(
        op.f(
            "ix_fraud_cases_opened_date"
        ),
        table_name="fraud_cases",
    )

    op.drop_index(
        op.f(
            "ix_fraud_cases_member_id"
        ),
        table_name="fraud_cases",
    )

    op.drop_index(
        op.f(
            "ix_fraud_cases_investigation_unit"
        ),
        table_name="fraud_cases",
    )

    op.drop_index(
        op.f(
            "ix_fraud_cases_investigation_stage"
        ),
        table_name="fraud_cases",
    )

    op.drop_index(
        op.f(
            "ix_fraud_cases_final_outcome"
        ),
        table_name="fraud_cases",
    )

    op.drop_index(
        op.f(
            "ix_fraud_cases_closed_date"
        ),
        table_name="fraud_cases",
    )

    op.drop_index(
        op.f(
            "ix_fraud_cases_case_type"
        ),
        table_name="fraud_cases",
    )

    op.drop_index(
        op.f(
            "ix_fraud_cases_case_number"
        ),
        table_name="fraud_cases",
    )

    op.drop_index(
        op.f(
            "ix_fraud_cases_assigned_investigator"
        ),
        table_name="fraud_cases",
    )

    op.drop_table(
        "fraud_cases",
    )