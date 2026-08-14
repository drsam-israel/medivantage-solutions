from uuid import UUID

from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.schemas.health_plan import (
    HealthPlanCreate,
    HealthPlanResponse,
    HealthPlanUpdate,
)
from app.services.health_plan import HealthPlanService


router = APIRouter(
    prefix="/health-plans",
    tags=["Health Plans"],
)


@router.post(
    "",
    response_model=HealthPlanResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_health_plan(
    plan_data: HealthPlanCreate,
    db: Session = Depends(get_db),
) -> HealthPlanResponse:
    return HealthPlanService.create_health_plan(
        db,
        plan_data,
    )


@router.get(
    "",
    response_model=list[HealthPlanResponse],
)
def list_health_plans(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=500),
    plan_type: str | None = None,
    coverage_level: str | None = None,
    is_active: bool | None = None,
    db: Session = Depends(get_db),
) -> list[HealthPlanResponse]:
    return HealthPlanService.list_health_plans(
        db=db,
        skip=skip,
        limit=limit,
        plan_type=plan_type,
        coverage_level=coverage_level,
        is_active=is_active,
    )


@router.get(
    "/{plan_id}",
    response_model=HealthPlanResponse,
)
def get_health_plan(
    plan_id: UUID,
    db: Session = Depends(get_db),
) -> HealthPlanResponse:
    return HealthPlanService.get_health_plan(
        db,
        plan_id,
    )


@router.put(
    "/{plan_id}",
    response_model=HealthPlanResponse,
)
def update_health_plan(
    plan_id: UUID,
    plan_data: HealthPlanUpdate,
    db: Session = Depends(get_db),
) -> HealthPlanResponse:
    return HealthPlanService.update_health_plan(
        db,
        plan_id,
        plan_data,
    )


@router.delete(
    "/{plan_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_health_plan(
    plan_id: UUID,
    db: Session = Depends(get_db),
) -> Response:
    HealthPlanService.delete_health_plan(
        db,
        plan_id,
    )

    return Response(
        status_code=status.HTTP_204_NO_CONTENT
    )