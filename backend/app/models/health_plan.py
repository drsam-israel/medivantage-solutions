from datetime import date, datetime
from decimal import Decimal
from uuid import UUID, uuid4

from sqlalchemy import (
    Boolean,
    Date,
    DateTime,
    Numeric,
    String,
    func,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.database.base import Base


class HealthPlan(Base):
    """Healthcare insurance product offered to members."""

    __tablename__ = "health_plans"

    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )

    plan_code: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False,
        index=True,
    )

    plan_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True,
    )

    plan_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True,
    )

    coverage_level: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True,
    )

    annual_deductible: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
        default=0,
    )

    out_of_pocket_maximum: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
        default=0,
    )

    monthly_premium: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
        default=0,
    )

    coinsurance_percentage: Mapped[Decimal] = mapped_column(
        Numeric(5, 2),
        nullable=False,
        default=0,
    )

    primary_care_copay: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
        default=0,
    )

    specialist_copay: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
        default=0,
    )

    effective_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    expiration_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    currency: Mapped[str] = mapped_column(
        String(10),
        nullable=False,
        default="SAR",
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

    enrollments = relationship(
        "Enrollment",
        back_populates="health_plan",
    )