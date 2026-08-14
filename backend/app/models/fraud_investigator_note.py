from datetime import date, datetime
from uuid import UUID, uuid4

from sqlalchemy import (
    Date,
    DateTime,
    ForeignKey,
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


class FraudInvestigatorNote(Base):
    """Investigator note associated with a fraud investigation case."""

    __tablename__ = "fraud_investigator_notes"

    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )

    note_number: Mapped[str] = mapped_column(
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

    author: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
        index=True,
    )

    author_role: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
    )

    note_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
        default=date.today,
        index=True,
    )

    note_text: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    visibility: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="INTERNAL",
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
        back_populates="investigator_notes",
    )