from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.fraud_case import FraudCase


class FraudCaseRepository:
    @staticmethod
    def create(
        db: Session,
        fraud_case: FraudCase,
    ) -> FraudCase:
        db.add(fraud_case)
        db.commit()
        db.refresh(fraud_case)

        return fraud_case


    @staticmethod
    def get_by_id(
        db: Session,
        fraud_case_id: UUID,
    ) -> FraudCase | None:
        statement = select(
            FraudCase,
        ).where(
            FraudCase.id == fraud_case_id,
        )

        return db.scalar(statement)


    @staticmethod
    def get_by_number(
        db: Session,
        case_number: str,
    ) -> FraudCase | None:
        statement = select(
            FraudCase,
        ).where(
            FraudCase.case_number
            == case_number,
        )

        return db.scalar(statement)


    @staticmethod
    def list(
        db: Session,
        *,
        skip: int = 0,
        limit: int = 100,
        status: str | None = None,
        priority: str | None = None,
        risk_level: str | None = None,
        case_type: str | None = None,
        member_id: UUID | None = None,
        provider_id: UUID | None = None,
        assigned_investigator: str | None = None,
    ) -> list[FraudCase]:
        statement = select(
            FraudCase,
        )

        if status is not None:
            statement = statement.where(
                FraudCase.status == status,
            )

        if priority is not None:
            statement = statement.where(
                FraudCase.priority == priority,
            )

        if risk_level is not None:
            statement = statement.where(
                FraudCase.risk_level
                == risk_level,
            )

        if case_type is not None:
            statement = statement.where(
                FraudCase.case_type
                == case_type,
            )

        if member_id is not None:
            statement = statement.where(
                FraudCase.member_id
                == member_id,
            )

        if provider_id is not None:
            statement = statement.where(
                FraudCase.provider_id
                == provider_id,
            )

        if assigned_investigator is not None:
            statement = statement.where(
                FraudCase.assigned_investigator
                == assigned_investigator,
            )

        statement = (
            statement
            .order_by(
                FraudCase.created_at.desc(),
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
        fraud_case: FraudCase,
    ) -> FraudCase:
        db.add(fraud_case)
        db.commit()
        db.refresh(fraud_case)

        return fraud_case


    @staticmethod
    def delete(
        db: Session,
        fraud_case: FraudCase,
    ) -> None:
        db.delete(fraud_case)
        db.commit()