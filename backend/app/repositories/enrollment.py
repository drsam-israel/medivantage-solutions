from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.models.enrollment import Enrollment
from app.schemas.enrollment import (
    EnrollmentCreate,
    EnrollmentUpdate,
)


class EnrollmentRepository:
    @staticmethod
    def create(
        db: Session,
        enrollment_data: EnrollmentCreate,
    ) -> Enrollment:
        values = enrollment_data.model_dump()

        if values.get("enrollment_status"):
            values["enrollment_status"] = (
                values["enrollment_status"]
                .strip()
                .lower()
            )

        if values.get("enrollment_type"):
            values["enrollment_type"] = (
                values["enrollment_type"]
                .strip()
                .lower()
            )

        if values.get(
            "relationship_to_subscriber",
        ):
            values[
                "relationship_to_subscriber"
            ] = (
                values[
                    "relationship_to_subscriber"
                ]
                .strip()
                .lower()
            )

        enrollment = Enrollment(
            **values,
        )

        db.add(enrollment)
        db.commit()
        db.refresh(enrollment)

        return enrollment

    @staticmethod
    def get_by_id(
        db: Session,
        enrollment_id: UUID,
    ) -> Enrollment | None:
        statement = (
            select(Enrollment)
            .options(
                joinedload(
                    Enrollment.member,
                ),
                joinedload(
                    Enrollment.health_plan,
                ),
                joinedload(
                    Enrollment.subscriber,
                ),
            )
            .where(
                Enrollment.id
                == enrollment_id,
            )
        )

        return db.scalar(statement)

    @staticmethod
    def get_by_policy_number(
        db: Session,
        policy_number: str,
    ) -> Enrollment | None:
        statement = (
            select(Enrollment)
            .where(
                Enrollment.policy_number
                == policy_number,
            )
        )

        return db.scalar(statement)

    @staticmethod
    def list(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        member_id: UUID | None = None,
        health_plan_id: UUID | None = None,
        enrollment_status: str | None = None,
        is_active: bool | None = None,
    ) -> list[Enrollment]:
        statement = (
            select(Enrollment)
            .options(
                joinedload(
                    Enrollment.member,
                ),
                joinedload(
                    Enrollment.health_plan,
                ),
                joinedload(
                    Enrollment.subscriber,
                ),
            )
        )

        if member_id is not None:
            statement = statement.where(
                Enrollment.member_id
                == member_id,
            )

        if health_plan_id is not None:
            statement = statement.where(
                Enrollment.health_plan_id
                == health_plan_id,
            )

        if enrollment_status is not None:
            normalized_status = (
                enrollment_status
                .strip()
                .lower()
            )

            statement = statement.where(
                Enrollment.enrollment_status
                == normalized_status,
            )

        if is_active is not None:
            statement = statement.where(
                Enrollment.is_active
                == is_active,
            )

        statement = (
            statement
            .order_by(
                Enrollment.created_at.desc(),
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
    def update(
        db: Session,
        enrollment: Enrollment,
        enrollment_data: EnrollmentUpdate,
    ) -> Enrollment:
        updates = (
            enrollment_data.model_dump(
                exclude_unset=True,
            )
        )

        if (
            "enrollment_status" in updates
            and updates[
                "enrollment_status"
            ] is not None
        ):
            updates[
                "enrollment_status"
            ] = (
                updates[
                    "enrollment_status"
                ]
                .strip()
                .lower()
            )

        if (
            "enrollment_type" in updates
            and updates[
                "enrollment_type"
            ] is not None
        ):
            updates[
                "enrollment_type"
            ] = (
                updates[
                    "enrollment_type"
                ]
                .strip()
                .lower()
            )

        if (
            "relationship_to_subscriber"
            in updates
            and updates[
                "relationship_to_subscriber"
            ] is not None
        ):
            updates[
                "relationship_to_subscriber"
            ] = (
                updates[
                    "relationship_to_subscriber"
                ]
                .strip()
                .lower()
            )

        for field, value in updates.items():
            setattr(
                enrollment,
                field,
                value,
            )

        db.add(enrollment)
        db.commit()
        db.refresh(enrollment)

        return enrollment

    @staticmethod
    def delete(
        db: Session,
        enrollment: Enrollment,
    ) -> None:
        db.delete(enrollment)
        db.commit()