from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, model_validator


class UnderwritingApplicationBase(BaseModel):
    member_id: UUID

    application_number: str = Field(
        min_length=3,
        max_length=100,
    )

    product: str = Field(
        min_length=2,
        max_length=150,
    )

    submitted_date: date

    risk_score: float | None = Field(
        default=None,
        ge=0,
        le=100,
    )

    status: str = Field(
        default="PENDING_REVIEW",
        min_length=2,
        max_length=50,
    )

    assigned_underwriter: str | None = Field(
        default=None,
        max_length=150,
    )

    clinical_summary: str | None = None

    ai_recommendation: str | None = Field(
        default=None,
        max_length=100,
    )

    decision: str | None = Field(
        default=None,
        max_length=100,
    )

    decision_rationale: str | None = None

    reviewed_at: datetime | None = None

    @model_validator(mode="after")
    def normalize_fields(
        self,
    ) -> "UnderwritingApplicationBase":
        self.status = (
            self.status
            .strip()
            .upper()
            .replace(" ", "_")
        )

        if self.ai_recommendation:
            self.ai_recommendation = (
                self.ai_recommendation
                .strip()
                .upper()
                .replace(" ", "_")
            )

        if self.decision:
            self.decision = (
                self.decision
                .strip()
                .upper()
                .replace(" ", "_")
            )

        return self


class UnderwritingApplicationCreate(
    UnderwritingApplicationBase
):
    pass


class UnderwritingApplicationUpdate(
    BaseModel
):
    product: str | None = Field(
        default=None,
        min_length=2,
        max_length=150,
    )

    submitted_date: date | None = None

    risk_score: float | None = Field(
        default=None,
        ge=0,
        le=100,
    )

    status: str | None = Field(
        default=None,
        min_length=2,
        max_length=50,
    )

    assigned_underwriter: str | None = Field(
        default=None,
        max_length=150,
    )

    clinical_summary: str | None = None

    ai_recommendation: str | None = Field(
        default=None,
        max_length=100,
    )

    decision: str | None = Field(
        default=None,
        max_length=100,
    )

    decision_rationale: str | None = None

    reviewed_at: datetime | None = None


class UnderwritingApplicationResponse(
    UnderwritingApplicationBase
):
    model_config = ConfigDict(
        from_attributes=True,
    )

    id: UUID
    created_at: datetime
    updated_at: datetime