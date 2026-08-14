from datetime import date
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.fraud_action import FraudAction
from app.repositories.fraud_action import (
    FraudActionRepository,
)
from app.repositories.fraud_case import (
    FraudCaseRepository,
)
from app.schemas.fraud_action import (
    FraudActionCreate,
    FraudActionUpdate,
)


class FraudActionService:
    ALLOWED_PRIORITIES = {
        "LOW",
        "MEDIUM",
        "HIGH",
        "CRITICAL",
    }

    ALLOWED_STATUSES = {
        "PROPOSED",
        "APPROVED",
        "IN_PROGRESS",
        "COMPLETED",
        "REJECTED",
        "CANCELLED",
    }

    @staticmethod
    def create_action(
        db: Session,
        action_data: FraudActionCreate,
    ) -> FraudAction:
        existing = (
            FraudActionRepository
            .get_by_number(
                db,
                action_data.action_number,
            )
        )

        if existing is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    "Fraud action number already exists."
                ),
            )

        fraud_case = (
            FraudCaseRepository
            .get_by_id(
                db,
                action_data.fraud_case_id,
            )
        )

        if fraud_case is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=(
                    "Parent fraud investigation case not found."
                ),
            )

        action = FraudAction(
            **action_data.model_dump()
        )

        FraudActionService._validate_action(
            action,
        )

        if (
            action.status == "COMPLETED"
            and action.completed_date is None
        ):
            action.completed_date = date.today()

        return FraudActionRepository.create(
            db,
            action,
        )

    @staticmethod
    def get_action(
        db: Session,
        action_id: UUID,
    ) -> FraudAction:
        action = (
            FraudActionRepository
            .get_by_id(
                db,
                action_id,
            )
        )

        if action is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Fraud action not found.",
            )

        return action

    @staticmethod
    def get_action_by_number(
        db: Session,
        action_number: str,
    ) -> FraudAction:
        action = (
            FraudActionRepository
            .get_by_number(
                db,
                action_number,
            )
        )

        if action is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Fraud action not found.",
            )

        return action

    @staticmethod
    def list_actions(
        db: Session,
        *,
        skip: int = 0,
        limit: int = 100,
        fraud_case_id: UUID | None = None,
        action_type: str | None = None,
        owner: str | None = None,
        priority: str | None = None,
        status_filter: str | None = None,
    ) -> list[FraudAction]:
        return FraudActionRepository.list(
            db,
            skip=skip,
            limit=limit,
            fraud_case_id=fraud_case_id,
            action_type=action_type,
            owner=owner,
            priority=priority,
            status=status_filter,
        )

    @staticmethod
    def update_action(
        db: Session,
        action_id: UUID,
        action_data: FraudActionUpdate,
    ) -> FraudAction:
        action = (
            FraudActionService
            .get_action(
                db,
                action_id,
            )
        )

        updates = action_data.model_dump(
            exclude_unset=True,
        )

        for field, value in updates.items():
            setattr(
                action,
                field,
                value,
            )

        FraudActionService._validate_action(
            action,
        )

        if (
            action.status == "COMPLETED"
            and action.completed_date is None
        ):
            action.completed_date = date.today()

        if (
            action.status != "COMPLETED"
            and action.completed_date is not None
        ):
            action.completed_date = None

        return FraudActionRepository.save(
            db,
            action,
        )

    @staticmethod
    def delete_action(
        db: Session,
        action_id: UUID,
    ) -> None:
        action = (
            FraudActionService
            .get_action(
                db,
                action_id,
            )
        )

        FraudActionRepository.delete(
            db,
            action,
        )

    @staticmethod
    def _validate_action(
        action: FraudAction,
    ) -> None:
        priority = (
            action.priority
            .strip()
            .upper()
        )

        action_status = (
            action.status
            .strip()
            .upper()
        )

        if (
            priority
            not in FraudActionService.ALLOWED_PRIORITIES
        ):
            raise HTTPException(
                status_code=(
                    status.HTTP_422_UNPROCESSABLE_ENTITY
                ),
                detail="Invalid fraud action priority.",
            )

        if (
            action_status
            not in FraudActionService.ALLOWED_STATUSES
        ):
            raise HTTPException(
                status_code=(
                    status.HTTP_422_UNPROCESSABLE_ENTITY
                ),
                detail="Invalid fraud action status.",
            )

        action.priority = priority
        action.status = action_status

        if not action.action_type.strip():
            raise HTTPException(
                status_code=(
                    status.HTTP_422_UNPROCESSABLE_ENTITY
                ),
                detail="Fraud action type is required.",
            )

        if not action.action_description.strip():
            raise HTTPException(
                status_code=(
                    status.HTTP_422_UNPROCESSABLE_ENTITY
                ),
                detail=(
                    "Fraud action description is required."
                ),
            )

        if not action.owner.strip():
            raise HTTPException(
                status_code=(
                    status.HTTP_422_UNPROCESSABLE_ENTITY
                ),
                detail="Fraud action owner is required.",
            )

        if action.estimated_recovery < 0:
            raise HTTPException(
                status_code=(
                    status.HTTP_422_UNPROCESSABLE_ENTITY
                ),
                detail=(
                    "Estimated recovery cannot be negative."
                ),
            )