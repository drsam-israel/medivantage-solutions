from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.member import Member
from app.schemas.member import MemberCreate, MemberUpdate


class MemberRepository:
    @staticmethod
    def create(
        db: Session,
        member_data: MemberCreate,
    ) -> Member:
        member = Member(**member_data.model_dump())

        db.add(member)
        db.commit()
        db.refresh(member)

        return member

    @staticmethod
    def get_by_id(
        db: Session,
        member_id: UUID,
    ) -> Member | None:
        statement = select(Member).where(
            Member.id == member_id
        )

        return db.scalar(statement)

    @staticmethod
    def get_by_member_number(
        db: Session,
        member_number: str,
    ) -> Member | None:
        statement = select(Member).where(
            Member.member_number == member_number
        )

        return db.scalar(statement)

    @staticmethod
    def get_by_national_id(
        db: Session,
        national_id: str,
    ) -> Member | None:
        statement = select(Member).where(
            Member.national_id == national_id
        )

        return db.scalar(statement)

    @staticmethod
    def list(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        enrollment_status: str | None = None,
        city: str | None = None,
        is_active: bool | None = None,
    ) -> list[Member]:
        statement = select(Member)

        if enrollment_status is not None:
            statement = statement.where(
                Member.enrollment_status == enrollment_status
            )

        if city is not None:
            statement = statement.where(
                Member.city == city
            )

        if is_active is not None:
            statement = statement.where(
                Member.is_active == is_active
            )

        statement = (
            statement
            .offset(skip)
            .limit(limit)
            .order_by(Member.created_at.desc())
        )

        return list(db.scalars(statement).all())

    @staticmethod
    def update(
        db: Session,
        member: Member,
        member_data: MemberUpdate,
    ) -> Member:
        updates = member_data.model_dump(
            exclude_unset=True
        )

        for field, value in updates.items():
            setattr(member, field, value)

        db.commit()
        db.refresh(member)

        return member

    @staticmethod
    def delete(
        db: Session,
        member: Member,
    ) -> None:
        db.delete(member)
        db.commit()