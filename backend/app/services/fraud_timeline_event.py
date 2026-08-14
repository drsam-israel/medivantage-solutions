from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.fraud_timeline_event import (
    FraudTimelineEvent,
)
from app.repositories.fraud_case import (
    FraudCaseRepository,
)
from app.repositories.fraud_timeline_event import (
    FraudTimelineEventRepository,
)
from app.schemas.fraud_timeline_event import (
    FraudTimelineEventCreate,
    FraudTimelineEventUpdate,
)


class FraudTimelineEventService:
    ALLOWED_STATUSES = {
        "COMPLETED",
        "PENDING",
        "WARNING",
        "ESCALATED",
    }

    @staticmethod
    def create_event(
        db: Session,
        event_data: FraudTimelineEventCreate,
    ) -> FraudTimelineEvent:
        existing = (
            FraudTimelineEventRepository
            .get_by_number(
                db,
                event_data.event_number,
            )
        )

        if existing is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    "Fraud timeline event number already exists."
                ),
            )

        fraud_case = (
            FraudCaseRepository
            .get_by_id(
                db,
                event_data.fraud_case_id,
            )
        )

        if fraud_case is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=(
                    "Parent fraud investigation case not found."
                ),
            )

        event = FraudTimelineEvent(
            **event_data.model_dump()
        )

        FraudTimelineEventService._validate_event(
            event,
        )

        return (
            FraudTimelineEventRepository
            .create(
                db,
                event,
            )
        )

    @staticmethod
    def get_event(
        db: Session,
        event_id: UUID,
    ) -> FraudTimelineEvent:
        event = (
            FraudTimelineEventRepository
            .get_by_id(
                db,
                event_id,
            )
        )

        if event is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=(
                    "Fraud timeline event not found."
                ),
            )

        return event

    @staticmethod
    def get_event_by_number(
        db: Session,
        event_number: str,
    ) -> FraudTimelineEvent:
        event = (
            FraudTimelineEventRepository
            .get_by_number(
                db,
                event_number,
            )
        )

        if event is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=(
                    "Fraud timeline event not found."
                ),
            )

        return event

    @staticmethod
    def list_events(
        db: Session,
        *,
        skip: int = 0,
        limit: int = 100,
        fraud_case_id: UUID | None = None,
        event_type: str | None = None,
        performed_by: str | None = None,
        status_filter: str | None = None,
    ) -> list[FraudTimelineEvent]:
        return (
            FraudTimelineEventRepository
            .list(
                db,
                skip=skip,
                limit=limit,
                fraud_case_id=fraud_case_id,
                event_type=event_type,
                performed_by=performed_by,
                status=status_filter,
            )
        )

    @staticmethod
    def update_event(
        db: Session,
        event_id: UUID,
        event_data: FraudTimelineEventUpdate,
    ) -> FraudTimelineEvent:
        event = (
            FraudTimelineEventService
            .get_event(
                db,
                event_id,
            )
        )

        updates = event_data.model_dump(
            exclude_unset=True,
        )

        for field, value in updates.items():
            setattr(
                event,
                field,
                value,
            )

        FraudTimelineEventService._validate_event(
            event,
        )

        return (
            FraudTimelineEventRepository
            .save(
                db,
                event,
            )
        )

    @staticmethod
    def delete_event(
        db: Session,
        event_id: UUID,
    ) -> None:
        event = (
            FraudTimelineEventService
            .get_event(
                db,
                event_id,
            )
        )

        FraudTimelineEventRepository.delete(
            db,
            event,
        )

    @staticmethod
    def _validate_event(
        event: FraudTimelineEvent,
    ) -> None:
        event_status = (
            event.status
            .strip()
            .upper()
        )

        if (
            event_status
            not in FraudTimelineEventService
            .ALLOWED_STATUSES
        ):
            raise HTTPException(
                status_code=(
                    status.HTTP_422_UNPROCESSABLE_ENTITY
                ),
                detail=(
                    "Invalid fraud timeline event status."
                ),
            )

        event.status = event_status

        if not event.event_type.strip():
            raise HTTPException(
                status_code=(
                    status.HTTP_422_UNPROCESSABLE_ENTITY
                ),
                detail=(
                    "Fraud timeline event type is required."
                ),
            )

        if not event.title.strip():
            raise HTTPException(
                status_code=(
                    status.HTTP_422_UNPROCESSABLE_ENTITY
                ),
                detail=(
                    "Fraud timeline event title is required."
                ),
            )

        if not event.performed_by.strip():
            raise HTTPException(
                status_code=(
                    status.HTTP_422_UNPROCESSABLE_ENTITY
                ),
                detail=(
                    "Fraud timeline event performer is required."
                ),
            )