from datetime import date, datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ReimbursementBase(BaseModel):
    claim_id: UUID
    provider_id: UUID
    member_id: UUID | None = None

    reimbursement_type: str = "PROVIDER"
    currency: str = "SAR"

    billed_amount: Decimal = Field(
        ge=0,
    )

    approved_amount: Decimal = Field(
        ge=0,
    )

    withholding_amount: Decimal = Field(
        default=Decimal("0"),
        ge=0,
    )

    recovery_amount: Decimal = Field(
        default=Decimal("0"),
        ge=0,
    )

    net_payable_amount: Decimal = Field(
        ge=0,
    )

    scheduled_payment_date: date | None = None

    ai_risk_score: float | None = Field(
        default=None,
        ge=0,
        le=100,
    )

    ai_risk_level: str | None = None
    ai_risk_reason: str | None = None


class ReimbursementCreate(
    ReimbursementBase,
):
    reimbursement_number: str


class ReimbursementUpdate(BaseModel):
    reimbursement_type: str | None = None
    currency: str | None = None

    billed_amount: Decimal | None = Field(
        default=None,
        ge=0,
    )

    approved_amount: Decimal | None = Field(
        default=None,
        ge=0,
    )

    withholding_amount: Decimal | None = Field(
        default=None,
        ge=0,
    )

    recovery_amount: Decimal | None = Field(
        default=None,
        ge=0,
    )

    net_payable_amount: Decimal | None = Field(
        default=None,
        ge=0,
    )

    scheduled_payment_date: date | None = None

    ai_risk_score: float | None = Field(
        default=None,
        ge=0,
        le=100,
    )

    ai_risk_level: str | None = None
    ai_risk_reason: str | None = None


class ReimbursementApprovalRequest(
    BaseModel,
):
    approved_by: str

    approval_notes: str | None = None


class ReimbursementPaymentRequest(
    BaseModel,
):
    payment_method: str

    payment_reference: str


class ReimbursementReconciliationRequest(
    BaseModel,
):
    reconciliation_status: str

    reconciliation_reference: str | None = None

    reconciled_by: str

    notes: str | None = None


class ReimbursementResponse(
    ReimbursementBase,
):
    model_config = ConfigDict(
        from_attributes=True,
    )

    id: UUID
    reimbursement_number: str

    status: str
    approval_status: str

    approved_by: str | None = None
    approved_at: datetime | None = None
    approval_notes: str | None = None

    payment_method: str | None = None
    payment_reference: str | None = None
    paid_at: datetime | None = None

    reconciliation_status: str

    reconciliation_reference: str | None = None
    reconciled_by: str | None = None
    reconciled_at: datetime | None = None

    created_at: datetime
    updated_at: datetime