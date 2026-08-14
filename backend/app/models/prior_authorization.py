from datetime import date, datetime
from uuid import UUID, uuid4

from sqlalchemy import (
    Date,
    DateTime,
    Float,
    ForeignKey,
    String,
    Text,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class PriorAuthorization(Base):
    """Healthcare prior authorization request and clinical determination."""

    __tablename__ = "prior_authorizations"

    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )

    authorization_number: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        unique=True,
        index=True,
    )

    member_id: Mapped[UUID] = mapped_column(
        ForeignKey(
            "members.id",
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

    enrollment_id: Mapped[UUID | None] = mapped_column(
        ForeignKey(
            "enrollments.id",
            ondelete="RESTRICT",
        ),
        nullable=True,
        index=True,
    )

    diagnosis_code: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
        index=True,
    )

    diagnosis_description: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    procedure_code: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
        index=True,
    )

    procedure_description: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    requested_service_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
        index=True,
    )

    priority: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="ROUTINE",
        index=True,
    )

    status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="PENDING_REVIEW",
        index=True,
    )

    clinical_summary: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    coverage_status: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
        index=True,
    )

    benefit_category: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
    )

    service_covered: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    authorization_required: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    ai_recommendation: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
        index=True,
    )

    ai_confidence: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    medical_necessity_score: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    ai_rationale: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    assigned_reviewer: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
        index=True,
    )

    review_due_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    final_decision: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
        index=True,
    )

    decision_rationale: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    information_requested: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    escalation_reason: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    escalated_to: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
    )

    decided_by: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
    )

    decided_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
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
    )

    provider = relationship(
        "Provider",
    )

    enrollment = relationship(
        "Enrollment",
    )