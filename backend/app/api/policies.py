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
from app.schemas.policy import (
    PolicyCreate,
    PolicyResponse,
    PolicyUpdate,
)
from app.services.policy import PolicyService


router = APIRouter(
    prefix="/policies",
    tags=["Policies"],
)


@router.post(
    "",
    response_model=PolicyResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_policy(
    policy_data: PolicyCreate,
    db: Session = Depends(get_db),
) -> PolicyResponse:
    return PolicyService.create_policy(
        db,
        policy_data,
    )


@router.get(
    "",
    response_model=list[PolicyResponse],
)
def list_policies(
    skip: int = Query(
        default=0,
        ge=0,
    ),
    limit: int = Query(
        default=100,
        ge=1,
        le=500,
    ),
    policy_status: str | None = None,
    policy_type: str | None = None,
    policyholder_member_id: UUID | None = None,
    health_plan_id: UUID | None = None,
    is_active: bool | None = None,
    db: Session = Depends(get_db),
) -> list[PolicyResponse]:
    return PolicyService.list_policies(
        db=db,
        skip=skip,
        limit=limit,
        policy_status=policy_status,
        policy_type=policy_type,
        policyholder_member_id=(
            policyholder_member_id
        ),
        health_plan_id=health_plan_id,
        is_active=is_active,
    )


@router.get(
    "/number/{policy_number}",
    response_model=PolicyResponse,
)
def get_policy_by_number(
    policy_number: str,
    db: Session = Depends(get_db),
) -> PolicyResponse:
    return (
        PolicyService
        .get_policy_by_number(
            db,
            policy_number,
        )
    )


@router.get(
    "/{policy_id}",
    response_model=PolicyResponse,
)
def get_policy(
    policy_id: UUID,
    db: Session = Depends(get_db),
) -> PolicyResponse:
    return PolicyService.get_policy(
        db,
        policy_id,
    )


@router.put(
    "/{policy_id}",
    response_model=PolicyResponse,
)
def update_policy(
    policy_id: UUID,
    policy_data: PolicyUpdate,
    db: Session = Depends(get_db),
) -> PolicyResponse:
    return PolicyService.update_policy(
        db,
        policy_id,
        policy_data,
    )


@router.delete(
    "/{policy_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_policy(
    policy_id: UUID,
    db: Session = Depends(get_db),
) -> Response:
    PolicyService.delete_policy(
        db,
        policy_id,
    )

    return Response(
        status_code=(
            status.HTTP_204_NO_CONTENT
        ),
    )