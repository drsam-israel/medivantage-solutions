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
from app.schemas.fraud_action import (
    FraudActionCreate,
    FraudActionResponse,
    FraudActionUpdate,
)
from app.services.fraud_action import (
    FraudActionService,
)


router = APIRouter(
    prefix="/fraud-actions",
    tags=["Fraud Investigation"],
)


@router.post(
    "",
    response_model=FraudActionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_fraud_action(
    action_data: FraudActionCreate,
    db: Session = Depends(get_db),
) -> FraudActionResponse:
    return FraudActionService.create_action(
        db,
        action_data,
    )


@router.get(
    "",
    response_model=list[FraudActionResponse],
)
def list_fraud_actions(
    skip: int = Query(
        default=0,
        ge=0,
    ),
    limit: int = Query(
        default=100,
        ge=1,
        le=500,
    ),
    fraud_case_id: UUID | None = None,
    action_type: str | None = None,
    owner: str | None = None,
    priority: str | None = None,
    action_status: str | None = Query(
        default=None,
        alias="status",
    ),
    db: Session = Depends(get_db),
) -> list[FraudActionResponse]:
    return FraudActionService.list_actions(
        db=db,
        skip=skip,
        limit=limit,
        fraud_case_id=fraud_case_id,
        action_type=action_type,
        owner=owner,
        priority=priority,
        status_filter=action_status,
    )


@router.get(
    "/number/{action_number}",
    response_model=FraudActionResponse,
)
def get_fraud_action_by_number(
    action_number: str,
    db: Session = Depends(get_db),
) -> FraudActionResponse:
    return FraudActionService.get_action_by_number(
        db,
        action_number,
    )


@router.get(
    "/{action_id}",
    response_model=FraudActionResponse,
)
def get_fraud_action(
    action_id: UUID,
    db: Session = Depends(get_db),
) -> FraudActionResponse:
    return FraudActionService.get_action(
        db,
        action_id,
    )


@router.put(
    "/{action_id}",
    response_model=FraudActionResponse,
)
def update_fraud_action(
    action_id: UUID,
    action_data: FraudActionUpdate,
    db: Session = Depends(get_db),
) -> FraudActionResponse:
    return FraudActionService.update_action(
        db,
        action_id,
        action_data,
    )


@router.delete(
    "/{action_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_fraud_action(
    action_id: UUID,
    db: Session = Depends(get_db),
) -> Response:
    FraudActionService.delete_action(
        db,
        action_id,
    )

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )