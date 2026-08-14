from uuid import UUID

from fastapi import (
    APIRouter,
    Depends,
    Query,
    Response,
    status,
)
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.schemas.prior_authorization import (
    PriorAuthorizationCreate,
    PriorAuthorizationDecision,
    PriorAuthorizationResponse,
    PriorAuthorizationUpdate,
)
from app.services.prior_authorization import (
    PriorAuthorizationService,
)

router = APIRouter(
    prefix="/prior-authorizations",
    tags=["Prior Authorization"],
)


@router.post(
    "",
    response_model=PriorAuthorizationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_prior_authorization(
    authorization_data: PriorAuthorizationCreate,
    db: Session = Depends(get_db),
) -> PriorAuthorizationResponse:
    return PriorAuthorizationService.create_authorization(
        db,
        authorization_data,
    )


@router.get(
    "",
    response_model=list[PriorAuthorizationResponse],
)
def list_prior_authorizations(
    skip: int = Query(
        default=0,
        ge=0,
    ),
    limit: int = Query(
        default=100,
        ge=1,
        le=500,
    ),
    member_id: UUID | None = None,
    provider_id: UUID | None = None,
    status_filter: str | None = Query(
        default=None,
        alias="status",
    ),
    priority: str | None = None,
    db: Session = Depends(get_db),
) -> list[PriorAuthorizationResponse]:
    return PriorAuthorizationService.list_authorizations(
        db=db,
        skip=skip,
        limit=limit,
        member_id=member_id,
        provider_id=provider_id,
        status_filter=status_filter,
        priority=priority,
    )


@router.get(
    "/{authorization_id}",
    response_model=PriorAuthorizationResponse,
)
def get_prior_authorization(
    authorization_id: UUID,
    db: Session = Depends(get_db),
) -> PriorAuthorizationResponse:
    return PriorAuthorizationService.get_authorization(
        db,
        authorization_id,
    )


@router.put(
    "/{authorization_id}",
    response_model=PriorAuthorizationResponse,
)
def update_prior_authorization(
    authorization_id: UUID,
    authorization_data: PriorAuthorizationUpdate,
    db: Session = Depends(get_db),
) -> PriorAuthorizationResponse:
    return PriorAuthorizationService.update_authorization(
        db,
        authorization_id,
        authorization_data,
    )


@router.post(
    "/{authorization_id}/decision",
    response_model=PriorAuthorizationResponse,
)
def make_prior_authorization_decision(
    authorization_id: UUID,
    decision_data: PriorAuthorizationDecision,
    db: Session = Depends(get_db),
) -> PriorAuthorizationResponse:
    return PriorAuthorizationService.make_decision(
        db,
        authorization_id,
        decision_data,
    )


@router.delete(
    "/{authorization_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_prior_authorization(
    authorization_id: UUID,
    db: Session = Depends(get_db),
) -> Response:
    PriorAuthorizationService.delete_authorization(
        db,
        authorization_id,
    )

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )