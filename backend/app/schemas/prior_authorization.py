from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class PriorAuthorizationBase(BaseModel):
    member_id: UUID
    provider_id: UUID
    enrollment_id: UUID | None = None

    diagnosis_code: str | None = None
    diagnosis_description: str | None = None

    procedure_code: str | None = None
    procedure_description: str

    requested_service_date: date | None = None

    priority: str = "ROUTINE"

    clinical_summary: str | None = None

    coverage_status: str | None = None
    benefit_category: str | None = None
    service_covered: str | None = None
    authorization_required: str | None = None

    ai_recommendation: str | None = None
    ai_confidence: float | None = Field(
        default=None,
        ge=0,
        le=100,
    )
    medical_necessity_score: float | None = Field(
        default=None,
        ge=0,
        le=100,
    )
    ai_rationale: str | None = None

    assigned_reviewer: str | None = None
    review_due_at: datetime | None = None


class PriorAuthorizationCreate(PriorAuthorizationBase):
    authorization_number: str


class PriorAuthorizationUpdate(BaseModel):
    diagnosis_code: str | None = None
    diagnosis_description: str | None = None

    procedure_code: str | None = None
    procedure_description: str | None = None

    requested_service_date: date | None = None

    priority: str | None = None
    status: str | None = None

    clinical_summary: str | None = None

    coverage_status: str | None = None
    benefit_category: str | None = None
    service_covered: str | None = None
    authorization_required: str | None = None

    ai_recommendation: str | None = None
    ai_confidence: float | None = Field(
        default=None,
        ge=0,
        le=100,
    )
    medical_necessity_score: float | None = Field(
        default=None,
        ge=0,
        le=100,
    )
    ai_rationale: str | None = None

    assigned_reviewer: str | None = None
    review_due_at: datetime | None = None


class PriorAuthorizationDecision(BaseModel):
    action: str
    reviewer: str
    rationale: str | None = None
    information_requested: str | None = None
    escalation_reason: str | None = None
    escalated_to: str | None = None


class PriorAuthorizationResponse(PriorAuthorizationBase):
    model_config = ConfigDict(
        from_attributes=True,
    )

    id: UUID
    authorization_number: str
    status: str

    final_decision: str | None = None
    decision_rationale: str | None = None

    information_requested: str | None = None

    escalation_reason: str | None = None
    escalated_to: str | None = None

    decided_by: str | None = None
    decided_at: datetime | None = None

    created_at: datetime
    updated_at: datetime