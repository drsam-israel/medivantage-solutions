from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.fraud_evidence import FraudEvidence
from app.repositories.fraud_case import (
    FraudCaseRepository,
)
from app.repositories.fraud_evidence import (
    FraudEvidenceRepository,
)
from app.schemas.fraud_evidence import (
    FraudEvidenceCreate,
    FraudEvidenceUpdate,
)


class FraudEvidenceService:
    ALLOWED_STATUSES = {
        "PENDING_REVIEW",
        "VERIFIED",
        "REJECTED",
        "ARCHIVED",
    }


    @staticmethod
    def create_evidence(
        db: Session,
        evidence_data: FraudEvidenceCreate,
    ) -> FraudEvidence:
        existing = (
            FraudEvidenceRepository
            .get_by_number(
                db,
                evidence_data.evidence_number,
            )
        )

        if existing is not None:
            raise HTTPException(
                status_code=(
                    status.HTTP_409_CONFLICT
                ),
                detail=(
                    "Fraud evidence number already exists."
                ),
            )

        fraud_case = (
            FraudCaseRepository
            .get_by_id(
                db,
                evidence_data.fraud_case_id,
            )
        )

        if fraud_case is None:
            raise HTTPException(
                status_code=(
                    status.HTTP_404_NOT_FOUND
                ),
                detail=(
                    "Parent fraud investigation case not found."
                ),
            )

        evidence = FraudEvidence(
            **evidence_data.model_dump()
        )

        FraudEvidenceService._validate_evidence(
            evidence,
        )

        return FraudEvidenceRepository.create(
            db,
            evidence,
        )


    @staticmethod
    def get_evidence(
        db: Session,
        evidence_id: UUID,
    ) -> FraudEvidence:
        evidence = (
            FraudEvidenceRepository
            .get_by_id(
                db,
                evidence_id,
            )
        )

        if evidence is None:
            raise HTTPException(
                status_code=(
                    status.HTTP_404_NOT_FOUND
                ),
                detail=(
                    "Fraud evidence record not found."
                ),
            )

        return evidence


    @staticmethod
    def get_evidence_by_number(
        db: Session,
        evidence_number: str,
    ) -> FraudEvidence:
        evidence = (
            FraudEvidenceRepository
            .get_by_number(
                db,
                evidence_number,
            )
        )

        if evidence is None:
            raise HTTPException(
                status_code=(
                    status.HTTP_404_NOT_FOUND
                ),
                detail=(
                    "Fraud evidence record not found."
                ),
            )

        return evidence


    @staticmethod
    def list_evidence(
        db: Session,
        *,
        skip: int = 0,
        limit: int = 100,
        fraud_case_id: UUID | None = None,
        evidence_type: str | None = None,
        status_filter: str | None = None,
        uploaded_by: str | None = None,
    ) -> list[FraudEvidence]:
        return FraudEvidenceRepository.list(
            db,
            skip=skip,
            limit=limit,
            fraud_case_id=fraud_case_id,
            evidence_type=evidence_type,
            status=status_filter,
            uploaded_by=uploaded_by,
        )


    @staticmethod
    def update_evidence(
        db: Session,
        evidence_id: UUID,
        evidence_data: FraudEvidenceUpdate,
    ) -> FraudEvidence:
        evidence = (
            FraudEvidenceService
            .get_evidence(
                db,
                evidence_id,
            )
        )

        updates = (
            evidence_data.model_dump(
                exclude_unset=True,
            )
        )

        for field, value in updates.items():
            setattr(
                evidence,
                field,
                value,
            )

        FraudEvidenceService._validate_evidence(
            evidence,
        )

        return FraudEvidenceRepository.save(
            db,
            evidence,
        )


    @staticmethod
    def delete_evidence(
        db: Session,
        evidence_id: UUID,
    ) -> None:
        evidence = (
            FraudEvidenceService
            .get_evidence(
                db,
                evidence_id,
            )
        )

        FraudEvidenceRepository.delete(
            db,
            evidence,
        )


    @staticmethod
    def _validate_evidence(
        evidence: FraudEvidence,
    ) -> None:
        evidence_status = (
            evidence.status
            .strip()
            .upper()
        )

        if (
            evidence_status
            not in FraudEvidenceService
            .ALLOWED_STATUSES
        ):
            raise HTTPException(
                status_code=(
                    status
                    .HTTP_422_UNPROCESSABLE_ENTITY
                ),
                detail=(
                    "Invalid fraud evidence status."
                ),
            )

        evidence.status = (
            evidence_status
        )

        if not evidence.evidence_type.strip():
            raise HTTPException(
                status_code=(
                    status
                    .HTTP_422_UNPROCESSABLE_ENTITY
                ),
                detail=(
                    "Evidence type is required."
                ),
            )

        if not evidence.title.strip():
            raise HTTPException(
                status_code=(
                    status
                    .HTTP_422_UNPROCESSABLE_ENTITY
                ),
                detail=(
                    "Evidence title is required."
                ),
            )