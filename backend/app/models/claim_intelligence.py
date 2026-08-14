from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import (
    Boolean,
    DateTime,
    Float,
    ForeignKey,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.database.base import Base


class ClaimIntelligence(Base):
    """
    AI-assisted intelligence and governance record
    associated with a healthcare claim.

    One ClaimIntelligence record is maintained per claim.
    """

    __tablename__ = "claim_intelligence"

    __table_args__ = (
        UniqueConstraint(
            "claim_id",
            name="uq_claim_intelligence_claim_id",
        ),
    )

    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )

    claim_id: Mapped[UUID] = mapped_column(
        ForeignKey(
        "claims.id",
        ondelete="CASCADE",
    ),
        nullable=False,
    )  

    fraud_risk_score: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
        index=True,
    )

    fraud_risk_level: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
        index=True,
    )

    fraud_risk_reason: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    clinical_review_status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="NOT_REVIEWED",
        index=True,
    )

    clinical_review_summary: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    sla_status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="ON_TRACK",
        index=True,
    )

    sla_due_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
        index=True,
    )

    sla_breached: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
        index=True,
    )

    decision_recommendation: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
        index=True,
    )

    decision_confidence: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    decision_reason: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    requires_manual_review: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
        index=True,
    )

    reviewed_by: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
    )

    reviewed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    model_name: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
    )

    model_version: Mapped[str | None] = mapped_column(
        String(100),
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
        back_populates="intelligence",
    )