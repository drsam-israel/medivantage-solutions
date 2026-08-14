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
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class Claim(Base):
    __tablename__ = "claims"

    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )

    claim_number: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
        index=True,
    )

    member_id: Mapped[UUID] = mapped_column(
        ForeignKey("members.id"),
        nullable=False,
        index=True,
    )

    provider_id: Mapped[UUID] = mapped_column(
        ForeignKey("providers.id"),
        nullable=False,
        index=True,
    )

    enrollment_id: Mapped[UUID] = mapped_column(
        ForeignKey("enrollments.id"),
        nullable=False,
        index=True,
    )

    service_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
        index=True,
    )

    submission_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    claim_type: Mapped[str] = mapped_column(
        String(50),
        default="medical",
        nullable=False,
    )

    diagnosis_code: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    procedure_code: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    billed_amount: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
    )

    allowed_amount: Mapped[Decimal | None] = mapped_column(
        Numeric(12, 2),
        nullable=True,
    )

    deductible_amount: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        default=0,
        nullable=False,
    )

    copay_amount: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        default=0,
        nullable=False,
    )

    coinsurance_amount: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        default=0,
        nullable=False,
    )

    payer_responsibility: Mapped[Decimal | None] = mapped_column(
        Numeric(12, 2),
        nullable=True,
    )

    member_responsibility: Mapped[Decimal | None] = mapped_column(
        Numeric(12, 2),
        nullable=True,
    )

    claim_status: Mapped[str] = mapped_column(
        String(50),
        default="SUBMITTED",
        nullable=False,
        index=True,
    )

    denial_reason: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    adjudication_notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    member = relationship(
        "Member",
        back_populates="claims",
    )

    provider = relationship(
        "Provider",
        back_populates="claims",
    )

    enrollment = relationship(
        "Enrollment",
        back_populates="claims",
    )

    intelligence = relationship(
    "ClaimIntelligence",
       back_populates="claim",
       uselist=False,
       cascade="all, delete-orphan",
       passive_deletes=True,
    )