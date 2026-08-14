from decimal import Decimal
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.claim import Claim
from app.models.enrollment import Enrollment
from app.models.member import Member
from app.models.provider import Provider
from app.repositories.claim_repository import ClaimRepository
from app.schemas.claim import (
    ClaimCreate,
    ClaimUpdate,
)


class ClaimService:
    """Business logic for healthcare insurance claims."""

    ALLOWED_STATUSES = {
        "SUBMITTED",
        "UNDER_REVIEW",
        "APPROVED",
        "PARTIALLY_APPROVED",
        "DENIED",
        "PAID",
        "CANCELLED",
    }

    STATUS_TRANSITIONS = {
        "SUBMITTED": {
            "UNDER_REVIEW",
            "CANCELLED",
        },
        "UNDER_REVIEW": {
            "APPROVED",
            "PARTIALLY_APPROVED",
            "DENIED",
            "CANCELLED",
        },
        "APPROVED": {
            "PAID",
            "CANCELLED",
        },
        "PARTIALLY_APPROVED": {
            "PAID",
            "CANCELLED",
        },
        "DENIED": set(),
        "PAID": set(),
        "CANCELLED": set(),
    }

    def __init__(
        self,
        db: Session,
    ):
        self.db = db
        self.repository = ClaimRepository(
            db,
        )

    def create_claim(
        self,
        claim_data: ClaimCreate,
    ) -> Claim:
        existing_claim = (
            self.repository.get_by_claim_number(
                claim_data.claim_number,
            )
        )

        if existing_claim:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    "A claim with this claim number already exists."
                ),
            )

        self._validate_related_records(
            member_id=claim_data.member_id,
            provider_id=claim_data.provider_id,
            enrollment_id=claim_data.enrollment_id,
        )

        self._validate_claim_amounts(
            billed_amount=claim_data.billed_amount,
            allowed_amount=claim_data.allowed_amount,
            deductible_amount=claim_data.deductible_amount,
            copay_amount=claim_data.copay_amount,
            coinsurance_amount=claim_data.coinsurance_amount,
            payer_responsibility=claim_data.payer_responsibility,
            member_responsibility=claim_data.member_responsibility,
        )

        self._validate_status(
            claim_data.claim_status,
        )

        if (
            claim_data.claim_status
            == "DENIED"
            and not claim_data.denial_reason
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "A denial reason is required for denied claims."
                ),
            )

        claim = Claim(
            **claim_data.model_dump(),
        )

        return self.repository.create(
            claim,
        )

    def get_claim(
        self,
        claim_id: UUID,
    ) -> Claim:
        claim = self.repository.get_by_id(
            claim_id,
        )

        if claim is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Claim not found.",
            )

        return claim

    def get_claim_by_number(
        self,
        claim_number: str,
    ) -> Claim:
        claim = (
            self.repository.get_by_claim_number(
                claim_number,
            )
        )

        if claim is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Claim not found.",
            )

        return claim

    def list_claims(
        self,
    ) -> list[Claim]:
        return self.repository.get_all()

    def update_claim(
        self,
        claim_id: UUID,
        claim_data: ClaimUpdate,
    ) -> Claim:
        claim = self.get_claim(
            claim_id,
        )

        update_data = (
            claim_data.model_dump(
                exclude_unset=True,
            )
        )

        new_status = update_data.get(
            "claim_status",
        )

        if new_status is not None:
            self._validate_status_transition(
                current_status=claim.claim_status,
                new_status=new_status,
            )

            update_data[
                "claim_status"
            ] = new_status

        for field, value in update_data.items():
            setattr(
                claim,
                field,
                value,
            )

        self._validate_claim_amounts(
            billed_amount=claim.billed_amount,
            allowed_amount=claim.allowed_amount,
            deductible_amount=claim.deductible_amount,
            copay_amount=claim.copay_amount,
            coinsurance_amount=claim.coinsurance_amount,
            payer_responsibility=claim.payer_responsibility,
            member_responsibility=claim.member_responsibility,
        )

        if (
            claim.claim_status.upper()
            == "DENIED"
            and not claim.denial_reason
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "A denial reason is required for denied claims."
                ),
            )

        return self.repository.update(
            claim,
        )

    def delete_claim(
        self,
        claim_id: UUID,
    ) -> None:
        claim = self.get_claim(
            claim_id,
        )

        self.repository.delete(
            claim,
        )

    def _validate_related_records(
        self,
        member_id: UUID,
        provider_id: UUID,
        enrollment_id: UUID,
    ) -> None:
        member = self.db.scalar(
            select(Member).where(
                Member.id == member_id,
            ),
        )

        if member is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Member not found.",
            )

        provider = self.db.scalar(
            select(Provider).where(
                Provider.id == provider_id,
            ),
        )

        if provider is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Provider not found.",
            )

        enrollment = self.db.scalar(
            select(Enrollment).where(
                Enrollment.id
                == enrollment_id,
            ),
        )

        if enrollment is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Enrollment not found.",
            )

        if (
            enrollment.member_id
            != member_id
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "The enrollment does not belong "
                    "to the selected member."
                ),
            )

    @staticmethod
    def _validate_claim_amounts(
        billed_amount: Decimal,
        allowed_amount: Decimal | None,
        deductible_amount: Decimal,
        copay_amount: Decimal,
        coinsurance_amount: Decimal,
        payer_responsibility: Decimal | None,
        member_responsibility: Decimal | None,
    ) -> None:
        if (
            allowed_amount is not None
            and allowed_amount
            > billed_amount
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "Allowed amount cannot exceed "
                    "the billed amount."
                ),
            )

        calculated_member_responsibility = (
            deductible_amount
            + copay_amount
            + coinsurance_amount
        )

        if (
            member_responsibility is not None
            and member_responsibility
            != calculated_member_responsibility
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "Member responsibility must equal "
                    "the sum of deductible, copay, "
                    "and coinsurance amounts."
                ),
            )

        if (
            allowed_amount is not None
            and payer_responsibility
            is not None
            and member_responsibility
            is not None
            and (
                payer_responsibility
                + member_responsibility
                != allowed_amount
            )
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "Payer responsibility and member "
                    "responsibility must equal the "
                    "allowed amount."
                ),
            )

    def _validate_status_transition(
        self,
        current_status: str,
        new_status: str,
    ) -> None:
        current_status = (
            current_status
            .strip()
            .upper()
            .replace(" ", "_")
        )

        new_status = (
            new_status
            .strip()
            .upper()
            .replace(" ", "_")
        )

        self._validate_status(
            new_status,
        )

        if current_status == new_status:
            return

        permitted_statuses = (
            self.STATUS_TRANSITIONS.get(
                current_status,
                set(),
            )
        )

        if (
            new_status
            not in permitted_statuses
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "Claim cannot transition from "
                    f"{current_status} to {new_status}."
                ),
            )

    def _validate_status(
        self,
        claim_status: str,
    ) -> None:
        normalized_status = (
            claim_status
            .strip()
            .upper()
            .replace(" ", "_")
        )

        if (
            normalized_status
            not in self.ALLOWED_STATUSES
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "Unsupported claim status: "
                    f"{normalized_status}."
                ),
            )