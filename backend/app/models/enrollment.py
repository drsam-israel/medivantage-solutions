from datetime import date, datetime
from uuid import UUID, uuid4

from sqlalchemy import (
    Boolean,
    Date,
    DateTime,
    ForeignKey,
    String,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.database.base import Base


class Enrollment(Base):
    """Member enrollment in a healthcare insurance plan."""

    __tablename__ = "enrollments"

    __table_args__ = (
        UniqueConstraint(
            "policy_number",
            name="uq_enrollments_policy_number",
        ),
    )

    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )

    member_id: Mapped[UUID] = mapped_column(
        ForeignKey(
            "members.id",
            ondelete="RESTRICT",
        ),
        nullable=False,
        index=True,
    )

    health_plan_id: Mapped[UUID] = mapped_column(
        ForeignKey(
            "health_plans.id",
            ondelete="RESTRICT",
        ),
        nullable=False,
        index=True,
    )

    policy_number: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
    )

    enrollment_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="individual",
        index=True,
    )

    relationship_to_subscriber: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="self",
    )

    subscriber_member_id: Mapped[UUID | None] = mapped_column(
        ForeignKey(
            "members.id",
            ondelete="SET NULL",
        ),
        nullable=True,
        index=True,
    )

    group_number: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
        index=True,
    )

    employer_name: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    coverage_start_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
        index=True,
    )

    coverage_end_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
        index=True,
    )

    enrollment_status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="active",
        index=True,
    )

    termination_reason: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    is_primary: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
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

    member = relationship(
        "Member",
        foreign_keys=[member_id],
        back_populates="enrollments",
    )

    health_plan = relationship(
        "HealthPlan",
        back_populates="enrollments",
    )

    subscriber = relationship(
        "Member",
        foreign_keys=[subscriber_member_id],
    )

    claims = relationship(
        "Claim",
        back_populates="enrollment",
    )