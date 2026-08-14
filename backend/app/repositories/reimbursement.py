from uuid import UUID

from sqlalchemy.orm import Session

from app.models.reimbursement import Reimbursement
from app.schemas.reimbursement import (
    ReimbursementCreate,
    ReimbursementUpdate,
)


class ReimbursementRepository:
    @staticmethod
    def create(
        db: Session,
        reimbursement_data: ReimbursementCreate,
    ) -> Reimbursement:
        reimbursement = Reimbursement(
            **reimbursement_data.model_dump(),
        )

        db.add(reimbursement)
        db.commit()
        db.refresh(reimbursement)

        return reimbursement

    @staticmethod
    def get_by_id(
        db: Session,
        reimbursement_id: UUID,
    ) -> Reimbursement | None:
        return (
            db.query(Reimbursement)
            .filter(
                Reimbursement.id == reimbursement_id,
            )
            .first()
        )

    @staticmethod
    def get_by_number(
        db: Session,
        reimbursement_number: str,
    ) -> Reimbursement | None:
        return (
            db.query(Reimbursement)
            .filter(
                Reimbursement.reimbursement_number
                == reimbursement_number,
            )
            .first()
        )

    @staticmethod
    def list(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        status: str | None = None,
        approval_status: str | None = None,
        reconciliation_status: str | None = None,
        provider_id: UUID | None = None,
        member_id: UUID | None = None,
        claim_id: UUID | None = None,
    ) -> list[Reimbursement]:
        query = db.query(Reimbursement)

        if status:
            query = query.filter(
                Reimbursement.status == status,
            )

        if approval_status:
            query = query.filter(
                Reimbursement.approval_status
                == approval_status,
            )

        if reconciliation_status:
            query = query.filter(
                Reimbursement.reconciliation_status
                == reconciliation_status,
            )

        if provider_id:
            query = query.filter(
                Reimbursement.provider_id == provider_id,
            )

        if member_id:
            query = query.filter(
                Reimbursement.member_id == member_id,
            )

        if claim_id:
            query = query.filter(
                Reimbursement.claim_id == claim_id,
            )

        return (
            query
            .order_by(
                Reimbursement.created_at.desc(),
            )
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def update(
        db: Session,
        reimbursement: Reimbursement,
        reimbursement_data: ReimbursementUpdate,
    ) -> Reimbursement:
        update_data = reimbursement_data.model_dump(
            exclude_unset=True,
        )

        for field, value in update_data.items():
            setattr(
                reimbursement,
                field,
                value,
            )

        db.commit()
        db.refresh(reimbursement)

        return reimbursement

    @staticmethod
    def save(
        db: Session,
        reimbursement: Reimbursement,
    ) -> Reimbursement:
        db.add(reimbursement)
        db.commit()
        db.refresh(reimbursement)

        return reimbursement

    @staticmethod
    def delete(
        db: Session,
        reimbursement: Reimbursement,
    ) -> None:
        db.delete(reimbursement)
        db.commit()