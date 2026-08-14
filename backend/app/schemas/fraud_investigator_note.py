from datetime import date, datetime
from uuid import UUID

from pydantic import (
    BaseModel,
    ConfigDict,
)


class FraudInvestigatorNoteBase(BaseModel):
    fraud_case_id: UUID

    author: str
    author_role: str | None = None

    note_date: date
    note_text: str

    visibility: str = "INTERNAL"


class FraudInvestigatorNoteCreate(
    FraudInvestigatorNoteBase
):
    note_number: str


class FraudInvestigatorNoteUpdate(BaseModel):
    author: str | None = None
    author_role: str | None = None

    note_date: date | None = None
    note_text: str | None = None

    visibility: str | None = None


class FraudInvestigatorNoteResponse(
    FraudInvestigatorNoteBase
):
    model_config = ConfigDict(
        from_attributes=True,
    )

    id: UUID
    note_number: str

    created_at: datetime
    updated_at: datetime