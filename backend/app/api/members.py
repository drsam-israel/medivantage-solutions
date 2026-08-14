from uuid import UUID

from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.schemas.member import (
    MemberCreate,
    MemberResponse,
    MemberUpdate,
)
from app.services.member import MemberService


router = APIRouter(
    prefix="/members",
    tags=["Members"],
)


@router.post(
    "",
    response_model=MemberResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_member(
    member_data: MemberCreate,
    db: Session = Depends(get_db),
) -> MemberResponse:
    return MemberService.create_member(
        db,
        member_data,
    )


@router.get(
    "",
    response_model=list[MemberResponse],
)
def list_members(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=500),
    enrollment_status: str | None = None,
    city: str | None = None,
    is_active: bool | None = None,
    db: Session = Depends(get_db),
) -> list[MemberResponse]:
    return MemberService.list_members(
        db=db,
        skip=skip,
        limit=limit,
        enrollment_status=enrollment_status,
        city=city,
        is_active=is_active,
    )


@router.get(
    "/{member_id}",
    response_model=MemberResponse,
)
def get_member(
    member_id: UUID,
    db: Session = Depends(get_db),
) -> MemberResponse:
    return MemberService.get_member(
        db,
        member_id,
    )


@router.put(
    "/{member_id}",
    response_model=MemberResponse,
)
def update_member(
    member_id: UUID,
    member_data: MemberUpdate,
    db: Session = Depends(get_db),
) -> MemberResponse:
    return MemberService.update_member(
        db,
        member_id,
        member_data,
    )


@router.delete(
    "/{member_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_member(
    member_id: UUID,
    db: Session = Depends(get_db),
) -> Response:
    MemberService.delete_member(
        db,
        member_id,
    )

    return Response(
        status_code=status.HTTP_204_NO_CONTENT
    )