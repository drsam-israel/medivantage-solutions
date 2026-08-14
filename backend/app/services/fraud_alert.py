from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.fraud_alert import FraudAlert
from app.repositories.fraud_alert import (
    FraudAlertRepository,
)
from app.repositories.fraud_case import (
    FraudCaseRepository,
)
from app.schemas.fraud_alert import (
    FraudAlertCreate,
    FraudAlertUpdate,
)


class FraudAlertService:
    ALLOWED_RISK_LEVELS = {
        "LOW",
        "MEDIUM",
        "HIGH",
        "CRITICAL",
    }

    ALLOWED_STATUSES = {
        "NEW",
        "REVIEWED",
        "ESCALATED",
        "DISMISSED",
        "CLOSED",
    }


    @staticmethod
    def create_alert(
        db: Session,
        alert_data: FraudAlertCreate,
    ) -> FraudAlert:
        existing = (
            FraudAlertRepository
            .get_by_number(
                db,
                alert_data.alert_number,
            )
        )

        if existing is not None:
            raise HTTPException(
                status_code=(
                    status.HTTP_409_CONFLICT
                ),
                detail=(
                    "Fraud alert number already exists."
                ),
            )

        fraud_case = (
            FraudCaseRepository
            .get_by_id(
                db,
                alert_data.fraud_case_id,
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

        fraud_alert = FraudAlert(
            **alert_data.model_dump()
        )

        FraudAlertService._validate_alert(
            fraud_alert,
        )

        return FraudAlertRepository.create(
            db,
            fraud_alert,
        )


    @staticmethod
    def get_alert(
        db: Session,
        fraud_alert_id: UUID,
    ) -> FraudAlert:
        fraud_alert = (
            FraudAlertRepository
            .get_by_id(
                db,
                fraud_alert_id,
            )
        )

        if fraud_alert is None:
            raise HTTPException(
                status_code=(
                    status.HTTP_404_NOT_FOUND
                ),
                detail=(
                    "Fraud alert not found."
                ),
            )

        return fraud_alert


    @staticmethod
    def get_alert_by_number(
        db: Session,
        alert_number: str,
    ) -> FraudAlert:
        fraud_alert = (
            FraudAlertRepository
            .get_by_number(
                db,
                alert_number,
            )
        )

        if fraud_alert is None:
            raise HTTPException(
                status_code=(
                    status.HTTP_404_NOT_FOUND
                ),
                detail=(
                    "Fraud alert not found."
                ),
            )

        return fraud_alert


    @staticmethod
    def list_alerts(
        db: Session,
        *,
        skip: int = 0,
        limit: int = 100,
        fraud_case_id: UUID | None = None,
        source: str | None = None,
        risk_level: str | None = None,
        status_filter: str | None = None,
    ) -> list[FraudAlert]:
        return FraudAlertRepository.list(
            db,
            skip=skip,
            limit=limit,
            fraud_case_id=fraud_case_id,
            source=source,
            risk_level=risk_level,
            status=status_filter,
        )


    @staticmethod
    def update_alert(
        db: Session,
        fraud_alert_id: UUID,
        alert_data: FraudAlertUpdate,
    ) -> FraudAlert:
        fraud_alert = (
            FraudAlertService
            .get_alert(
                db,
                fraud_alert_id,
            )
        )

        updates = (
            alert_data.model_dump(
                exclude_unset=True,
            )
        )

        for field, value in updates.items():
            setattr(
                fraud_alert,
                field,
                value,
            )

        FraudAlertService._validate_alert(
            fraud_alert,
        )

        return FraudAlertRepository.save(
            db,
            fraud_alert,
        )


    @staticmethod
    def delete_alert(
        db: Session,
        fraud_alert_id: UUID,
    ) -> None:
        fraud_alert = (
            FraudAlertService
            .get_alert(
                db,
                fraud_alert_id,
            )
        )

        FraudAlertRepository.delete(
            db,
            fraud_alert,
        )


    @staticmethod
    def _validate_alert(
        fraud_alert: FraudAlert,
    ) -> None:
        risk_level = (
            fraud_alert.risk_level
            .strip()
            .upper()
        )

        alert_status = (
            fraud_alert.status
            .strip()
            .upper()
        )

        if (
            risk_level
            not in FraudAlertService
            .ALLOWED_RISK_LEVELS
        ):
            raise HTTPException(
                status_code=(
                    status
                    .HTTP_422_UNPROCESSABLE_ENTITY
                ),
                detail=(
                    "Invalid fraud alert risk level."
                ),
            )

        if (
            alert_status
            not in FraudAlertService
            .ALLOWED_STATUSES
        ):
            raise HTTPException(
                status_code=(
                    status
                    .HTTP_422_UNPROCESSABLE_ENTITY
                ),
                detail=(
                    "Invalid fraud alert status."
                ),
            )

        fraud_alert.risk_level = (
            risk_level
        )

        fraud_alert.status = (
            alert_status
        )

        if (
            fraud_alert.confidence_score
            is not None
            and (
                fraud_alert.confidence_score < 0
                or fraud_alert.confidence_score > 100
            )
        ):
            raise HTTPException(
                status_code=(
                    status
                    .HTTP_422_UNPROCESSABLE_ENTITY
                ),
                detail=(
                    "Fraud alert confidence score "
                    "must be between 0 and 100."
                ),
            )