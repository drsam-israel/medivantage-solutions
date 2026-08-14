from datetime import date, datetime
from decimal import Decimal
from uuid import UUID, uuid4

from sqlalchemy import (
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


class FraudRecovery(Base):
    """Financial recovery record associated with a fraud case."""

    __tablename__ = "fraud_recoveries"

    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )

    recovery_number: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        unique=True,
        index=True,
    )

    fraud_case_id: Mapped[UUID] = mapped_column(
        ForeignKey(
            "fraud_cases.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    recovery_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
    )

    recovery_status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="IDENTIFIED",
        index=True,
    )

    identified_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
        index=True,
    )

    target_recovery_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
        index=True,
    )

    recovered_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
        index=True,
    )

    identified_amount: Mapped[Decimal] = mapped_column(
        Numeric(14, 2),
        nullable=False,
        default=0,
    )

    approved_amount: Mapped[Decimal] = mapped_column(
        Numeric(14, 2),
        nullable=False,
        default=0,
    )

    recovered_amount: Mapped[Decimal] = mapped_column(
        Numeric(14, 2),
        nullable=False,
        default=0,
    )

    currency: Mapped[str] = mapped_column(
        String(10),
        nullable=False,
        default="SAR",
    )

    recovery_owner: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
        index=True,
    )

    counterparty: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
        index=True,
    )

    reference_number: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
        index=True,
    )

    recovery_notes: Mapped[str | None] = mapped_column(
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

    fraud_case = relationship(
        "FraudCase",
        back_populates="recoveries",
    )