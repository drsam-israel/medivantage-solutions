from datetime import datetime, timezone
from uuid import UUID

from fastapi import (
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from app.models.claim import Claim
from app.models.claim_intelligence import (
    ClaimIntelligence,
)
from app.repositories.claim_intelligence import (
    ClaimIntelligenceRepository,
)
from app.schemas.claim_intelligence import (
    ClaimIntelligenceCreate,
    ClaimIntelligenceUpdate,
)


class ClaimIntelligenceService:
    @staticmethod
    def _get_claim(
        db: Session,
        claim_id: UUID,
    ) -> Claim:
        claim = (
            db.query(Claim)
            .filter(
                Claim.id == claim_id,
            )
            .first()
        )

        if claim is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Claim not found.",
            )

        return claim

    @staticmethod
    def _normalize_risk_level(
        value: str | None,
    ) -> str | None:
        if value is None:
            return None

        return (
            value
            .strip()
            .upper()
        )

    @staticmethod
    def _normalize_review_status(
        value: str | None,
    ) -> str | None:
        if value is None:
            return None

        return (
            value
            .strip()
            .upper()
        )

    @staticmethod
    def _normalize_sla_status(
        value: str | None,
    ) -> str | None:
        if value is None:
            return None

        return (
            value
            .strip()
            .upper()
        )

    @staticmethod
    def _normalize_recommendation(
        value: str | None,
    ) -> str | None:
        if value is None:
            return None

        return (
            value
            .strip()
            .upper()
        )

    @staticmethod
    def create(
        db: Session,
        intelligence_data:
            ClaimIntelligenceCreate,
    ) -> ClaimIntelligence:
        ClaimIntelligenceService._get_claim(
            db,
            intelligence_data.claim_id,
        )

        existing = (
            ClaimIntelligenceRepository
            .get_by_claim_id(
                db,
                intelligence_data.claim_id,
            )
        )

        if existing is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    "Claims Intelligence record "
                    "already exists for this claim."
                ),
            )

        normalized_review_status = (
            ClaimIntelligenceService
            ._normalize_review_status(
                intelligence_data
                .clinical_review_status,
            )
            or "NOT_REVIEWED"
        )

        reviewed_at = (
            intelligence_data.reviewed_at
        )

        if (
            normalized_review_status
            == "REVIEWED"
            and reviewed_at is None
        ):
            reviewed_at = datetime.now(
                timezone.utc,
            )

        normalized_data = (
            intelligence_data.model_copy(
                update={
                    "fraud_risk_level":
                        ClaimIntelligenceService
                        ._normalize_risk_level(
                            intelligence_data
                            .fraud_risk_level,
                        ),

                    "clinical_review_status":
                        normalized_review_status,

                    "sla_status":
                        ClaimIntelligenceService
                        ._normalize_sla_status(
                            intelligence_data
                            .sla_status,
                        )
                        or "ON_TRACK",

                    "decision_recommendation":
                        ClaimIntelligenceService
                        ._normalize_recommendation(
                            intelligence_data
                            .decision_recommendation,
                        ),

                    "reviewed_at":
                        reviewed_at,
                },
            )
        )

        return (
            ClaimIntelligenceRepository
            .create(
                db,
                normalized_data,
            )
        )

    @staticmethod
    def get(
        db: Session,
        intelligence_id: UUID,
    ) -> ClaimIntelligence:
        record = (
            ClaimIntelligenceRepository
            .get_by_id(
                db,
                intelligence_id,
            )
        )

        if record is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=(
                    "Claims Intelligence record "
                    "not found."
                ),
            )

        return record

    @staticmethod
    def get_by_claim(
        db: Session,
        claim_id: UUID,
    ) -> ClaimIntelligence:
        ClaimIntelligenceService._get_claim(
            db,
            claim_id,
        )

        record = (
            ClaimIntelligenceRepository
            .get_by_claim_id(
                db,
                claim_id,
            )
        )

        if record is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=(
                    "Claims Intelligence record "
                    "not found for this claim."
                ),
            )

        return record

    @staticmethod
    def update(
        db: Session,
        claim_id: UUID,
        intelligence_data:
            ClaimIntelligenceUpdate,
    ) -> ClaimIntelligence:
        record = (
            ClaimIntelligenceService
            .get_by_claim(
                db,
                claim_id,
            )
        )

        updates = (
            intelligence_data.model_dump(
                exclude_unset=True,
            )
        )

        if "fraud_risk_level" in updates:
            updates[
                "fraud_risk_level"
            ] = (
                ClaimIntelligenceService
                ._normalize_risk_level(
                    updates[
                        "fraud_risk_level"
                    ],
                )
            )

        if (
            "clinical_review_status"
            in updates
        ):
            updates[
                "clinical_review_status"
            ] = (
                ClaimIntelligenceService
                ._normalize_review_status(
                    updates[
                        "clinical_review_status"
                    ],
                )
            )

        if "sla_status" in updates:
            updates[
                "sla_status"
            ] = (
                ClaimIntelligenceService
                ._normalize_sla_status(
                    updates[
                        "sla_status"
                    ],
                )
            )

        if (
            "decision_recommendation"
            in updates
        ):
            updates[
                "decision_recommendation"
            ] = (
                ClaimIntelligenceService
                ._normalize_recommendation(
                    updates[
                        "decision_recommendation"
                    ],
                )
            )

        resulting_review_status = (
            updates.get(
                "clinical_review_status",
                record.clinical_review_status,
            )
        )

        explicit_reviewed_at = (
            "reviewed_at" in updates
        )

        if (
            resulting_review_status
            == "REVIEWED"
            and not explicit_reviewed_at
            and record.reviewed_at is None
        ):
            updates[
                "reviewed_at"
            ] = datetime.now(
                timezone.utc,
            )

        normalized_update = (
            intelligence_data.model_copy(
                update=updates,
            )
        )

        return (
            ClaimIntelligenceRepository
            .update(
                db,
                record,
                normalized_update,
            )
        )

    @staticmethod
    def delete(
        db: Session,
        claim_id: UUID,
    ) -> None:
        record = (
            ClaimIntelligenceService
            .get_by_claim(
                db,
                claim_id,
            )
        )

        ClaimIntelligenceRepository.delete(
            db,
            record,
        )