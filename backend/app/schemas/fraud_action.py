from datetime import date, datetime
from decimal import Decimal
from uuid import UUID

from pydantic import (
    BaseModel,
    ConfigDict,
)


class FraudActionBase(BaseModel):
    fraud_case_id: UUID

    action_type: str
    action_description: str

    owner: str
    due_date: date | None = None

    priority: str = "MEDIUM"
    status: str = "PROPOSED"

    estimated_recovery: Decimal = Decimal("0.00")

    rationale: str | None = None
    approved_by: str | None = None

    completed_date: date | None = None


class FraudActionCreate(FraudActionBase):
    action_number: str


class FraudActionUpdate(BaseModel):
    action_type: str | None = None
    action_description: str | None = None

    owner: str | None = None
    due_date: date | None = None

    priority: str | None = None
    status: str | None = None

    estimated_recovery: Decimal | None = None

    rationale: str | None = None
    approved_by: str | None = None

    completed_date: date | None = None


class FraudActionResponse(FraudActionBase):
    model_config = ConfigDict(
        from_attributes=True,
    )

    id: UUID
    action_number: str

    created_at: datetime
    updated_at: datetime