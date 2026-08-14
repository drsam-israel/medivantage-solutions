from datetime import date, datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, model_validator


class HealthPlanBase(BaseModel):
    plan_code: str = Field(min_length=2, max_length=50)
    plan_name: str = Field(min_length=2, max_length=255)
    plan_type: str = Field(min_length=2, max_length=50)
    coverage_level: str = Field(min_length=2, max_length=50)

    annual_deductible: Decimal = Field(default=0, ge=0)
    out_of_pocket_maximum: Decimal = Field(default=0, ge=0)
    monthly_premium: Decimal = Field(default=0, ge=0)
    coinsurance_percentage: Decimal = Field(
        default=0,
        ge=0,
        le=100,
    )
    primary_care_copay: Decimal = Field(default=0, ge=0)
    specialist_copay: Decimal = Field(default=0, ge=0)

    effective_date: date
    expiration_date: date | None = None

    currency: str = Field(default="SAR", min_length=3, max_length=10)
    is_active: bool = True

    @model_validator(mode="after")
    def validate_dates(self) -> "HealthPlanBase":
        if (
            self.expiration_date is not None
            and self.expiration_date < self.effective_date
        ):
            raise ValueError(
                "Expiration date cannot be earlier than effective date."
            )

        return self


class HealthPlanCreate(HealthPlanBase):
    pass


class HealthPlanUpdate(BaseModel):
    plan_name: str | None = Field(
        default=None,
        min_length=2,
        max_length=255,
    )
    plan_type: str | None = Field(
        default=None,
        min_length=2,
        max_length=50,
    )
    coverage_level: str | None = Field(
        default=None,
        min_length=2,
        max_length=50,
    )

    annual_deductible: Decimal | None = Field(default=None, ge=0)
    out_of_pocket_maximum: Decimal | None = Field(default=None, ge=0)
    monthly_premium: Decimal | None = Field(default=None, ge=0)
    coinsurance_percentage: Decimal | None = Field(
        default=None,
        ge=0,
        le=100,
    )
    primary_care_copay: Decimal | None = Field(default=None, ge=0)
    specialist_copay: Decimal | None = Field(default=None, ge=0)

    effective_date: date | None = None
    expiration_date: date | None = None

    currency: str | None = Field(
        default=None,
        min_length=3,
        max_length=10,
    )
    is_active: bool | None = None


class HealthPlanResponse(HealthPlanBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    created_at: datetime
    updated_at: datetime