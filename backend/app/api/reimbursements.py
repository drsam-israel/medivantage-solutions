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
from app.schemas.reimbursement import (
    ReimbursementApprovalRequest,
    ReimbursementCreate,
    ReimbursementPaymentRequest,
    ReimbursementReconciliationRequest,
    ReimbursementResponse,
    ReimbursementUpdate,
)
from app.services.reimbursement import (
    ReimbursementService,
)


router = APIRouter(
    prefix="/reimbursements",
    tags=["Reimbursements & Payments"],
)


@router.post(
    "",
    response_model=ReimbursementResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_reimbursement(
    reimbursement_data: ReimbursementCreate,
    db: Session = Depends(get_db),
) -> ReimbursementResponse:
    return ReimbursementService.create(
        db,
        reimbursement_data,
    )


@router.get(
    "",
    response_model=list[ReimbursementResponse],
)
def list_reimbursements(
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
    approval_status: str | None = None,
    reconciliation_status: str | None = None,
    provider_id: UUID | None = None,
    member_id: UUID | None = None,
    claim_id: UUID | None = None,
    db: Session = Depends(get_db),
) -> list[ReimbursementResponse]:
    return ReimbursementService.list(
        db=db,
        skip=skip,
        limit=limit,
        status_filter=status_filter,
        approval_status=approval_status,
        reconciliation_status=reconciliation_status,
        provider_id=provider_id,
        member_id=member_id,
        claim_id=claim_id,
    )


@router.get(
    "/{reimbursement_id}",
    response_model=ReimbursementResponse,
)
def get_reimbursement(
    reimbursement_id: UUID,
    db: Session = Depends(get_db),
) -> ReimbursementResponse:
    return ReimbursementService.get(
        db,
        reimbursement_id,
    )


@router.put(
    "/{reimbursement_id}",
    response_model=ReimbursementResponse,
)
def update_reimbursement(
    reimbursement_id: UUID,
    reimbursement_data: ReimbursementUpdate,
    db: Session = Depends(get_db),
) -> ReimbursementResponse:
    return ReimbursementService.update(
        db,
        reimbursement_id,
        reimbursement_data,
    )


@router.post(
    "/{reimbursement_id}/approve",
    response_model=ReimbursementResponse,
)
def approve_reimbursement(
    reimbursement_id: UUID,
    approval_data: ReimbursementApprovalRequest,
    db: Session = Depends(get_db),
) -> ReimbursementResponse:
    return ReimbursementService.approve(
        db,
        reimbursement_id,
        approval_data,
    )


@router.post(
    "/{reimbursement_id}/pay",
    response_model=ReimbursementResponse,
)
def pay_reimbursement(
    reimbursement_id: UUID,
    payment_data: ReimbursementPaymentRequest,
    db: Session = Depends(get_db),
) -> ReimbursementResponse:
    return ReimbursementService.pay(
        db,
        reimbursement_id,
        payment_data,
    )


@router.post(
    "/{reimbursement_id}/reconcile",
    response_model=ReimbursementResponse,
)
def reconcile_reimbursement(
    reimbursement_id: UUID,
    reconciliation_data: ReimbursementReconciliationRequest,
    db: Session = Depends(get_db),
) -> ReimbursementResponse:
    return ReimbursementService.reconcile(
        db,
        reimbursement_id,
        reconciliation_data,
    )


@router.delete(
    "/{reimbursement_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_reimbursement(
    reimbursement_id: UUID,
    db: Session = Depends(get_db),
) -> Response:
    ReimbursementService.delete(
        db,
        reimbursement_id,
    )

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )