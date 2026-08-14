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


class FraudAction(Base):
    """Recommended or approved action associated with a fraud case."""

    __tablename__ = "fraud_actions"

    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )

    action_number: Mapped[str] = mapped_column(
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

    action_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
    )

    action_description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    owner: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
        index=True,
    )

    due_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
        index=True,
    )

    priority: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="MEDIUM",
        index=True,
    )

    status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="PROPOSED",
        index=True,
    )

    estimated_recovery: Mapped[Decimal] = mapped_column(
        Numeric(14, 2),
        nullable=False,
        default=0,
    )

    rationale: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    approved_by: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
    )

    completed_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
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

    fraud_case = relationship(
        "FraudCase",
        back_populates="recommended_actions",
    )