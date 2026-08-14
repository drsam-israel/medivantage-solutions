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
from app.schemas.fraud_recovery import (
    FraudRecoveryCreate,
    FraudRecoveryResponse,
    FraudRecoveryUpdate,
)
from app.services.fraud_recovery import (
    FraudRecoveryService,
)


router = APIRouter(
    prefix="/fraud-recoveries",
    tags=["Fraud Investigation"],
)


@router.post(
    "",
    response_model=FraudRecoveryResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_fraud_recovery(
    recovery_data: FraudRecoveryCreate,
    db: Session = Depends(get_db),
) -> FraudRecoveryResponse:
    return FraudRecoveryService.create_recovery(
        db,
        recovery_data,
    )


@router.get(
    "",
    response_model=list[FraudRecoveryResponse],
)
def list_fraud_recoveries(
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
    recovery_type: str | None = None,
    recovery_status: str | None = Query(
        default=None,
        alias="status",
    ),
    recovery_owner: str | None = None,
    db: Session = Depends(get_db),
) -> list[FraudRecoveryResponse]:
    return FraudRecoveryService.list_recoveries(
        db=db,
        skip=skip,
        limit=limit,
        fraud_case_id=fraud_case_id,
        recovery_type=recovery_type,
        recovery_status=recovery_status,
        recovery_owner=recovery_owner,
    )


@router.get(
    "/number/{recovery_number}",
    response_model=FraudRecoveryResponse,
)
def get_fraud_recovery_by_number(
    recovery_number: str,
    db: Session = Depends(get_db),
) -> FraudRecoveryResponse:
    return FraudRecoveryService.get_recovery_by_number(
        db,
        recovery_number,
    )


@router.get(
    "/{recovery_id}",
    response_model=FraudRecoveryResponse,
)
def get_fraud_recovery(
    recovery_id: UUID,
    db: Session = Depends(get_db),
) -> FraudRecoveryResponse:
    return FraudRecoveryService.get_recovery(
        db,
        recovery_id,
    )


@router.put(
    "/{recovery_id}",
    response_model=FraudRecoveryResponse,
)
def update_fraud_recovery(
    recovery_id: UUID,
    recovery_data: FraudRecoveryUpdate,
    db: Session = Depends(get_db),
) -> FraudRecoveryResponse:
    return FraudRecoveryService.update_recovery(
        db,
        recovery_id,
        recovery_data,
    )


@router.delete(
    "/{recovery_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_fraud_recovery(
    recovery_id: UUID,
    db: Session = Depends(get_db),
) -> Response:
    FraudRecoveryService.delete_recovery(
        db,
        recovery_id,
    )

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )