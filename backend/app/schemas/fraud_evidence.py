from datetime import date, datetime
from uuid import UUID

from pydantic import (
    BaseModel,
    ConfigDict,
)


class FraudEvidenceBase(BaseModel):
    fraud_case_id: UUID

    evidence_type: str
    title: str
    description: str | None = None

    source_reference: str | None = None
    uploaded_by: str | None = None
    uploaded_date: date

    status: str = "PENDING_REVIEW"

    verification_notes: str | None = None
    storage_reference: str | None = None


class FraudEvidenceCreate(FraudEvidenceBase):
    evidence_number: str


class FraudEvidenceUpdate(BaseModel):
    evidence_type: str | None = None
    title: str | None = None
    description: str | None = None

    source_reference: str | None = None
    uploaded_by: str | None = None
    uploaded_date: date | None = None

    status: str | None = None

    verification_notes: str | None = None
    storage_reference: str | None = None


class FraudEvidenceResponse(FraudEvidenceBase):
    model_config = ConfigDict(
        from_attributes=True,
    )

    id: UUID
    evidence_number: str

    created_at: datetime
    updated_at: datetime