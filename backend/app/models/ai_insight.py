from datetime import date, datetime
from uuid import UUID, uuid4

from sqlalchemy import (
    Date,
    DateTime,
    Float,
    String,
    Text,
    func,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
)

from app.database.base import Base


class AIInsight(Base):
    __tablename__ = "ai_insights"

    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )

    insight_number: Mapped[str] = mapped_column(
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

    insight_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
    )

    status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="NEW",
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

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    recommendation: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    ai_rationale: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    confidence_score: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    model_name: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
    )

    model_version: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    source_module: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
        index=True,
    )

    source_reference: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
        index=True,
    )

    assigned_reviewer: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
        index=True,
    )

    review_status: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
        index=True,
    )

    review_comment: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    review_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    detected_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
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