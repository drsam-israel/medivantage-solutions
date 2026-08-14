from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.claim import Claim


class ClaimRepository:
    """Repository for Claim database operations."""

    def __init__(
        self,
        db: Session,
    ):
        self.db = db

    def create(
        self,
        claim: Claim,
    ) -> Claim:
        self.db.add(claim)
        self.db.commit()
        self.db.refresh(claim)

        return claim

    def get_by_id(
        self,
        claim_id: UUID,
    ) -> Claim | None:
        result = self.db.execute(
            select(Claim).where(
                Claim.id == claim_id,
            ),
        )

        return result.scalar_one_or_none()

    def get_by_claim_number(
        self,
        claim_number: str,
    ) -> Claim | None:
        result = self.db.execute(
            select(Claim).where(
                Claim.claim_number == claim_number,
            ),
        )

        return result.scalar_one_or_none()

    def get_all(
        self,
    ) -> list[Claim]:
        result = self.db.execute(
            select(Claim).order_by(
                Claim.submission_date.desc(),
                Claim.created_at.desc(),
            ),
        )

        return list(
            result.scalars().all(),
        )

    def update(
        self,
        claim: Claim,
    ) -> Claim:
        self.db.commit()
        self.db.refresh(claim)

        return claim

    def delete(
        self,
        claim: Claim,
    ) -> None:
        self.db.delete(claim)
        self.db.commit()