from datetime import date, datetime
from decimal import Decimal
from uuid import UUID

from pydantic import (
    BaseModel,
    ConfigDict,
)


class FraudRecoveryBase(BaseModel):
    fraud_case_id: UUID

    recovery_type: str
    recovery_status: str = "IDENTIFIED"

    identified_date: date
    target_recovery_date: date | None = None
    recovered_date: date | None = None

    identified_amount: Decimal = Decimal("0.00")
    approved_amount: Decimal = Decimal("0.00")
    recovered_amount: Decimal = Decimal("0.00")

    currency: str = "SAR"

    recovery_owner: str
    counterparty: str | None = None
    reference_number: str | None = None

    recovery_notes: str | None = None


class FraudRecoveryCreate(FraudRecoveryBase):
    recovery_number: str


class FraudRecoveryUpdate(BaseModel):
    recovery_type: str | None = None
    recovery_status: str | None = None

    identified_date: date | None = None
    target_recovery_date: date | None = None
    recovered_date: date | None = None

    identified_amount: Decimal | None = None
    approved_amount: Decimal | None = None
    recovered_amount: Decimal | None = None

    currency: str | None = None

    recovery_owner: str | None = None
    counterparty: str | None = None
    reference_number: str | None = None

    recovery_notes: str | None = None


class FraudRecoveryResponse(FraudRecoveryBase):
    model_config = ConfigDict(
        from_attributes=True,
    )

    id: UUID
    recovery_number: str

    created_at: datetime
    updated_at: datetime