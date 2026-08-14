from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.fraud_recovery import FraudRecovery


class FraudRecoveryRepository:
    @staticmethod
    def create(
        db: Session,
        recovery: FraudRecovery,
    ) -> FraudRecovery:
        db.add(recovery)
        db.commit()
        db.refresh(recovery)

        return recovery

    @staticmethod
    def get_by_id(
        db: Session,
        recovery_id: UUID,
    ) -> FraudRecovery | None:
        statement = select(
            FraudRecovery,
        ).where(
            FraudRecovery.id == recovery_id,
        )

        return db.scalar(statement)

    @staticmethod
    def get_by_number(
        db: Session,
        recovery_number: str,
    ) -> FraudRecovery | None:
        statement = select(
            FraudRecovery,
        ).where(
            FraudRecovery.recovery_number
            == recovery_number,
        )

        return db.scalar(statement)

    @staticmethod
    def list(
        db: Session,
        *,
        skip: int = 0,
        limit: int = 100,
        fraud_case_id: UUID | None = None,
        recovery_type: str | None = None,
        recovery_status: str | None = None,
        recovery_owner: str | None = None,
    ) -> list[FraudRecovery]:
        statement = select(
            FraudRecovery,
        )

        if fraud_case_id is not None:
            statement = statement.where(
                FraudRecovery.fraud_case_id
                == fraud_case_id,
            )

        if recovery_type is not None:
            statement = statement.where(
                FraudRecovery.recovery_type
                == recovery_type,
            )

        if recovery_status is not None:
            statement = statement.where(
                FraudRecovery.recovery_status
                == recovery_status,
            )

        if recovery_owner is not None:
            statement = statement.where(
                FraudRecovery.recovery_owner
                == recovery_owner,
            )

        statement = (
            statement
            .order_by(
                FraudRecovery.created_at.desc(),
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
        recovery: FraudRecovery,
    ) -> FraudRecovery:
        db.add(recovery)
        db.commit()
        db.refresh(recovery)

        return recovery

    @staticmethod
    def delete(
        db: Session,
        recovery: FraudRecovery,
    ) -> None:
        db.delete(recovery)
        db.commit()