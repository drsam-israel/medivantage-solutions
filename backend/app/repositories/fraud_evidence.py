from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.fraud_evidence import FraudEvidence


class FraudEvidenceRepository:
    @staticmethod
    def create(
        db: Session,
        evidence: FraudEvidence,
    ) -> FraudEvidence:
        db.add(evidence)
        db.commit()
        db.refresh(evidence)

        return evidence


    @staticmethod
    def get_by_id(
        db: Session,
        evidence_id: UUID,
    ) -> FraudEvidence | None:
        statement = select(
            FraudEvidence,
        ).where(
            FraudEvidence.id == evidence_id,
        )

        return db.scalar(statement)


    @staticmethod
    def get_by_number(
        db: Session,
        evidence_number: str,
    ) -> FraudEvidence | None:
        statement = select(
            FraudEvidence,
        ).where(
            FraudEvidence.evidence_number
            == evidence_number,
        )

        return db.scalar(statement)


    @staticmethod
    def list(
        db: Session,
        *,
        skip: int = 0,
        limit: int = 100,
        fraud_case_id: UUID | None = None,
        evidence_type: str | None = None,
        status: str | None = None,
        uploaded_by: str | None = None,
    ) -> list[FraudEvidence]:
        statement = select(
            FraudEvidence,
        )

        if fraud_case_id is not None:
            statement = statement.where(
                FraudEvidence.fraud_case_id
                == fraud_case_id,
            )

        if evidence_type is not None:
            statement = statement.where(
                FraudEvidence.evidence_type
                == evidence_type,
            )

        if status is not None:
            statement = statement.where(
                FraudEvidence.status == status,
            )

        if uploaded_by is not None:
            statement = statement.where(
                FraudEvidence.uploaded_by
                == uploaded_by,
            )

        statement = (
            statement
            .order_by(
                FraudEvidence.created_at.desc(),
            )
            .offset(skip)
            .limit(limit)
        )

        return list(
            db.scalars(
                statement,
            ).all(),
        )


    @staticmethod
    def save(
        db: Session,
        evidence: FraudEvidence,
    ) -> FraudEvidence:
        db.add(evidence)
        db.commit()
        db.refresh(evidence)

        return evidence


    @staticmethod
    def delete(
        db: Session,
        evidence: FraudEvidence,
    ) -> None:
        db.delete(evidence)
        db.commit()