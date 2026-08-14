from datetime import date, datetime
from decimal import Decimal
from uuid import UUID, uuid4

from sqlalchemy import (
    Boolean,
    Date,
    DateTime,
    ForeignKey,
    Numeric,
    String,
    Text,
    func,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.database.base import Base


class Policy(Base):
    """Healthcare insurance policy contract."""

    __tablename__ = "policies"

    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )

    policy_number: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
        index=True,
    )

    policyholder_member_id: Mapped[UUID] = mapped_column(
        ForeignKey(
            "members.id",
            ondelete="RESTRICT",
        ),
        nullable=False,
        index=True,
    )

    health_plan_id: Mapped[UUID] = mapped_column(
        ForeignKey(
            "health_plans.id",
            ondelete="RESTRICT",
        ),
        nullable=False,
        index=True,
    )

    status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="PENDING",
        index=True,
    )

    policy_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="INDIVIDUAL",
        index=True,
    )

    effective_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
        index=True,
    )

    expiry_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
        index=True,
    )

    network_name: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    annual_limit: Mapped[Decimal] = mapped_column(
        Numeric(14, 2),
        nullable=False,
        default=0,
    )

    deductible_amount: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
        default=0,
    )

    copay_amount: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
        default=0,
    )

    coinsurance_percentage: Mapped[Decimal] = mapped_column(
        Numeric(5, 2),
        nullable=False,
        default=0,
    )

    out_of_pocket_maximum: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
        default=0,
    )

    premium_amount: Mapped[Decimal] = mapped_column(
        Numeric(14, 2),
        nullable=False,
        default=0,
    )

    premium_currency: Mapped[str] = mapped_column(
        String(10),
        nullable=False,
        default="SAR",
    )

    billing_frequency: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="MONTHLY",
    )

    billing_status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="PENDING",
        index=True,
    )

    next_payment_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
        index=True,
    )

    benefits_summary: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    exclusions_summary: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    renewal_eligible: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
        index=True,
    )

    renewal_due_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
        index=True,
    )

    cancellation_reason: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    suspension_reason: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
        index=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    policyholder = relationship(
        "Member",
        foreign_keys=[policyholder_member_id],
    )

    health_plan = relationship(
        "HealthPlan",
        foreign_keys=[health_plan_id],
    )