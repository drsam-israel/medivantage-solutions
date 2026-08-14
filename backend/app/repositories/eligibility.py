from datetime import date
from uuid import UUID

from sqlalchemy import or_, select
from sqlalchemy.orm import Session, joinedload

from app.models.enrollment import Enrollment


class EligibilityRepository:
    """
    Data-access operations required for eligibility verification.
    """

    @staticmethod
    def get_member_enrollment_for_service_date(
        db: Session,
        member_id: UUID,
        service_date: date,
    ) -> Enrollment | None:
        """
        Return the member's most relevant enrollment for the
        requested service date.
        """

        statement = (
            select(Enrollment)
            .options(
                joinedload(Enrollment.member),
                joinedload(Enrollment.health_plan),
                joinedload(Enrollment.subscriber),
            )
            .where(
                Enrollment.member_id == member_id,
                Enrollment.coverage_start_date <= service_date,
                or_(
                    Enrollment.coverage_end_date.is_(None),
                    Enrollment.coverage_end_date >= service_date,
                ),
            )
            .order_by(
                Enrollment.is_active.desc(),
                Enrollment.coverage_start_date.desc(),
                Enrollment.created_at.desc(),
            )
            .limit(1)
        )

        return db.scalar(statement)

    @staticmethod
    def get_latest_member_enrollment(
        db: Session,
        member_id: UUID,
    ) -> Enrollment | None:
        """
        Return the member's latest enrollment regardless of coverage date.
        """

        statement = (
            select(Enrollment)
            .options(
                joinedload(Enrollment.member),
                joinedload(Enrollment.health_plan),
                joinedload(Enrollment.subscriber),
            )
            .where(
                Enrollment.member_id == member_id,
            )
            .order_by(
                Enrollment.coverage_start_date.desc(),
                Enrollment.created_at.desc(),
            )
            .limit(1)
        )

        return db.scalar(statement)