from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.fraud_timeline_event import (
    FraudTimelineEvent,
)


class FraudTimelineEventRepository:
    @staticmethod
    def create(
        db: Session,
        event: FraudTimelineEvent,
    ) -> FraudTimelineEvent:
        db.add(event)
        db.commit()
        db.refresh(event)

        return event

    @staticmethod
    def get_by_id(
        db: Session,
        event_id: UUID,
    ) -> FraudTimelineEvent | None:
        statement = select(
            FraudTimelineEvent,
        ).where(
            FraudTimelineEvent.id == event_id,
        )

        return db.scalar(statement)

    @staticmethod
    def get_by_number(
        db: Session,
        event_number: str,
    ) -> FraudTimelineEvent | None:
        statement = select(
            FraudTimelineEvent,
        ).where(
            FraudTimelineEvent.event_number
            == event_number,
        )

        return db.scalar(statement)

    @staticmethod
    def list(
        db: Session,
        *,
        skip: int = 0,
        limit: int = 100,
        fraud_case_id: UUID | None = None,
        event_type: str | None = None,
        performed_by: str | None = None,
        status: str | None = None,
    ) -> list[FraudTimelineEvent]:
        statement = select(
            FraudTimelineEvent,
        )

        if fraud_case_id is not None:
            statement = statement.where(
                FraudTimelineEvent.fraud_case_id
                == fraud_case_id,
            )

        if event_type is not None:
            statement = statement.where(
                FraudTimelineEvent.event_type
                == event_type,
            )

        if performed_by is not None:
            statement = statement.where(
                FraudTimelineEvent.performed_by
                == performed_by,
            )

        if status is not None:
            statement = statement.where(
                FraudTimelineEvent.status
                == status,
            )

        statement = (
            statement
            .order_by(
                FraudTimelineEvent
                .event_timestamp
                .desc(),
            )
            .offset(skip)
            .limit(limit)
        )

        return list(
            db.scalars(
                statement,
            ).all(),
        )

    @staticmethod
    def save(
        db: Session,
        event: FraudTimelineEvent,
    ) -> FraudTimelineEvent:
        db.add(event)
        db.commit()
        db.refresh(event)

        return event

    @staticmethod
    def delete(
        db: Session,
        event: FraudTimelineEvent,
    ) -> None:
        db.delete(event)
        db.commit()