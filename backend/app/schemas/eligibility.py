from datetime import date
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class EligibilityRequest(BaseModel):
    """
    Request payload for eligibility verification.
    """

    member_id: UUID
    provider_id: UUID
    service_date: date


class EligibilityResponse(BaseModel):
    """
    Response returned after eligibility verification.
    """

    model_config = ConfigDict(from_attributes=True)

    eligible: bool

    member_id: UUID

    member_name: str

    policy_number: str | None = None

    plan_name: str | None = None

    coverage_status: str

    effective_date: date | None = None

    expiration_date: date | None = None

    message: str