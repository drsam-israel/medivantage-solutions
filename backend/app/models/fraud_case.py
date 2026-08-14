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
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.database.base import Base


class FraudCase(Base):
    """
    Fraud, Waste & Abuse investigation case.

    Represents the core investigation record used by
    MediVantage Fraud Investigation Center.
    """

    __tablename__ = "fraud_cases"

    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )

    case_number: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        unique=True,
        index=True,
    )

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True,
    )

    case_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
    )

    status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="OPEN",
        index=True,
    )

    priority: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="MEDIUM",
        index=True,
    )

    risk_level: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="MEDIUM",
        index=True,
    )

    investigation_stage: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        default="TRIAGE",
        index=True,
    )

    source: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        default="MANUAL_REFERRAL",
        index=True,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    member_id: Mapped[UUID | None] = mapped_column(
        ForeignKey(
            "members.id",
            ondelete="SET NULL",
        ),
        nullable=True,
        index=True,
    )

    provider_id: Mapped[UUID | None] = mapped_column(
        ForeignKey(
            "providers.id",
            ondelete="SET NULL",
        ),
        nullable=True,
        index=True,
    )

    primary_claim_id: Mapped[UUID | None] = mapped_column(
        ForeignKey(
            "claims.id",
            ondelete="SET NULL",
        ),
        nullable=True,
        index=True,
    )

    assigned_investigator: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
        index=True,
    )

    investigation_unit: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
        index=True,
    )

    opened_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
        default=date.today,
        index=True,
    )

    target_resolution_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
        index=True,
    )

    closed_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
        index=True,
    )

    ai_confidence: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    suspected_exposure: Mapped[Decimal] = mapped_column(
        Numeric(14, 2),
        nullable=False,
        default=0,
    )

    validated_exposure: Mapped[Decimal] = mapped_column(
        Numeric(14, 2),
        nullable=False,
        default=0,
    )

    prevented_loss: Mapped[Decimal] = mapped_column(
        Numeric(14, 2),
        nullable=False,
        default=0,
    )

    recovery_potential: Mapped[Decimal] = mapped_column(
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

    fraud_summary: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    ai_rationale: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    final_outcome: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
        index=True,
    )

    closure_rationale: Mapped[str | None] = mapped_column(
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

    member = relationship(
        "Member",
        foreign_keys=[member_id],
    )

    provider = relationship(
        "Provider",
        foreign_keys=[provider_id],
    )

    primary_claim = relationship(
        "Claim",
        foreign_keys=[primary_claim_id],
    )

    alerts = relationship(
        "FraudAlert",
        back_populates="fraud_case",
        cascade="all, delete-orphan",
    )
    evidence_items = relationship(
        "FraudEvidence",
        back_populates="fraud_case",
        cascade="all, delete-orphan",
    )
    investigator_notes = relationship(
        "FraudInvestigatorNote",
        back_populates="fraud_case",
        cascade="all, delete-orphan",
    )
    recommended_actions = relationship(
        "FraudAction",
        back_populates="fraud_case",
        cascade="all, delete-orphan",
    )
    recoveries = relationship(
        "FraudRecovery",
        back_populates="fraud_case",
        cascade="all, delete-orphan",
    )
    timeline_events = relationship(
        "FraudTimelineEvent",
        back_populates="fraud_case",
        cascade="all, delete-orphan",
    )
