from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.health_plan import HealthPlan
from app.repositories.health_plan import HealthPlanRepository
from app.schemas.health_plan import (
    HealthPlanCreate,
    HealthPlanUpdate,
)


class HealthPlanService:
    @staticmethod
    def create_health_plan(
        db: Session,
        plan_data: HealthPlanCreate,
    ) -> HealthPlan:
        existing_plan = HealthPlanRepository.get_by_code(
            db,
            plan_data.plan_code,
        )

        if existing_plan:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Health plan code already exists.",
            )

        try:
            return HealthPlanRepository.create(
                db,
                plan_data,
            )
        except IntegrityError as exc:
            db.rollback()

            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Health plan conflicts with existing data.",
            ) from exc

    @staticmethod
    def get_health_plan(
        db: Session,
        plan_id: UUID,
    ) -> HealthPlan:
        health_plan = HealthPlanRepository.get_by_id(
            db,
            plan_id,
        )

        if health_plan is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Health plan not found.",
            )

        return health_plan

    @staticmethod
    def list_health_plans(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        plan_type: str | None = None,
        coverage_level: str | None = None,
        is_active: bool | None = None,
    ) -> list[HealthPlan]:
        return HealthPlanRepository.list(
            db=db,
            skip=skip,
            limit=limit,
            plan_type=plan_type,
            coverage_level=coverage_level,
            is_active=is_active,
        )

    @staticmethod
    def update_health_plan(
        db: Session,
        plan_id: UUID,
        plan_data: HealthPlanUpdate,
    ) -> HealthPlan:
        health_plan = HealthPlanService.get_health_plan(
            db,
            plan_id,
        )

        updates = plan_data.model_dump(exclude_unset=True)

        effective_date = updates.get(
            "effective_date",
            health_plan.effective_date,
        )
        expiration_date = updates.get(
            "expiration_date",
            health_plan.expiration_date,
        )

        if (
            expiration_date is not None
            and expiration_date < effective_date
        ):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=(
                    "Expiration date cannot be earlier than "
                    "effective date."
                ),
            )

        try:
            return HealthPlanRepository.update(
                db,
                health_plan,
                plan_data,
            )
        except IntegrityError as exc:
            db.rollback()

            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Health plan update conflicts with existing data.",
            ) from exc

    @staticmethod
    def delete_health_plan(
        db: Session,
        plan_id: UUID,
    ) -> None:
        health_plan = HealthPlanService.get_health_plan(
            db,
            plan_id,
        )

        HealthPlanRepository.delete(
            db,
            health_plan,
        )