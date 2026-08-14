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


class UnderwritingApplication(Base):
    """Medical underwriting application for an insurance applicant."""

    __tablename__ = "underwriting_applications"

    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )

    application_number: Mapped[str] = mapped_column(
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

    product: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
        index=True,
    )

    submitted_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
        index=True,
    )

    risk_score: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
        index=True,
    )

    status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="PENDING_REVIEW",
        index=True,
    )

    assigned_underwriter: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
        index=True,
    )

    clinical_summary: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    ai_recommendation: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    decision: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
        index=True,
    )

    decision_rationale: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    reviewed_at: Mapped[datetime | None] = mapped_column(
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