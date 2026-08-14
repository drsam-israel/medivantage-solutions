from datetime import datetime, timezone
from decimal import Decimal
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.claim import Claim
from app.models.reimbursement import Reimbursement
from app.repositories.reimbursement import (
    ReimbursementRepository,
)
from app.schemas.reimbursement import (
    ReimbursementApprovalRequest,
    ReimbursementCreate,
    ReimbursementPaymentRequest,
    ReimbursementReconciliationRequest,
    ReimbursementUpdate,
)


class ReimbursementService:
    ELIGIBLE_CLAIM_STATUSES = {
        "APPROVED",
        "PAID",
    }

    @staticmethod
    def _get_claim(
        db: Session,
        claim_id: UUID,
    ) -> Claim:
        claim = (
            db.query(Claim)
            .filter(
                Claim.id == claim_id,
            )
            .first()
        )

        if claim is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Linked claim not found.",
            )

        return claim

    @staticmethod
    def _validate_claim_eligibility(
        claim: Claim,
    ) -> None:
        claim_status = (
            claim.claim_status or ""
        ).upper()

        if claim_status not in (
            ReimbursementService
            .ELIGIBLE_CLAIM_STATUSES
        ):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    "Only approved or paid claims "
                    "can generate provider reimbursements. "
                    f"Current claim status: {claim_status}."
                ),
            )

        if claim.payer_responsibility is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "The linked claim does not have "
                    "a payer responsibility amount."
                ),
            )

        if claim.payer_responsibility < 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "Payer responsibility cannot "
                    "be negative."
                ),
            )

    @staticmethod
    def _calculate_net_payable(
        approved_amount: Decimal,
        withholding_amount: Decimal,
        recovery_amount: Decimal,
    ) -> Decimal:
        net_payable_amount = (
            approved_amount
            - withholding_amount
            - recovery_amount
        )

        if net_payable_amount < 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "Withholding and recovery amounts "
                    "cannot exceed the payer "
                    "responsibility amount."
                ),
            )

        return net_payable_amount

    @staticmethod
    def create(
        db: Session,
        reimbursement_data: ReimbursementCreate,
    ) -> Reimbursement:
        existing = (
            ReimbursementRepository.get_by_number(
                db,
                reimbursement_data.reimbursement_number,
            )
        )

        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    "A reimbursement with this number "
                    "already exists."
                ),
            )

        claim = ReimbursementService._get_claim(
            db,
            reimbursement_data.claim_id,
        )

        ReimbursementService._validate_claim_eligibility(
            claim,
        )

        if (
            reimbursement_data.provider_id
            != claim.provider_id
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "Reimbursement provider does not "
                    "match the linked claim provider."
                ),
            )

        if (
            reimbursement_data.member_id is not None
            and reimbursement_data.member_id
            != claim.member_id
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "Reimbursement member does not "
                    "match the linked claim member."
                ),
            )

        approved_amount = Decimal(
            claim.payer_responsibility,
        )

        withholding_amount = Decimal(
            reimbursement_data.withholding_amount,
        )

        recovery_amount = Decimal(
            reimbursement_data.recovery_amount,
        )

        net_payable_amount = (
            ReimbursementService
            ._calculate_net_payable(
                approved_amount=
                    approved_amount,
                withholding_amount=
                    withholding_amount,
                recovery_amount=
                    recovery_amount,
            )
        )

        corrected_data = (
            reimbursement_data.model_copy(
                update={
                    "provider_id":
                        claim.provider_id,
                    "member_id":
                        claim.member_id,
                    "billed_amount":
                        claim.billed_amount,
                    "approved_amount":
                        approved_amount,
                    "net_payable_amount":
                        net_payable_amount,
                },
            )
        )

        return ReimbursementRepository.create(
            db,
            corrected_data,
        )

    @staticmethod
    def get(
        db: Session,
        reimbursement_id: UUID,
    ) -> Reimbursement:
        reimbursement = (
            ReimbursementRepository.get_by_id(
                db,
                reimbursement_id,
            )
        )

        if reimbursement is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Reimbursement not found.",
            )

        return reimbursement

    @staticmethod
    def list(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        status_filter: str | None = None,
        approval_status: str | None = None,
        reconciliation_status: str | None = None,
        provider_id: UUID | None = None,
        member_id: UUID | None = None,
        claim_id: UUID | None = None,
    ) -> list[Reimbursement]:
        return ReimbursementRepository.list(
            db=db,
            skip=skip,
            limit=limit,
            status=status_filter,
            approval_status=approval_status,
            reconciliation_status=
                reconciliation_status,
            provider_id=provider_id,
            member_id=member_id,
            claim_id=claim_id,
        )

    @staticmethod
    def update(
        db: Session,
        reimbursement_id: UUID,
        reimbursement_data: ReimbursementUpdate,
    ) -> Reimbursement:
        reimbursement = (
            ReimbursementService.get(
                db,
                reimbursement_id,
            )
        )

        if reimbursement.status in {
            "PAID",
            "RECONCILED",
        }:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    "Paid or reconciled reimbursements "
                    "cannot be modified."
                ),
            )

        update_values = (
            reimbursement_data.model_dump(
                exclude_unset=True,
            )
        )

        financial_fields = {
            "approved_amount",
            "net_payable_amount",
            "billed_amount",
        }

        if financial_fields.intersection(
            update_values.keys(),
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "Billed amount, approved amount and "
                    "net payable amount are derived from "
                    "the linked claim and cannot be "
                    "manually updated."
                ),
            )

        withholding_amount = Decimal(
            update_values.get(
                "withholding_amount",
                reimbursement.withholding_amount,
            ),
        )

        recovery_amount = Decimal(
            update_values.get(
                "recovery_amount",
                reimbursement.recovery_amount,
            ),
        )

        approved_amount = Decimal(
            reimbursement.approved_amount,
        )

        net_payable_amount = (
            ReimbursementService
            ._calculate_net_payable(
                approved_amount=
                    approved_amount,
                withholding_amount=
                    withholding_amount,
                recovery_amount=
                    recovery_amount,
            )
        )

        corrected_update = (
            reimbursement_data.model_copy(
                update={
                    "net_payable_amount":
                        net_payable_amount,
                },
            )
        )

        return ReimbursementRepository.update(
            db,
            reimbursement,
            corrected_update,
        )

    @staticmethod
    def approve(
        db: Session,
        reimbursement_id: UUID,
        approval_data: ReimbursementApprovalRequest,
    ) -> Reimbursement:
        reimbursement = (
            ReimbursementService.get(
                db,
                reimbursement_id,
            )
        )

        if (
            reimbursement.status
            != "PENDING_APPROVAL"
        ):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    "Only reimbursements pending approval "
                    "can be approved."
                ),
            )

        claim = ReimbursementService._get_claim(
            db,
            reimbursement.claim_id,
        )

        ReimbursementService._validate_claim_eligibility(
            claim,
        )

        reimbursement.approval_status = (
            "APPROVED"
        )

        reimbursement.status = "APPROVED"

        reimbursement.approved_by = (
            approval_data.approved_by
        )

        reimbursement.approval_notes = (
            approval_data.approval_notes
        )

        reimbursement.approved_at = (
            datetime.now(timezone.utc)
        )

        return ReimbursementRepository.save(
            db,
            reimbursement,
        )

    @staticmethod
    def pay(
        db: Session,
        reimbursement_id: UUID,
        payment_data: ReimbursementPaymentRequest,
    ) -> Reimbursement:
        reimbursement = (
            ReimbursementService.get(
                db,
                reimbursement_id,
            )
        )

        if reimbursement.status != "APPROVED":
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    "Only approved reimbursements "
                    "can be paid."
                ),
            )

        claim = ReimbursementService._get_claim(
            db,
            reimbursement.claim_id,
        )

        ReimbursementService._validate_claim_eligibility(
            claim,
        )

        reimbursement.payment_method = (
            payment_data.payment_method
        )

        reimbursement.payment_reference = (
            payment_data.payment_reference
        )

        reimbursement.status = "PAID"

        reimbursement.paid_at = (
            datetime.now(timezone.utc)
        )

        return ReimbursementRepository.save(
            db,
            reimbursement,
        )

    @staticmethod
    def reconcile(
        db: Session,
        reimbursement_id: UUID,
        reconciliation_data:
            ReimbursementReconciliationRequest,
    ) -> Reimbursement:
        reimbursement = (
            ReimbursementService.get(
                db,
                reimbursement_id,
            )
        )

        if reimbursement.status != "PAID":
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    "Only paid reimbursements "
                    "can be reconciled."
                ),
            )

        reimbursement.reconciliation_status = (
            reconciliation_data
            .reconciliation_status
        )

        reimbursement.reconciliation_reference = (
            reconciliation_data
            .reconciliation_reference
        )

        reimbursement.reconciled_by = (
            reconciliation_data.reconciled_by
        )

        reimbursement.reconciled_at = (
            datetime.now(timezone.utc)
        )

        if (
            reconciliation_data
            .reconciliation_status
            == "RECONCILED"
        ):
            reimbursement.status = (
                "RECONCILED"
            )

        elif (
            reconciliation_data
            .reconciliation_status
            == "EXCEPTION"
        ):
            reimbursement.status = (
                "RECONCILIATION_EXCEPTION"
            )

        return ReimbursementRepository.save(
            db,
            reimbursement,
        )

    @staticmethod
    def delete(
        db: Session,
        reimbursement_id: UUID,
    ) -> None:
        reimbursement = (
            ReimbursementService.get(
                db,
                reimbursement_id,
            )
        )

        if reimbursement.status in {
            "PAID",
            "RECONCILED",
        }:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    "Paid or reconciled reimbursements "
                    "cannot be deleted."
                ),
            )

        ReimbursementRepository.delete(
            db,
            reimbursement,
        )