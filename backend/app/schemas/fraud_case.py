from datetime import date, datetime
from decimal import Decimal
from uuid import UUID

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
)


class FraudCaseBase(BaseModel):
    title: str
    case_type: str

    status: str = "OPEN"
    priority: str = "MEDIUM"
    risk_level: str = "MEDIUM"

    investigation_stage: str = "TRIAGE"
    source: str = "MANUAL_REFERRAL"

    description: str | None = None

    member_id: UUID | None = None
    provider_id: UUID | None = None
    primary_claim_id: UUID | None = None

    assigned_investigator: str | None = None
    investigation_unit: str | None = None

    opened_date: date

    target_resolution_date: date | None = None
    closed_date: date | None = None

    ai_confidence: float | None = Field(
        default=None,
        ge=0,
        le=100,
    )

    suspected_exposure: Decimal = Decimal("0")
    validated_exposure: Decimal = Decimal("0")
    prevented_loss: Decimal = Decimal("0")
    recovery_potential: Decimal = Decimal("0")
    recovered_amount: Decimal = Decimal("0")

    currency: str = "SAR"

    fraud_summary: str | None = None
    ai_rationale: str | None = None

    final_outcome: str | None = None
    closure_rationale: str | None = None


class FraudCaseCreate(FraudCaseBase):
    case_number: str


class FraudCaseUpdate(BaseModel):
    title: str | None = None
    case_type: str | None = None

    status: str | None = None
    priority: str | None = None
    risk_level: str | None = None

    investigation_stage: str | None = None
    source: str | None = None

    description: str | None = None

    member_id: UUID | None = None
    provider_id: UUID | None = None
    primary_claim_id: UUID | None = None

    assigned_investigator: str | None = None
    investigation_unit: str | None = None

    opened_date: date | None = None
    target_resolution_date: date | None = None
    closed_date: date | None = None

    ai_confidence: float | None = Field(
        default=None,
        ge=0,
        le=100,
    )

    suspected_exposure: Decimal | None = None
    validated_exposure: Decimal | None = None
    prevented_loss: Decimal | None = None
    recovery_potential: Decimal | None = None
    recovered_amount: Decimal | None = None

    currency: str | None = None

    fraud_summary: str | None = None
    ai_rationale: str | None = None

    final_outcome: str | None = None
    closure_rationale: str | None = None


class FraudCaseResponse(FraudCaseBase):
    model_config = ConfigDict(
        from_attributes=True,
    )

    id: UUID
    case_number: str

    created_at: datetime
    updated_at: datetime