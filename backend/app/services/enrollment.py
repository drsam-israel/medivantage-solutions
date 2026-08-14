from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.enrollment import Enrollment
from app.repositories.enrollment import (
    EnrollmentRepository,
)
from app.repositories.health_plan import (
    HealthPlanRepository,
)
from app.repositories.member import (
    MemberRepository,
)
from app.schemas.enrollment import (
    EnrollmentCreate,
    EnrollmentUpdate,
)


class EnrollmentService:
    """Business logic for member health-plan enrollments."""

    @staticmethod
    def create_enrollment(
        db: Session,
        enrollment_data: EnrollmentCreate,
    ) -> Enrollment:
        member = MemberRepository.get_by_id(
            db,
            enrollment_data.member_id,
        )

        if member is None:
            raise HTTPException(
                status_code=
                    status.HTTP_404_NOT_FOUND,
                detail="Member not found.",
            )

        health_plan = (
            HealthPlanRepository.get_by_id(
                db,
                enrollment_data.health_plan_id,
            )
        )

        if health_plan is None:
            raise HTTPException(
                status_code=
                    status.HTTP_404_NOT_FOUND,
                detail="Health plan not found.",
            )

        if not health_plan.is_active:
            raise HTTPException(
                status_code=
                    status.HTTP_409_CONFLICT,
                detail=(
                    "Health plan is not active."
                ),
            )

        existing_policy = (
            EnrollmentRepository
            .get_by_policy_number(
                db,
                enrollment_data.policy_number,
            )
        )

        if existing_policy is not None:
            raise HTTPException(
                status_code=
                    status.HTTP_409_CONFLICT,
                detail=(
                    "Policy number already exists."
                ),
            )

        relationship = (
            enrollment_data
            .relationship_to_subscriber
            or "self"
        ).strip().lower()

        subscriber_member_id = (
            enrollment_data
            .subscriber_member_id
        )

        if relationship == "self":
            if (
                subscriber_member_id
                is not None
                and subscriber_member_id
                != enrollment_data.member_id
            ):
                raise HTTPException(
                    status_code=
                        status.HTTP_422_UNPROCESSABLE_CONTENT,
                    detail=(
                        "For self enrollment, "
                        "subscriber member ID must "
                        "match the enrolled member."
                    ),
                )

        else:
            if subscriber_member_id is None:
                raise HTTPException(
                    status_code=
                        status.HTTP_422_UNPROCESSABLE_CONTENT,
                    detail=(
                        "Subscriber member ID is "
                        "required for dependent "
                        "enrollments."
                    ),
                )

            subscriber = (
                MemberRepository.get_by_id(
                    db,
                    subscriber_member_id,
                )
            )

            if subscriber is None:
                raise HTTPException(
                    status_code=
                        status.HTTP_404_NOT_FOUND,
                    detail=(
                        "Subscriber member not found."
                    ),
                )

        if (
            enrollment_data.coverage_end_date
            is not None
            and enrollment_data.coverage_end_date
            < enrollment_data.coverage_start_date
        ):
            raise HTTPException(
                status_code=
                    status.HTTP_422_UNPROCESSABLE_CONTENT,
                detail=(
                    "Coverage end date cannot be "
                    "earlier than coverage start "
                    "date."
                ),
            )

        try:
            return (
                EnrollmentRepository.create(
                    db,
                    enrollment_data,
                )
            )

        except IntegrityError as exc:
            db.rollback()

            raise HTTPException(
                status_code=
                    status.HTTP_409_CONFLICT,
                detail=(
                    "Enrollment conflicts with "
                    "existing data."
                ),
            ) from exc

    @staticmethod
    def get_enrollment(
        db: Session,
        enrollment_id: UUID,
    ) -> Enrollment:
        enrollment = (
            EnrollmentRepository.get_by_id(
                db,
                enrollment_id,
            )
        )

        if enrollment is None:
            raise HTTPException(
                status_code=
                    status.HTTP_404_NOT_FOUND,
                detail="Enrollment not found.",
            )

        return enrollment

    @staticmethod
    def list_enrollments(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        member_id: UUID | None = None,
        health_plan_id: UUID | None = None,
        enrollment_status: str | None = None,
        is_active: bool | None = None,
    ) -> list[Enrollment]:
        normalized_status = (
            enrollment_status
            .strip()
            .lower()
            if enrollment_status
            else None
        )

        return EnrollmentRepository.list(
            db=db,
            skip=skip,
            limit=limit,
            member_id=member_id,
            health_plan_id=health_plan_id,
            enrollment_status=
                normalized_status,
            is_active=is_active,
        )

    @staticmethod
    def update_enrollment(
        db: Session,
        enrollment_id: UUID,
        enrollment_data: EnrollmentUpdate,
    ) -> Enrollment:
        enrollment = (
            EnrollmentService
            .get_enrollment(
                db,
                enrollment_id,
            )
        )

        updates = (
            enrollment_data.model_dump(
                exclude_unset=True,
            )
        )

        if "health_plan_id" in updates:
            health_plan = (
                HealthPlanRepository
                .get_by_id(
                    db,
                    updates[
                        "health_plan_id"
                    ],
                )
            )

            if health_plan is None:
                raise HTTPException(
                    status_code=
                        status.HTTP_404_NOT_FOUND,
                    detail=(
                        "Health plan not found."
                    ),
                )

            if not health_plan.is_active:
                raise HTTPException(
                    status_code=
                        status.HTTP_409_CONFLICT,
                    detail=(
                        "Health plan is not active."
                    ),
                )

        coverage_start_date = (
            updates.get(
                "coverage_start_date",
                enrollment
                .coverage_start_date,
            )
        )

        coverage_end_date = (
            updates.get(
                "coverage_end_date",
                enrollment
                .coverage_end_date,
            )
        )

        if (
            coverage_end_date is not None
            and coverage_end_date
            < coverage_start_date
        ):
            raise HTTPException(
                status_code=
                    status.HTTP_422_UNPROCESSABLE_CONTENT,
                detail=(
                    "Coverage end date cannot be "
                    "earlier than coverage start "
                    "date."
                ),
            )

        relationship = updates.get(
            "relationship_to_subscriber",
            enrollment
            .relationship_to_subscriber,
        )

        normalized_relationship = (
            relationship or "self"
        ).strip().lower()

        subscriber_member_id = (
            updates.get(
                "subscriber_member_id",
                enrollment
                .subscriber_member_id,
            )
        )

        if normalized_relationship == "self":
            if (
                subscriber_member_id
                is not None
                and subscriber_member_id
                != enrollment.member_id
            ):
                raise HTTPException(
                    status_code=
                        status.HTTP_422_UNPROCESSABLE_CONTENT,
                    detail=(
                        "For self enrollment, "
                        "subscriber member ID must "
                        "match the enrolled member."
                    ),
                )

        else:
            if subscriber_member_id is None:
                raise HTTPException(
                    status_code=
                        status.HTTP_422_UNPROCESSABLE_CONTENT,
                    detail=(
                        "Subscriber member ID is "
                        "required for dependent "
                        "enrollments."
                    ),
                )

            subscriber = (
                MemberRepository.get_by_id(
                    db,
                    subscriber_member_id,
                )
            )

            if subscriber is None:
                raise HTTPException(
                    status_code=
                        status.HTTP_404_NOT_FOUND,
                    detail=(
                        "Subscriber member not found."
                    ),
                )

        try:
            return (
                EnrollmentRepository.update(
                    db,
                    enrollment,
                    enrollment_data,
                )
            )

        except IntegrityError as exc:
            db.rollback()

            raise HTTPException(
                status_code=
                    status.HTTP_409_CONFLICT,
                detail=(
                    "Enrollment update conflicts "
                    "with existing data."
                ),
            ) from exc

    @staticmethod
    def delete_enrollment(
        db: Session,
        enrollment_id: UUID,
    ) -> None:
        enrollment = (
            EnrollmentService
            .get_enrollment(
                db,
                enrollment_id,
            )
        )

        EnrollmentRepository.delete(
            db,
            enrollment,
        )