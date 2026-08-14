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
from app.schemas.fraud_evidence import (
    FraudEvidenceCreate,
    FraudEvidenceResponse,
    FraudEvidenceUpdate,
)
from app.services.fraud_evidence import (
    FraudEvidenceService,
)


router = APIRouter(
    prefix="/fraud-evidence",
    tags=["Fraud Investigation"],
)


@router.post(
    "",
    response_model=FraudEvidenceResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_fraud_evidence(
    evidence_data: FraudEvidenceCreate,
    db: Session = Depends(get_db),
) -> FraudEvidenceResponse:
    return FraudEvidenceService.create_evidence(
        db,
        evidence_data,
    )


@router.get(
    "",
    response_model=list[FraudEvidenceResponse],
)
def list_fraud_evidence(
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
    evidence_type: str | None = None,
    status_filter: str | None = Query(
        default=None,
        alias="status",
    ),
    uploaded_by: str | None = None,
    db: Session = Depends(get_db),
) -> list[FraudEvidenceResponse]:
    return FraudEvidenceService.list_evidence(
        db=db,
        skip=skip,
        limit=limit,
        fraud_case_id=fraud_case_id,
        evidence_type=evidence_type,
        status_filter=status_filter,
        uploaded_by=uploaded_by,
    )


@router.get(
    "/number/{evidence_number}",
    response_model=FraudEvidenceResponse,
)
def get_fraud_evidence_by_number(
    evidence_number: str,
    db: Session = Depends(get_db),
) -> FraudEvidenceResponse:
    return FraudEvidenceService.get_evidence_by_number(
        db,
        evidence_number,
    )


@router.get(
    "/{evidence_id}",
    response_model=FraudEvidenceResponse,
)
def get_fraud_evidence(
    evidence_id: UUID,
    db: Session = Depends(get_db),
) -> FraudEvidenceResponse:
    return FraudEvidenceService.get_evidence(
        db,
        evidence_id,
    )


@router.put(
    "/{evidence_id}",
    response_model=FraudEvidenceResponse,
)
def update_fraud_evidence(
    evidence_id: UUID,
    evidence_data: FraudEvidenceUpdate,
    db: Session = Depends(get_db),
) -> FraudEvidenceResponse:
    return FraudEvidenceService.update_evidence(
        db,
        evidence_id,
        evidence_data,
    )


@router.delete(
    "/{evidence_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_fraud_evidence(
    evidence_id: UUID,
    db: Session = Depends(get_db),
) -> Response:
    FraudEvidenceService.delete_evidence(
        db,
        evidence_id,
    )

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )