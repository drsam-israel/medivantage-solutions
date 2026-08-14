from uuid import UUID

from fastapi import (
    APIRouter,
    Depends,
    Response,
    status,
)
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.schemas.claim_intelligence import (
    ClaimIntelligenceCreate,
    ClaimIntelligenceResponse,
    ClaimIntelligenceUpdate,
)
from app.services.claim_intelligence import (
    ClaimIntelligenceService,
)


router = APIRouter(
    prefix="/claims",
    tags=["Claims Intelligence"],
)


@router.post(
    "/{claim_id}/intelligence",
    response_model=ClaimIntelligenceResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_claim_intelligence(
    claim_id: UUID,
    intelligence_data: ClaimIntelligenceCreate,
    db: Session = Depends(get_db),
) -> ClaimIntelligenceResponse:
    """
    Create the intelligence and governance record
    associated with a claim.
    """

    if intelligence_data.claim_id != claim_id:
        from fastapi import HTTPException

        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail=(
                "Claim ID in the request body must "
                "match the claim ID in the URL."
            ),
        )

    return ClaimIntelligenceService.create(
        db,
        intelligence_data,
    )


@router.get(
    "/{claim_id}/intelligence",
    response_model=ClaimIntelligenceResponse,
)
def get_claim_intelligence(
    claim_id: UUID,
    db: Session = Depends(get_db),
) -> ClaimIntelligenceResponse:
    """
    Retrieve the intelligence record associated
    with a claim.
    """

    return ClaimIntelligenceService.get_by_claim(
        db,
        claim_id,
    )


@router.put(
    "/{claim_id}/intelligence",
    response_model=ClaimIntelligenceResponse,
)
def update_claim_intelligence(
    claim_id: UUID,
    intelligence_data: ClaimIntelligenceUpdate,
    db: Session = Depends(get_db),
) -> ClaimIntelligenceResponse:
    """
    Update fraud, clinical-review, SLA,
    recommendation, governance, or model metadata
    associated with a claim.
    """

    return ClaimIntelligenceService.update(
        db,
        claim_id,
        intelligence_data,
    )


@router.delete(
    "/{claim_id}/intelligence",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_claim_intelligence(
    claim_id: UUID,
    db: Session = Depends(get_db),
) -> Response:
    """
    Delete the intelligence record associated
    with a claim.
    """

    ClaimIntelligenceService.delete(
        db,
        claim_id,
    )

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )