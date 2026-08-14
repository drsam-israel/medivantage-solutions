from datetime import date, datetime
from decimal import Decimal
from uuid import UUID

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    model_validator,
)


class PolicyBase(BaseModel):
    policy_number: str = Field(
        min_length=3,
        max_length=100,
    )

    policyholder_member_id: UUID
    health_plan_id: UUID

    status: str = Field(
        default="PENDING",
        min_length=2,
        max_length=50,
    )

    policy_type: str = Field(
        default="INDIVIDUAL",
        min_length=2,
        max_length=50,
    )

    effective_date: date
    expiry_date: date

    network_name: str | None = Field(
        default=None,
        max_length=255,
    )

    annual_limit: Decimal = Field(
        default=0,
        ge=0,
    )

    deductible_amount: Decimal = Field(
        default=0,
        ge=0,
    )

    copay_amount: Decimal = Field(
        default=0,
        ge=0,
    )

    coinsurance_percentage: Decimal = Field(
        default=0,
        ge=0,
        le=100,
    )

    out_of_pocket_maximum: Decimal = Field(
        default=0,
        ge=0,
    )

    premium_amount: Decimal = Field(
        default=0,
        ge=0,
    )

    premium_currency: str = Field(
        default="SAR",
        min_length=3,
        max_length=10,
    )

    billing_frequency: str = Field(
        default="MONTHLY",
        min_length=2,
        max_length=50,
    )

    billing_status: str = Field(
        default="PENDING",
        min_length=2,
        max_length=50,
    )

    next_payment_date: date | None = None

    benefits_summary: str | None = None
    exclusions_summary: str | None = None

    renewal_eligible: bool = False
    renewal_due_date: date | None = None

    cancellation_reason: str | None = None
    suspension_reason: str | None = None

    is_active: bool = True

    @model_validator(mode="after")
    def validate_policy_dates(
        self,
    ) -> "PolicyBase":
        if self.expiry_date < self.effective_date:
            raise ValueError(
                "Policy expiry date cannot be earlier "
                "than the effective date.",
            )

        if (
            self.renewal_due_date is not None
            and self.renewal_due_date
            < self.effective_date
        ):
            raise ValueError(
                "Renewal due date cannot be earlier "
                "than the policy effective date.",
            )

        return self


class PolicyCreate(PolicyBase):
    pass


class PolicyUpdate(BaseModel):
    status: str | None = Field(
        default=None,
        min_length=2,
        max_length=50,
    )

    policy_type: str | None = Field(
        default=None,
        min_length=2,
        max_length=50,
    )

    effective_date: date | None = None
    expiry_date: date | None = None

    network_name: str | None = Field(
        default=None,
        max_length=255,
    )

    annual_limit: Decimal | None = Field(
        default=None,
        ge=0,
    )

    deductible_amount: Decimal | None = Field(
        default=None,
        ge=0,
    )

    copay_amount: Decimal | None = Field(
        default=None,
        ge=0,
    )

    coinsurance_percentage: Decimal | None = Field(
        default=None,
        ge=0,
        le=100,
    )

    out_of_pocket_maximum: Decimal | None = Field(
        default=None,
        ge=0,
    )

    premium_amount: Decimal | None = Field(
        default=None,
        ge=0,
    )

    premium_currency: str | None = Field(
        default=None,
        min_length=3,
        max_length=10,
    )

    billing_frequency: str | None = Field(
        default=None,
        min_length=2,
        max_length=50,
    )

    billing_status: str | None = Field(
        default=None,
        min_length=2,
        max_length=50,
    )

    next_payment_date: date | None = None

    benefits_summary: str | None = None
    exclusions_summary: str | None = None

    renewal_eligible: bool | None = None
    renewal_due_date: date | None = None

    cancellation_reason: str | None = None
    suspension_reason: str | None = None

    is_active: bool | None = None


class PolicyResponse(PolicyBase):
    model_config = ConfigDict(
        from_attributes=True,
    )

    id: UUID
    created_at: datetime
    updated_at: datetime