from datetime import datetime
from uuid import UUID

from pydantic import (
    BaseModel,
    ConfigDict,
)


class FraudTimelineEventBase(BaseModel):
    fraud_case_id: UUID

    event_type: str
    title: str
    description: str | None = None

    performed_by: str
    event_timestamp: datetime

    source_reference: str | None = None

    status: str = "COMPLETED"


class FraudTimelineEventCreate(
    FraudTimelineEventBase
):
    event_number: str


class FraudTimelineEventUpdate(BaseModel):
    event_type: str | None = None
    title: str | None = None
    description: str | None = None

    performed_by: str | None = None
    event_timestamp: datetime | None = None

    source_reference: str | None = None

    status: str | None = None


class FraudTimelineEventResponse(
    FraudTimelineEventBase
):
    model_config = ConfigDict(
        from_attributes=True,
    )

    id: UUID
    event_number: str

    created_at: datetime
    updated_at: datetime