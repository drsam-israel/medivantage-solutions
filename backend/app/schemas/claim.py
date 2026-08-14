from datetime import date, datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, model_validator


class ClaimBase(BaseModel):
    member_id: UUID
    provider_id: UUID
    enrollment_id: UUID

    service_date: date
    submission_date: date

    claim_type: str = Field(
        default="medical",
        min_length=2,
        max_length=50,
    )

    diagnosis_code: str | None = Field(
        default=None,
        max_length=50,
    )

    procedure_code: str | None = Field(
        default=None,
        max_length=50,
    )

    billed_amount: Decimal = Field(
        gt=0,
        max_digits=12,
        decimal_places=2,
    )

    allowed_amount: Decimal | None = Field(
        default=None,
        ge=0,
        max_digits=12,
        decimal_places=2,
    )

    deductible_amount: Decimal = Field(
        default=Decimal("0.00"),
        ge=0,
        max_digits=12,
        decimal_places=2,
    )

    copay_amount: Decimal = Field(
        default=Decimal("0.00"),
        ge=0,
        max_digits=12,
        decimal_places=2,
    )

    coinsurance_amount: Decimal = Field(
        default=Decimal("0.00"),
        ge=0,
        max_digits=12,
        decimal_places=2,
    )

    payer_responsibility: Decimal | None = Field(
        default=None,
        ge=0,
        max_digits=12,
        decimal_places=2,
    )

    member_responsibility: Decimal | None = Field(
        default=None,
        ge=0,
        max_digits=12,
        decimal_places=2,
    )

    claim_status: str = Field(
        default="SUBMITTED",
        min_length=2,
        max_length=50,
    )

    denial_reason: str | None = None
    adjudication_notes: str | None = None

    is_active: bool = True

    @model_validator(mode="after")
    def validate_submission_date(self) -> "ClaimBase":
        if self.submission_date < self.service_date:
            raise ValueError(
                "Submission date cannot be earlier than service date."
            )

        return self

    @model_validator(mode="after")
    def validate_allowed_amount(self) -> "ClaimBase":
        if (
            self.allowed_amount is not None
            and self.allowed_amount > self.billed_amount
        ):
            raise ValueError(
                "Allowed amount cannot exceed billed amount."
            )

        return self

    @model_validator(mode="after")
    def validate_responsibility_amounts(self) -> "ClaimBase":
        if self.allowed_amount is None:
            return self

        payer = self.payer_responsibility or Decimal("0.00")
        member = self.member_responsibility or Decimal("0.00")

        if payer + member > self.allowed_amount:
            raise ValueError(
                "Combined payer and member responsibility cannot "
                "exceed the allowed amount."
            )

        return self


class ClaimCreate(ClaimBase):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "member_id": "53195f30-4162-4fa6-a2be-48f988eb4ab4",
                "provider_id": "859940c4-cf87-4352-b4e0-1ab36da67a27",
                "enrollment_id": "12026255-3608-4afa-9505-be29bce2ad9e",
                "service_date": "2026-08-01",
                "submission_date": "2026-08-08",
                "claim_type": "medical",
                "diagnosis_code": "J06.9",
                "procedure_code": "99213",
                "billed_amount": 1000.00,
                "allowed_amount": 800.00,
                "deductible_amount": 100.00,
                "copay_amount": 50.00,
                "coinsurance_amount": 50.00,
                "payer_responsibility": 600.00,
                "member_responsibility": 200.00,
                "claim_status": "SUBMITTED",
                "denial_reason": None,
                "adjudication_notes": "Initial claim submission.",
                "is_active": True,
                "claim_number": "CLM-20260808-001",
            }
        }
    )

    claim_number: str = Field(
        min_length=3,
        max_length=100,
    )


class ClaimUpdate(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "claim_status": "UNDER_REVIEW",
                "adjudication_notes": (
                    "Claim moved to manual review for adjudication."
                ),
            }
        }
    )

    diagnosis_code: str | None = Field(
        default=None,
        max_length=50,
    )

    procedure_code: str | None = Field(
        default=None,
        max_length=50,
    )

    allowed_amount: Decimal | None = Field(
        default=None,
        ge=0,
        max_digits=12,
        decimal_places=2,
    )

    deductible_amount: Decimal | None = Field(
        default=None,
        ge=0,
        max_digits=12,
        decimal_places=2,
    )

    copay_amount: Decimal | None = Field(
        default=None,
        ge=0,
        max_digits=12,
        decimal_places=2,
    )

    coinsurance_amount: Decimal | None = Field(
        default=None,
        ge=0,
        max_digits=12,
        decimal_places=2,
    )

    payer_responsibility: Decimal | None = Field(
        default=None,
        ge=0,
        max_digits=12,
        decimal_places=2,
    )

    member_responsibility: Decimal | None = Field(
        default=None,
        ge=0,
        max_digits=12,
        decimal_places=2,
    )

    claim_status: str | None = Field(
        default=None,
        min_length=2,
        max_length=50,
    )

    denial_reason: str | None = None
    adjudication_notes: str | None = None
    is_active: bool | None = None


class ClaimResponse(ClaimBase):
    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "member_id": "53195f30-4162-4fa6-a2be-48f988eb4ab4",
                "provider_id": "859940c4-cf87-4352-b4e0-1ab36da67a27",
                "enrollment_id": "12026255-3608-4afa-9505-be29bce2ad9e",
                "service_date": "2026-08-01",
                "submission_date": "2026-08-08",
                "claim_type": "medical",
                "diagnosis_code": "J06.9",
                "procedure_code": "99213",
                "billed_amount": "1000.00",
                "allowed_amount": "800.00",
                "deductible_amount": "100.00",
                "copay_amount": "50.00",
                "coinsurance_amount": "50.00",
                "payer_responsibility": "600.00",
                "member_responsibility": "200.00",
                "claim_status": "SUBMITTED",
                "denial_reason": None,
                "adjudication_notes": "Initial claim submission.",
                "is_active": True,
                "id": "ebb31277-13da-41ca-b687-11a0bdfea674",
                "claim_number": "CLM-20260808-001",
                "created_at": "2026-08-09T03:16:53.892506",
                "updated_at": "2026-08-09T03:16:53.892512",
            }
        },
    )

    id: UUID
    claim_number: str
    created_at: datetime
    updated_at: datetime