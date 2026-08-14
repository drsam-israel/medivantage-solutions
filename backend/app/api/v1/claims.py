from uuid import UUID

from fastapi import (
    APIRouter,
    Depends,
    Response,
    status,
)
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.claim import (
    ClaimCreate,
    ClaimResponse,
    ClaimUpdate,
)
from app.services.claim_service import ClaimService


router = APIRouter(
    prefix="/claims",
    tags=["Claims"],
)


@router.post(
    "",
    response_model=ClaimResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        400: {
            "description": "Invalid claim data or business rule violation.",
        },
        404: {
            "description": (
                "Related member, provider, or enrollment was not found."
            ),
        },
        409: {
            "description": "A claim with the same claim number already exists.",
        },
        422: {
            "description": "Request validation error.",
        },
    },
)
def create_claim(
    claim_data: ClaimCreate,
    db: Session = Depends(get_db),
) -> ClaimResponse:
    service = ClaimService(
        db,
    )

    return service.create_claim(
        claim_data,
    )


@router.get(
    "",
    response_model=list[ClaimResponse],
    responses={
        200: {
            "description": "Claims retrieved successfully.",
        },
    },
)
def list_claims(
    db: Session = Depends(get_db),
) -> list[ClaimResponse]:
    service = ClaimService(
        db,
    )

    return service.list_claims()


@router.get(
    "/number/{claim_number}",
    response_model=ClaimResponse,
    responses={
        200: {
            "description": "Claim retrieved successfully.",
        },
        404: {
            "description": "Claim not found.",
        },
        422: {
            "description": "Request validation error.",
        },
    },
)
def get_claim_by_number(
    claim_number: str,
    db: Session = Depends(get_db),
) -> ClaimResponse:
    service = ClaimService(
        db,
    )

    return service.get_claim_by_number(
        claim_number,
    )


@router.get(
    "/{claim_id}",
    response_model=ClaimResponse,
    responses={
        200: {
            "description": "Claim retrieved successfully.",
        },
        404: {
            "description": "Claim not found.",
        },
        422: {
            "description": "Invalid claim ID.",
        },
    },
)
def get_claim(
    claim_id: UUID,
    db: Session = Depends(get_db),
) -> ClaimResponse:
    service = ClaimService(
        db,
    )

    return service.get_claim(
        claim_id,
    )


@router.patch(
    "/{claim_id}",
    response_model=ClaimResponse,
    responses={
        200: {
            "description": "Claim updated successfully.",
        },
        400: {
            "description": (
                "Invalid claim update, financial validation failure, "
                "missing denial reason, or invalid status transition."
            ),
        },
        404: {
            "description": "Claim not found.",
        },
        422: {
            "description": "Request validation error.",
        },
    },
)
def update_claim(
    claim_id: UUID,
    claim_data: ClaimUpdate,
    db: Session = Depends(get_db),
) -> ClaimResponse:
    service = ClaimService(
        db,
    )

    return service.update_claim(
        claim_id,
        claim_data,
    )


@router.delete(
    "/{claim_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        204: {
            "description": "Claim deleted successfully.",
        },
        404: {
            "description": "Claim not found.",
        },
        422: {
            "description": "Invalid claim ID.",
        },
    },
)
def delete_claim(
    claim_id: UUID,
    db: Session = Depends(get_db),
) -> Response:
    service = ClaimService(
        db,
    )

    service.delete_claim(
        claim_id,
    )

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )