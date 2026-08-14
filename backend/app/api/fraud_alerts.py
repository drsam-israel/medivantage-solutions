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
from app.schemas.fraud_alert import (
    FraudAlertCreate,
    FraudAlertResponse,
    FraudAlertUpdate,
)
from app.services.fraud_alert import (
    FraudAlertService,
)


router = APIRouter(
    prefix="/fraud-alerts",
    tags=["Fraud Investigation"],
)


@router.post(
    "",
    response_model=FraudAlertResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_fraud_alert(
    alert_data: FraudAlertCreate,
    db: Session = Depends(get_db),
) -> FraudAlertResponse:
    return FraudAlertService.create_alert(
        db,
        alert_data,
    )


@router.get(
    "",
    response_model=list[FraudAlertResponse],
)
def list_fraud_alerts(
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
    source: str | None = None,
    risk_level: str | None = None,
    status_filter: str | None = Query(
        default=None,
        alias="status",
    ),
    db: Session = Depends(get_db),
) -> list[FraudAlertResponse]:
    return FraudAlertService.list_alerts(
        db=db,
        skip=skip,
        limit=limit,
        fraud_case_id=fraud_case_id,
        source=source,
        risk_level=risk_level,
        status_filter=status_filter,
    )


@router.get(
    "/number/{alert_number}",
    response_model=FraudAlertResponse,
)
def get_fraud_alert_by_number(
    alert_number: str,
    db: Session = Depends(get_db),
) -> FraudAlertResponse:
    return FraudAlertService.get_alert_by_number(
        db,
        alert_number,
    )


@router.get(
    "/{fraud_alert_id}",
    response_model=FraudAlertResponse,
)
def get_fraud_alert(
    fraud_alert_id: UUID,
    db: Session = Depends(get_db),
) -> FraudAlertResponse:
    return FraudAlertService.get_alert(
        db,
        fraud_alert_id,
    )


@router.put(
    "/{fraud_alert_id}",
    response_model=FraudAlertResponse,
)
def update_fraud_alert(
    fraud_alert_id: UUID,
    alert_data: FraudAlertUpdate,
    db: Session = Depends(get_db),
) -> FraudAlertResponse:
    return FraudAlertService.update_alert(
        db,
        fraud_alert_id,
        alert_data,
    )


@router.delete(
    "/{fraud_alert_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_fraud_alert(
    fraud_alert_id: UUID,
    db: Session = Depends(get_db),
) -> Response:
    FraudAlertService.delete_alert(
        db,
        fraud_alert_id,
    )

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )