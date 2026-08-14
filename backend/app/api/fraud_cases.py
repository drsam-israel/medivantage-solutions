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
from app.schemas.fraud_case import (
    FraudCaseCreate,
    FraudCaseResponse,
    FraudCaseUpdate,
)
from app.services.fraud_case import (
    FraudCaseService,
)


router = APIRouter(
    prefix="/fraud-cases",
    tags=["Fraud Investigation"],
)


@router.post(
    "",
    response_model=FraudCaseResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_fraud_case(
    case_data: FraudCaseCreate,
    db: Session = Depends(get_db),
) -> FraudCaseResponse:
    return FraudCaseService.create_case(
        db,
        case_data,
    )


@router.get(
    "",
    response_model=list[FraudCaseResponse],
)
def list_fraud_cases(
    skip: int = Query(
        default=0,
        ge=0,
    ),
    limit: int = Query(
        default=100,
        ge=1,
        le=500,
    ),
    status_filter: str | None = Query(
        default=None,
        alias="status",
    ),
    priority: str | None = None,
    risk_level: str | None = None,
    case_type: str | None = None,
    member_id: UUID | None = None,
    provider_id: UUID | None = None,
    assigned_investigator: str | None = None,
    db: Session = Depends(get_db),
) -> list[FraudCaseResponse]:
    return FraudCaseService.list_cases(
        db=db,
        skip=skip,
        limit=limit,
        status_filter=status_filter,
        priority=priority,
        risk_level=risk_level,
        case_type=case_type,
        member_id=member_id,
        provider_id=provider_id,
        assigned_investigator=(
            assigned_investigator
        ),
    )


@router.get(
    "/number/{case_number}",
    response_model=FraudCaseResponse,
)
def get_fraud_case_by_number(
    case_number: str,
    db: Session = Depends(get_db),
) -> FraudCaseResponse:
    return FraudCaseService.get_case_by_number(
        db,
        case_number,
    )


@router.get(
    "/{fraud_case_id}",
    response_model=FraudCaseResponse,
)
def get_fraud_case(
    fraud_case_id: UUID,
    db: Session = Depends(get_db),
) -> FraudCaseResponse:
    return FraudCaseService.get_case(
        db,
        fraud_case_id,
    )


@router.put(
    "/{fraud_case_id}",
    response_model=FraudCaseResponse,
)
def update_fraud_case(
    fraud_case_id: UUID,
    case_data: FraudCaseUpdate,
    db: Session = Depends(get_db),
) -> FraudCaseResponse:
    return FraudCaseService.update_case(
        db,
        fraud_case_id,
        case_data,
    )


@router.delete(
    "/{fraud_case_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_fraud_case(
    fraud_case_id: UUID,
    db: Session = Depends(get_db),
) -> Response:
    FraudCaseService.delete_case(
        db,
        fraud_case_id,
    )

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )