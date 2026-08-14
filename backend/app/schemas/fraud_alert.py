from datetime import date, datetime
from uuid import UUID

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
)


class FraudAlertBase(BaseModel):
    fraud_case_id: UUID

    source: str
    title: str
    description: str | None = None

    detected_date: date

    risk_level: str = "MEDIUM"

    confidence_score: float | None = Field(
        default=None,
        ge=0,
        le=100,
    )

    model_name: str | None = None
    model_version: str | None = None

    status: str = "NEW"


class FraudAlertCreate(FraudAlertBase):
    alert_number: str


class FraudAlertUpdate(BaseModel):
    source: str | None = None
    title: str | None = None
    description: str | None = None

    detected_date: date | None = None

    risk_level: str | None = None

    confidence_score: float | None = Field(
        default=None,
        ge=0,
        le=100,
    )

    model_name: str | None = None
    model_version: str | None = None

    status: str | None = None


class FraudAlertResponse(FraudAlertBase):
    model_config = ConfigDict(
        from_attributes=True,
    )

    id: UUID
    alert_number: str

    created_at: datetime
    updated_at: datetime