from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.prior_authorization import PriorAuthorization


class PriorAuthorizationRepository:
    @staticmethod
    def create(
        db: Session,
        authorization: PriorAuthorization,
    ) -> PriorAuthorization:
        db.add(authorization)
        db.commit()
        db.refresh(authorization)
        return authorization

    @staticmethod
    def get_by_id(
        db: Session,
        authorization_id: UUID,
    ) -> PriorAuthorization | None:
        statement = select(PriorAuthorization).where(
            PriorAuthorization.id == authorization_id
        )
        return db.scalar(statement)

    @staticmethod
    def get_by_number(
        db: Session,
        authorization_number: str,
    ) -> PriorAuthorization | None:
        statement = select(PriorAuthorization).where(
            PriorAuthorization.authorization_number
            == authorization_number
        )
        return db.scalar(statement)

    @staticmethod
    def list(
        db: Session,
        *,
        skip: int = 0,
        limit: int = 100,
        member_id: UUID | None = None,
        provider_id: UUID | None = None,
        status: str | None = None,
        priority: str | None = None,
    ) -> list[PriorAuthorization]:
        statement = select(PriorAuthorization)

        if member_id is not None:
            statement = statement.where(
                PriorAuthorization.member_id == member_id
            )

        if provider_id is not None:
            statement = statement.where(
                PriorAuthorization.provider_id == provider_id
            )

        if status is not None:
            statement = statement.where(
                PriorAuthorization.status == status
            )

        if priority is not None:
            statement = statement.where(
                PriorAuthorization.priority == priority
            )

        statement = (
            statement
            .order_by(PriorAuthorization.created_at.desc())
            .offset(skip)
            .limit(limit)
        )

        return list(db.scalars(statement).all())

    @staticmethod
    def save(
        db: Session,
        authorization: PriorAuthorization,
    ) -> PriorAuthorization:
        db.add(authorization)
        db.commit()
        db.refresh(authorization)
        return authorization

    @staticmethod
    def delete(
        db: Session,
        authorization: PriorAuthorization,
    ) -> None:
        db.delete(authorization)
        db.commit()