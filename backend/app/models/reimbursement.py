from datetime import date, datetime
from decimal import Decimal
from uuid import UUID, uuid4

from sqlalchemy import (
    Date,
    DateTime,
    Float,
    ForeignKey,
    Numeric,
    String,
    Text,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class Reimbursement(Base):
    """
    Provider/member reimbursement and payment lifecycle record.

    Supports approval, payment execution, reconciliation,
    recovery and AI-enabled financial risk monitoring.
    """

    __tablename__ = "reimbursements"

    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )

    reimbursement_number: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        unique=True,
        index=True,
    )

    claim_id: Mapped[UUID] = mapped_column(
        ForeignKey(
            "claims.id",
            ondelete="RESTRICT",
        ),
        nullable=False,
        index=True,
    )

    provider_id: Mapped[UUID] = mapped_column(
        ForeignKey(
            "providers.id",
            ondelete="RESTRICT",
        ),
        nullable=False,
        index=True,
    )

    member_id: Mapped[UUID | None] = mapped_column(
        ForeignKey(
            "members.id",
            ondelete="RESTRICT",
        ),
        nullable=True,
        index=True,
    )

    reimbursement_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="PROVIDER",
        index=True,
    )

    currency: Mapped[str] = mapped_column(
        String(10),
        nullable=False,
        default="SAR",
    )

    billed_amount: Mapped[Decimal] = mapped_column(
        Numeric(14, 2),
        nullable=False,
    )

    approved_amount: Mapped[Decimal] = mapped_column(
        Numeric(14, 2),
        nullable=False,
    )

    withholding_amount: Mapped[Decimal] = mapped_column(
        Numeric(14, 2),
        nullable=False,
        default=0,
    )

    recovery_amount: Mapped[Decimal] = mapped_column(
        Numeric(14, 2),
        nullable=False,
        default=0,
    )

    net_payable_amount: Mapped[Decimal] = mapped_column(
        Numeric(14, 2),
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="PENDING_APPROVAL",
        index=True,
    )

    approval_status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="PENDING",
        index=True,
    )

    approved_by: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
    )

    approved_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    approval_notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    payment_method: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    scheduled_payment_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
        index=True,
    )

    payment_reference: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
        index=True,
    )

    paid_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    reconciliation_status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="NOT_RECONCILED",
        index=True,
    )

    reconciliation_reference: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
    )

    reconciled_by: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
    )

    reconciled_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    ai_risk_score: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
        index=True,
    )

    ai_risk_level: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
        index=True,
    )

    ai_risk_reason: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
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

    claim = relationship(
        "Claim",
    )

    provider = relationship(
        "Provider",
    )

    member = relationship(
        "Member",
    )