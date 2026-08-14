from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.claim_intelligence import ClaimIntelligence
from app.schemas.claim_intelligence import (
    ClaimIntelligenceCreate,
    ClaimIntelligenceUpdate,
)


class ClaimIntelligenceRepository:
    @staticmethod
    def create(
        db: Session,
        intelligence_data: ClaimIntelligenceCreate,
    ) -> ClaimIntelligence:
        record = ClaimIntelligence(
            **intelligence_data.model_dump(),
        )

        db.add(record)
        db.commit()
        db.refresh(record)

        return record

    @staticmethod
    def get_by_id(
        db: Session,
        intelligence_id: UUID,
    ) -> ClaimIntelligence | None:
        statement = select(
            ClaimIntelligence
        ).where(
            ClaimIntelligence.id
            == intelligence_id,
        )

        return db.scalar(statement)

    @staticmethod
    def get_by_claim_id(
        db: Session,
        claim_id: UUID,
    ) -> ClaimIntelligence | None:
        statement = select(
            ClaimIntelligence
        ).where(
            ClaimIntelligence.claim_id
            == claim_id,
        )

        return db.scalar(statement)

    @staticmethod
    def update(
        db: Session,
        record: ClaimIntelligence,
        intelligence_data:
            ClaimIntelligenceUpdate,
    ) -> ClaimIntelligence:
        updates = (
            intelligence_data.model_dump(
                exclude_unset=True,
            )
        )

        for field, value in updates.items():
            setattr(
                record,
                field,
                value,
            )

        db.add(record)
        db.commit()
        db.refresh(record)

        return record

    @staticmethod
    def delete(
        db: Session,
        record: ClaimIntelligence,
    ) -> None:
        db.delete(record)
        db.commit()