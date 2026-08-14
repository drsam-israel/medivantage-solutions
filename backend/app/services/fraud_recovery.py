from datetime import date
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.fraud_recovery import FraudRecovery
from app.repositories.fraud_case import (
    FraudCaseRepository,
)
from app.repositories.fraud_recovery import (
    FraudRecoveryRepository,
)
from app.schemas.fraud_recovery import (
    FraudRecoveryCreate,
    FraudRecoveryUpdate,
)


class FraudRecoveryService:
    ALLOWED_STATUSES = {
        "IDENTIFIED",
        "APPROVED",
        "IN_PROGRESS",
        "PARTIALLY_RECOVERED",
        "RECOVERED",
        "CANCELLED",
        "WRITTEN_OFF",
    }

    @staticmethod
    def create_recovery(
        db: Session,
        recovery_data: FraudRecoveryCreate,
    ) -> FraudRecovery:
        existing = (
            FraudRecoveryRepository
            .get_by_number(
                db,
                recovery_data.recovery_number,
            )
        )

        if existing is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    "Fraud recovery number already exists."
                ),
            )

        fraud_case = (
            FraudCaseRepository
            .get_by_id(
                db,
                recovery_data.fraud_case_id,
            )
        )

        if fraud_case is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=(
                    "Parent fraud investigation case not found."
                ),
            )

        recovery = FraudRecovery(
            **recovery_data.model_dump()
        )

        FraudRecoveryService._validate_recovery(
            recovery,
        )

        if (
            recovery.recovery_status == "RECOVERED"
            and recovery.recovered_date is None
        ):
            recovery.recovered_date = date.today()

        return FraudRecoveryRepository.create(
            db,
            recovery,
        )

    @staticmethod
    def get_recovery(
        db: Session,
        recovery_id: UUID,
    ) -> FraudRecovery:
        recovery = (
            FraudRecoveryRepository
            .get_by_id(
                db,
                recovery_id,
            )
        )

        if recovery is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Fraud recovery record not found.",
            )

        return recovery

    @staticmethod
    def get_recovery_by_number(
        db: Session,
        recovery_number: str,
    ) -> FraudRecovery:
        recovery = (
            FraudRecoveryRepository
            .get_by_number(
                db,
                recovery_number,
            )
        )

        if recovery is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Fraud recovery record not found.",
            )

        return recovery

    @staticmethod
    def list_recoveries(
        db: Session,
        *,
        skip: int = 0,
        limit: int = 100,
        fraud_case_id: UUID | None = None,
        recovery_type: str | None = None,
        recovery_status: str | None = None,
        recovery_owner: str | None = None,
    ) -> list[FraudRecovery]:
        return FraudRecoveryRepository.list(
            db,
            skip=skip,
            limit=limit,
            fraud_case_id=fraud_case_id,
            recovery_type=recovery_type,
            recovery_status=recovery_status,
            recovery_owner=recovery_owner,
        )

    @staticmethod
    def update_recovery(
        db: Session,
        recovery_id: UUID,
        recovery_data: FraudRecoveryUpdate,
    ) -> FraudRecovery:
        recovery = (
            FraudRecoveryService
            .get_recovery(
                db,
                recovery_id,
            )
        )

        updates = recovery_data.model_dump(
            exclude_unset=True,
        )

        for field, value in updates.items():
            setattr(
                recovery,
                field,
                value,
            )

        FraudRecoveryService._validate_recovery(
            recovery,
        )

        if (
            recovery.recovery_status == "RECOVERED"
            and recovery.recovered_date is None
        ):
            recovery.recovered_date = date.today()

        if (
            recovery.recovery_status != "RECOVERED"
            and recovery.recovered_date is not None
        ):
            recovery.recovered_date = None

        return FraudRecoveryRepository.save(
            db,
            recovery,
        )

    @staticmethod
    def delete_recovery(
        db: Session,
        recovery_id: UUID,
    ) -> None:
        recovery = (
            FraudRecoveryService
            .get_recovery(
                db,
                recovery_id,
            )
        )

        FraudRecoveryRepository.delete(
            db,
            recovery,
        )

    @staticmethod
    def _validate_recovery(
        recovery: FraudRecovery,
    ) -> None:
        recovery_status = (
            recovery.recovery_status
            .strip()
            .upper()
        )

        if (
            recovery_status
            not in FraudRecoveryService.ALLOWED_STATUSES
        ):
            raise HTTPException(
                status_code=(
                    status.HTTP_422_UNPROCESSABLE_ENTITY
                ),
                detail="Invalid fraud recovery status.",
            )

        recovery.recovery_status = recovery_status

        if not recovery.recovery_type.strip():
            raise HTTPException(
                status_code=(
                    status.HTTP_422_UNPROCESSABLE_ENTITY
                ),
                detail="Recovery type is required.",
            )

        if not recovery.recovery_owner.strip():
            raise HTTPException(
                status_code=(
                    status.HTTP_422_UNPROCESSABLE_ENTITY
                ),
                detail="Recovery owner is required.",
            )

        financial_fields = {
            "identified_amount":
                recovery.identified_amount,
            "approved_amount":
                recovery.approved_amount,
            "recovered_amount":
                recovery.recovered_amount,
        }

        for field_name, value in financial_fields.items():
            if value < 0:
                raise HTTPException(
                    status_code=(
                        status.HTTP_422_UNPROCESSABLE_ENTITY
                    ),
                    detail=(
                        f"{field_name} cannot be negative."
                    ),
                )

        if (
            recovery.approved_amount
            > recovery.identified_amount
            and recovery.identified_amount > 0
        ):
            raise HTTPException(
                status_code=(
                    status.HTTP_422_UNPROCESSABLE_ENTITY
                ),
                detail=(
                    "Approved amount cannot exceed "
                    "identified amount."
                ),
            )

        if (
            recovery.recovered_amount
            > recovery.approved_amount
            and recovery.approved_amount > 0
        ):
            raise HTTPException(
                status_code=(
                    status.HTTP_422_UNPROCESSABLE_ENTITY
                ),
                detail=(
                    "Recovered amount cannot exceed "
                    "approved amount."
                ),
            )