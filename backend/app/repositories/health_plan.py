from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.health_plan import HealthPlan
from app.schemas.health_plan import (
    HealthPlanCreate,
    HealthPlanUpdate,
)


class HealthPlanRepository:
    @staticmethod
    def create(
        db: Session,
        plan_data: HealthPlanCreate,
    ) -> HealthPlan:
        health_plan = HealthPlan(**plan_data.model_dump())

        db.add(health_plan)
        db.commit()
        db.refresh(health_plan)

        return health_plan

    @staticmethod
    def get_by_id(
        db: Session,
        plan_id: UUID,
    ) -> HealthPlan | None:
        statement = select(HealthPlan).where(
            HealthPlan.id == plan_id
        )

        return db.scalar(statement)

    @staticmethod
    def get_by_code(
        db: Session,
        plan_code: str,
    ) -> HealthPlan | None:
        statement = select(HealthPlan).where(
            HealthPlan.plan_code == plan_code
        )

        return db.scalar(statement)

    @staticmethod
    def list(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        plan_type: str | None = None,
        coverage_level: str | None = None,
        is_active: bool | None = None,
    ) -> list[HealthPlan]:
        statement = select(HealthPlan)

        if plan_type is not None:
            statement = statement.where(
                HealthPlan.plan_type == plan_type
            )

        if coverage_level is not None:
            statement = statement.where(
                HealthPlan.coverage_level == coverage_level
            )

        if is_active is not None:
            statement = statement.where(
                HealthPlan.is_active == is_active
            )

        statement = (
            statement
            .order_by(HealthPlan.created_at.desc())
            .offset(skip)
            .limit(limit)
        )

        return list(db.scalars(statement).all())

    @staticmethod
    def update(
        db: Session,
        health_plan: HealthPlan,
        plan_data: HealthPlanUpdate,
    ) -> HealthPlan:
        updates = plan_data.model_dump(exclude_unset=True)

        for field, value in updates.items():
            setattr(health_plan, field, value)

        db.commit()
        db.refresh(health_plan)

        return health_plan

    @staticmethod
    def delete(
        db: Session,
        health_plan: HealthPlan,
    ) -> None:
        db.delete(health_plan)
        db.commit()