from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.underwriting_application import (
    UnderwritingApplication,
)
from app.schemas.underwriting_application import (
    UnderwritingApplicationCreate,
    UnderwritingApplicationUpdate,
)


class UnderwritingApplicationRepository:
    """Database access for medical underwriting applications."""

    @staticmethod
    def create(
        db: Session,
        application_data: UnderwritingApplicationCreate,
    ) -> UnderwritingApplication:
        application = UnderwritingApplication(
            **application_data.model_dump(),
        )

        db.add(application)
        db.commit()
        db.refresh(application)

        return application

    @staticmethod
    def get_by_id(
        db: Session,
        application_id: UUID,
    ) -> UnderwritingApplication | None:
        return db.get(
            UnderwritingApplication,
            application_id,
        )

    @staticmethod
    def get_by_application_number(
        db: Session,
        application_number: str,
    ) -> UnderwritingApplication | None:
        statement = select(
            UnderwritingApplication,
        ).where(
            UnderwritingApplication.application_number
            == application_number,
        )

        return db.scalar(statement)

    @staticmethod
    def list(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        member_id: UUID | None = None,
        status: str | None = None,
        assigned_underwriter: str | None = None,
    ) -> list[UnderwritingApplication]:
        statement = (
            select(UnderwritingApplication)
            .order_by(
                UnderwritingApplication.submitted_date.desc(),
                UnderwritingApplication.created_at.desc(),
            )
        )

        if member_id is not None:
            statement = statement.where(
                UnderwritingApplication.member_id
                == member_id,
            )

        if status is not None:
            statement = statement.where(
                UnderwritingApplication.status
                == status,
            )

        if assigned_underwriter is not None:
            statement = statement.where(
                UnderwritingApplication.assigned_underwriter
                == assigned_underwriter,
            )

        statement = statement.offset(skip).limit(limit)

        return list(
            db.scalars(statement).all(),
        )

    @staticmethod
    def update(
        db: Session,
        application: UnderwritingApplication,
        application_data: UnderwritingApplicationUpdate,
    ) -> UnderwritingApplication:
        updates = application_data.model_dump(
            exclude_unset=True,
        )

        for field, value in updates.items():
            setattr(
                application,
                field,
                value,
            )

        db.add(application)
        db.commit()
        db.refresh(application)

        return application

    @staticmethod
    def delete(
        db: Session,
        application: UnderwritingApplication,
    ) -> None:
        db.delete(application)
        db.commit()