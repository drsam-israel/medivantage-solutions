from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.schemas.eligibility import (
    EligibilityRequest,
    EligibilityResponse,
)
from app.services.eligibility import EligibilityService


router = APIRouter(
    prefix="/eligibility",
    tags=["Eligibility"],
)


@router.post(
    "/verify",
    response_model=EligibilityResponse,
)
def verify_eligibility(
    request_data: EligibilityRequest,
    db: Session = Depends(get_db),
) -> EligibilityResponse:
    """
    Verify whether a member is eligible for services
    on the requested service date.
    """

    return EligibilityService.verify_eligibility(
        db=db,
        request_data=request_data,
    )