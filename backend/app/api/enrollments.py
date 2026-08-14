from uuid import UUID

from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.schemas.enrollment import (
    EnrollmentCreate,
    EnrollmentResponse,
    EnrollmentUpdate,
)
from app.services.enrollment import EnrollmentService


router = APIRouter(
    prefix="/enrollments",
    tags=["Enrollments"],
)


@router.post(
    "",
    response_model=EnrollmentResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_enrollment(
    enrollment_data: EnrollmentCreate,
    db: Session = Depends(get_db),
) -> EnrollmentResponse:
    return EnrollmentService.create_enrollment(
        db,
        enrollment_data,
    )


@router.get(
    "",
    response_model=list[EnrollmentResponse],
)
def list_enrollments(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=500),
    member_id: UUID | None = None,
    health_plan_id: UUID | None = None,
    enrollment_status: str | None = None,
    is_active: bool | None = None,
    db: Session = Depends(get_db),
) -> list[EnrollmentResponse]:
    return EnrollmentService.list_enrollments(
        db=db,
        skip=skip,
        limit=limit,
        member_id=member_id,
        health_plan_id=health_plan_id,
        enrollment_status=enrollment_status,
        is_active=is_active,
    )


@router.get(
    "/{enrollment_id}",
    response_model=EnrollmentResponse,
)
def get_enrollment(
    enrollment_id: UUID,
    db: Session = Depends(get_db),
) -> EnrollmentResponse:
    return EnrollmentService.get_enrollment(
        db,
        enrollment_id,
    )


@router.put(
    "/{enrollment_id}",
    response_model=EnrollmentResponse,
)
def update_enrollment(
    enrollment_id: UUID,
    enrollment_data: EnrollmentUpdate,
    db: Session = Depends(get_db),
) -> EnrollmentResponse:
    return EnrollmentService.update_enrollment(
        db,
        enrollment_id,
        enrollment_data,
    )


@router.delete(
    "/{enrollment_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_enrollment(
    enrollment_id: UUID,
    db: Session = Depends(get_db),
) -> Response:
    EnrollmentService.delete_enrollment(
        db,
        enrollment_id,
    )

    return Response(
        status_code=status.HTTP_204_NO_CONTENT
    )