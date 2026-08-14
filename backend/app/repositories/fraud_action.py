from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.fraud_action import FraudAction


class FraudActionRepository:
    @staticmethod
    def create(
        db: Session,
        action: FraudAction,
    ) -> FraudAction:
        db.add(action)
        db.commit()
        db.refresh(action)

        return action


    @staticmethod
    def get_by_id(
        db: Session,
        action_id: UUID,
    ) -> FraudAction | None:
        statement = select(
            FraudAction,
        ).where(
            FraudAction.id == action_id,
        )

        return db.scalar(statement)


    @staticmethod
    def get_by_number(
        db: Session,
        action_number: str,
    ) -> FraudAction | None:
        statement = select(
            FraudAction,
        ).where(
            FraudAction.action_number
            == action_number,
        )

        return db.scalar(statement)


    @staticmethod
    def list(
        db: Session,
        *,
        skip: int = 0,
        limit: int = 100,
        fraud_case_id: UUID | None = None,
        action_type: str | None = None,
        owner: str | None = None,
        priority: str | None = None,
        status: str | None = None,
    ) -> list[FraudAction]:
        statement = select(
            FraudAction,
        )

        if fraud_case_id is not None:
            statement = statement.where(
                FraudAction.fraud_case_id
                == fraud_case_id,
            )

        if action_type is not None:
            statement = statement.where(
                FraudAction.action_type
                == action_type,
            )

        if owner is not None:
            statement = statement.where(
                FraudAction.owner == owner,
            )

        if priority is not None:
            statement = statement.where(
                FraudAction.priority == priority,
            )

        if status is not None:
            statement = statement.where(
                FraudAction.status == status,
            )

        statement = (
            statement
            .order_by(
                FraudAction.created_at.desc(),
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
        action: FraudAction,
    ) -> FraudAction:
        db.add(action)
        db.commit()
        db.refresh(action)

        return action


    @staticmethod
    def delete(
        db: Session,
        action: FraudAction,
    ) -> None:
        db.delete(action)
        db.commit()