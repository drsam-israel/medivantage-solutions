from datetime import date
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.fraud_case import FraudCase
from app.repositories.fraud_case import (
    FraudCaseRepository,
)
from app.schemas.fraud_case import (
    FraudCaseCreate,
    FraudCaseUpdate,
)


class FraudCaseService:
    ALLOWED_STATUSES = {
        "OPEN",
        "UNDER_REVIEW",
        "ESCALATED",
        "RECOVERY",
        "CLOSED",
        "FALSE_POSITIVE",
    }

    ALLOWED_PRIORITIES = {
        "LOW",
        "MEDIUM",
        "HIGH",
        "CRITICAL",
    }

    ALLOWED_RISK_LEVELS = {
        "LOW",
        "MEDIUM",
        "HIGH",
        "CRITICAL",
    }

    ALLOWED_STAGES = {
        "TRIAGE",
        "INVESTIGATION",
        "EVIDENCE_REVIEW",
        "ESCALATION",
        "RECOVERY",
        "CLOSURE",
    }


    @staticmethod
    def create_case(
        db: Session,
        case_data: FraudCaseCreate,
    ) -> FraudCase:
        existing = (
            FraudCaseRepository
            .get_by_number(
                db,
                case_data.case_number,
            )
        )

        if existing is not None:
            raise HTTPException(
                status_code=(
                    status.HTTP_409_CONFLICT
                ),
                detail=(
                    "Fraud case number already exists."
                ),
            )

        fraud_case = FraudCase(
            **case_data.model_dump()
        )

        FraudCaseService._validate_case(
            fraud_case,
        )

        return FraudCaseRepository.create(
            db,
            fraud_case,
        )


    @staticmethod
    def get_case(
        db: Session,
        fraud_case_id: UUID,
    ) -> FraudCase:
        fraud_case = (
            FraudCaseRepository
            .get_by_id(
                db,
                fraud_case_id,
            )
        )

        if fraud_case is None:
            raise HTTPException(
                status_code=(
                    status.HTTP_404_NOT_FOUND
                ),
                detail=(
                    "Fraud investigation case not found."
                ),
            )

        return fraud_case


    @staticmethod
    def get_case_by_number(
        db: Session,
        case_number: str,
    ) -> FraudCase:
        fraud_case = (
            FraudCaseRepository
            .get_by_number(
                db,
                case_number,
            )
        )

        if fraud_case is None:
            raise HTTPException(
                status_code=(
                    status.HTTP_404_NOT_FOUND
                ),
                detail=(
                    "Fraud investigation case not found."
                ),
            )

        return fraud_case


    @staticmethod
    def list_cases(
        db: Session,
        *,
        skip: int = 0,
        limit: int = 100,
        status_filter: str | None = None,
        priority: str | None = None,
        risk_level: str | None = None,
        case_type: str | None = None,
        member_id: UUID | None = None,
        provider_id: UUID | None = None,
        assigned_investigator: str | None = None,
    ) -> list[FraudCase]:
        return FraudCaseRepository.list(
            db,
            skip=skip,
            limit=limit,
            status=status_filter,
            priority=priority,
            risk_level=risk_level,
            case_type=case_type,
            member_id=member_id,
            provider_id=provider_id,
            assigned_investigator=(
                assigned_investigator
            ),
        )


    @staticmethod
    def update_case(
        db: Session,
        fraud_case_id: UUID,
        case_data: FraudCaseUpdate,
    ) -> FraudCase:
        fraud_case = (
            FraudCaseService
            .get_case(
                db,
                fraud_case_id,
            )
        )

        updates = (
            case_data.model_dump(
                exclude_unset=True,
            )
        )

        for field, value in updates.items():
            setattr(
                fraud_case,
                field,
                value,
            )

        FraudCaseService._validate_case(
            fraud_case,
        )

        if (
            fraud_case.status == "CLOSED"
            and fraud_case.closed_date is None
        ):
            fraud_case.closed_date = (
                date.today()
            )

        if (
            fraud_case.status
            != "CLOSED"
            and fraud_case.closed_date
            is not None
        ):
            fraud_case.closed_date = None

        return FraudCaseRepository.save(
            db,
            fraud_case,
        )


    @staticmethod
    def delete_case(
        db: Session,
        fraud_case_id: UUID,
    ) -> None:
        fraud_case = (
            FraudCaseService
            .get_case(
                db,
                fraud_case_id,
            )
        )

        FraudCaseRepository.delete(
            db,
            fraud_case,
        )


    @staticmethod
    def _validate_case(
        fraud_case: FraudCase,
    ) -> None:
        status_value = (
            fraud_case.status
            .strip()
            .upper()
        )

        priority_value = (
            fraud_case.priority
            .strip()
            .upper()
        )

        risk_value = (
            fraud_case.risk_level
            .strip()
            .upper()
        )

        stage_value = (
            fraud_case
            .investigation_stage
            .strip()
            .upper()
        )

        if (
            status_value
            not in FraudCaseService
            .ALLOWED_STATUSES
        ):
            raise HTTPException(
                status_code=(
                    status
                    .HTTP_422_UNPROCESSABLE_ENTITY
                ),
                detail=(
                    "Invalid fraud case status."
                ),
            )

        if (
            priority_value
            not in FraudCaseService
            .ALLOWED_PRIORITIES
        ):
            raise HTTPException(
                status_code=(
                    status
                    .HTTP_422_UNPROCESSABLE_ENTITY
                ),
                detail=(
                    "Invalid fraud case priority."
                ),
            )

        if (
            risk_value
            not in FraudCaseService
            .ALLOWED_RISK_LEVELS
        ):
            raise HTTPException(
                status_code=(
                    status
                    .HTTP_422_UNPROCESSABLE_ENTITY
                ),
                detail=(
                    "Invalid fraud risk level."
                ),
            )

        if (
            stage_value
            not in FraudCaseService
            .ALLOWED_STAGES
        ):
            raise HTTPException(
                status_code=(
                    status
                    .HTTP_422_UNPROCESSABLE_ENTITY
                ),
                detail=(
                    "Invalid investigation stage."
                ),
            )

        fraud_case.status = (
            status_value
        )

        fraud_case.priority = (
            priority_value
        )

        fraud_case.risk_level = (
            risk_value
        )

        fraud_case.investigation_stage = (
            stage_value
        )

        if (
            fraud_case.ai_confidence
            is not None
            and (
                fraud_case.ai_confidence < 0
                or fraud_case.ai_confidence > 100
            )
        ):
            raise HTTPException(
                status_code=(
                    status
                    .HTTP_422_UNPROCESSABLE_ENTITY
                ),
                detail=(
                    "AI confidence must be between 0 and 100."
                ),
            )

        financial_fields = {
            "suspected_exposure":
                fraud_case.suspected_exposure,
            "validated_exposure":
                fraud_case.validated_exposure,
            "prevented_loss":
                fraud_case.prevented_loss,
            "recovery_potential":
                fraud_case.recovery_potential,
            "recovered_amount":
                fraud_case.recovered_amount,
        }

        for field_name, value in (
            financial_fields.items()
        ):
            if value < 0:
                raise HTTPException(
                    status_code=(
                        status
                        .HTTP_422_UNPROCESSABLE_ENTITY
                    ),
                    detail=(
                        f"{field_name} cannot be negative."
                    ),
                )

        if (
            fraud_case.recovered_amount
            > fraud_case.recovery_potential
            and fraud_case.recovery_potential > 0
        ):
            raise HTTPException(
                status_code=(
                    status
                    .HTTP_422_UNPROCESSABLE_ENTITY
                ),
                detail=(
                    "Recovered amount cannot exceed "
                    "recovery potential."
                ),
            )