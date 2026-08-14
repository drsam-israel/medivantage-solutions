from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.member import Member
from app.repositories.member import MemberRepository
from app.schemas.member import MemberCreate, MemberUpdate


class MemberService:
    """Business logic for member administration."""

    @staticmethod
    def create_member(
        db: Session,
        member_data: MemberCreate,
    ) -> Member:
        existing_member = (
            MemberRepository.get_by_member_number(
                db,
                member_data.member_number,
            )
        )

        if existing_member:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Member number already exists.",
            )

        if member_data.national_id:
            existing_national_id = (
                MemberRepository.get_by_national_id(
                    db,
                    member_data.national_id,
                )
            )

            if existing_national_id:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="National ID already exists.",
                )

        try:
            return MemberRepository.create(
                db,
                member_data,
            )

        except IntegrityError as exc:
            db.rollback()

            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    "Member record conflicts with existing data."
                ),
            ) from exc

    @staticmethod
    def get_member(
        db: Session,
        member_id: UUID,
    ) -> Member:
        member = MemberRepository.get_by_id(
            db,
            member_id,
        )

        if member is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Member not found.",
            )

        return member

    @staticmethod
    def list_members(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        enrollment_status: str | None = None,
        city: str | None = None,
        is_active: bool | None = None,
    ) -> list[Member]:
        return MemberRepository.list(
            db=db,
            skip=skip,
            limit=limit,
            enrollment_status=enrollment_status,
            city=city,
            is_active=is_active,
        )

    @staticmethod
    def update_member(
        db: Session,
        member_id: UUID,
        member_data: MemberUpdate,
    ) -> Member:
        member = MemberService.get_member(
            db,
            member_id,
        )

        if member_data.national_id:
            existing_member = (
                MemberRepository.get_by_national_id(
                    db,
                    member_data.national_id,
                )
            )

            if (
                existing_member is not None
                and existing_member.id != member.id
            ):
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="National ID already exists.",
                )

        try:
            return MemberRepository.update(
                db,
                member,
                member_data,
            )

        except IntegrityError as exc:
            db.rollback()

            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    "Member update conflicts with existing data."
                ),
            ) from exc

    @staticmethod
    def delete_member(
        db: Session,
        member_id: UUID,
    ) -> None:
        member = MemberService.get_member(
            db,
            member_id,
        )

        MemberRepository.delete(
            db,
            member,
        )