from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class AIInsightBase(BaseModel):
    title: str = Field(
        min_length=1,
        max_length=255,
    )

    insight_type: str = Field(
        min_length=1,
        max_length=100,
    )

    status: str = Field(
        default="NEW",
        max_length=50,
    )

    priority: str = Field(
        default="MEDIUM",
        max_length=50,
    )

    risk_level: str = Field(
        default="MEDIUM",
        max_length=50,
    )

    description: str | None = None

    recommendation: str | None = None

    ai_rationale: str | None = None

    confidence_score: float | None = Field(
        default=None,
        ge=0,
        le=100,
    )

    model_name: str | None = Field(
        default=None,
        max_length=150,
    )

    model_version: str | None = Field(
        default=None,
        max_length=50,
    )

    source_module: str | None = Field(
        default=None,
        max_length=100,
    )

    source_reference: str | None = Field(
        default=None,
        max_length=150,
    )

    assigned_reviewer: str | None = Field(
        default=None,
        max_length=150,
    )

    review_status: str | None = Field(
        default=None,
        max_length=50,
    )

    review_comment: str | None = None

    review_date: date | None = None

    detected_date: date


class AIInsightCreate(AIInsightBase):
    insight_number: str | None = Field(
        default=None,
        max_length=100,
    )


class AIInsightUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=255,
    )

    insight_type: str | None = Field(
        default=None,
        min_length=1,
        max_length=100,
    )

    status: str | None = Field(
        default=None,
        max_length=50,
    )

    priority: str | None = Field(
        default=None,
        max_length=50,
    )

    risk_level: str | None = Field(
        default=None,
        max_length=50,
    )

    description: str | None = None

    recommendation: str | None = None

    ai_rationale: str | None = None

    confidence_score: float | None = Field(
        default=None,
        ge=0,
        le=100,
    )

    model_name: str | None = Field(
        default=None,
        max_length=150,
    )

    model_version: str | None = Field(
        default=None,
        max_length=50,
    )

    source_module: str | None = Field(
        default=None,
        max_length=100,
    )

    source_reference: str | None = Field(
        default=None,
        max_length=150,
    )

    assigned_reviewer: str | None = Field(
        default=None,
        max_length=150,
    )

    review_status: str | None = Field(
        default=None,
        max_length=50,
    )

    review_comment: str | None = None

    review_date: date | None = None

    detected_date: date | None = None


class AIInsightResponse(AIInsightBase):
    model_config = ConfigDict(
        from_attributes=True,
    )

    id: UUID
    insight_number: str
    created_at: datetime
    updated_at: datetime


class AIInsightApprovalRequest(BaseModel):
    reviewer: str = Field(
        min_length=1,
        max_length=150,
    )

    comment: str | None = None


class AIInsightApprovalResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )

    id: UUID
    insight_number: str
    status: str

    assigned_reviewer: str | None
    review_status: str | None
    review_comment: str | None
    review_date: date | None

    updated_at: datetime