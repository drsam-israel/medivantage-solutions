from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.fraud_alert import FraudAlert


class FraudAlertRepository:
    @staticmethod
    def create(
        db: Session,
        fraud_alert: FraudAlert,
    ) -> FraudAlert:
        db.add(fraud_alert)
        db.commit()
        db.refresh(fraud_alert)

        return fraud_alert


    @staticmethod
    def get_by_id(
        db: Session,
        fraud_alert_id: UUID,
    ) -> FraudAlert | None:
        statement = select(
            FraudAlert,
        ).where(
            FraudAlert.id == fraud_alert_id,
        )

        return db.scalar(statement)


    @staticmethod
    def get_by_number(
        db: Session,
        alert_number: str,
    ) -> FraudAlert | None:
        statement = select(
            FraudAlert,
        ).where(
            FraudAlert.alert_number
            == alert_number,
        )

        return db.scalar(statement)


    @staticmethod
    def list(
        db: Session,
        *,
        skip: int = 0,
        limit: int = 100,
        fraud_case_id: UUID | None = None,
        source: str | None = None,
        risk_level: str | None = None,
        status: str | None = None,
    ) -> list[FraudAlert]:
        statement = select(
            FraudAlert,
        )

        if fraud_case_id is not None:
            statement = statement.where(
                FraudAlert.fraud_case_id
                == fraud_case_id,
            )

        if source is not None:
            statement = statement.where(
                FraudAlert.source == source,
            )

        if risk_level is not None:
            statement = statement.where(
                FraudAlert.risk_level
                == risk_level,
            )

        if status is not None:
            statement = statement.where(
                FraudAlert.status == status,
            )

        statement = (
            statement
            .order_by(
                FraudAlert.created_at.desc(),
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
        fraud_alert: FraudAlert,
    ) -> FraudAlert:
        db.add(fraud_alert)
        db.commit()
        db.refresh(fraud_alert)

        return fraud_alert


    @staticmethod
    def delete(
        db: Session,
        fraud_alert: FraudAlert,
    ) -> None:
        db.delete(fraud_alert)
        db.commit()