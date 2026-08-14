from datetime import datetime
from uuid import UUID

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
)


class ClaimIntelligenceBase(BaseModel):
    fraud_risk_score: float | None = Field(
        default=None,
        ge=0,
        le=100,
    )

    fraud_risk_level: str | None = None
    fraud_risk_reason: str | None = None

    clinical_review_status: str = "NOT_REVIEWED"
    clinical_review_summary: str | None = None

    sla_status: str = "ON_TRACK"
    sla_due_at: datetime | None = None
    sla_breached: bool = False

    decision_recommendation: str | None = None

    decision_confidence: float | None = Field(
        default=None,
        ge=0,
        le=100,
    )

    decision_reason: str | None = None

    requires_manual_review: bool = True

    reviewed_by: str | None = None
    reviewed_at: datetime | None = None

    model_name: str | None = None
    model_version: str | None = None


class ClaimIntelligenceCreate(
    ClaimIntelligenceBase,
):
    claim_id: UUID


class ClaimIntelligenceUpdate(BaseModel):
    fraud_risk_score: float | None = Field(
        default=None,
        ge=0,
        le=100,
    )

    fraud_risk_level: str | None = None
    fraud_risk_reason: str | None = None

    clinical_review_status: str | None = None
    clinical_review_summary: str | None = None

    sla_status: str | None = None
    sla_due_at: datetime | None = None
    sla_breached: bool | None = None

    decision_recommendation: str | None = None

    decision_confidence: float | None = Field(
        default=None,
        ge=0,
        le=100,
    )

    decision_reason: str | None = None

    requires_manual_review: bool | None = None

    reviewed_by: str | None = None
    reviewed_at: datetime | None = None

    model_name: str | None = None
    model_version: str | None = None


class ClaimIntelligenceResponse(
    ClaimIntelligenceBase,
):
    model_config = ConfigDict(
        from_attributes=True,
    )

    id: UUID
    claim_id: UUID

    created_at: datetime
    updated_at: datetime