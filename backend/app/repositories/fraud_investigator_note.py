from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.fraud_investigator_note import (
    FraudInvestigatorNote,
)


class FraudInvestigatorNoteRepository:
    @staticmethod
    def create(
        db: Session,
        note: FraudInvestigatorNote,
    ) -> FraudInvestigatorNote:
        db.add(note)
        db.commit()
        db.refresh(note)

        return note


    @staticmethod
    def get_by_id(
        db: Session,
        note_id: UUID,
    ) -> FraudInvestigatorNote | None:
        statement = select(
            FraudInvestigatorNote,
        ).where(
            FraudInvestigatorNote.id
            == note_id,
        )

        return db.scalar(statement)


    @staticmethod
    def get_by_number(
        db: Session,
        note_number: str,
    ) -> FraudInvestigatorNote | None:
        statement = select(
            FraudInvestigatorNote,
        ).where(
            FraudInvestigatorNote.note_number
            == note_number,
        )

        return db.scalar(statement)


    @staticmethod
    def list(
        db: Session,
        *,
        skip: int = 0,
        limit: int = 100,
        fraud_case_id: UUID | None = None,
        author: str | None = None,
        visibility: str | None = None,
    ) -> list[FraudInvestigatorNote]:
        statement = select(
            FraudInvestigatorNote,
        )

        if fraud_case_id is not None:
            statement = statement.where(
                FraudInvestigatorNote.fraud_case_id
                == fraud_case_id,
            )

        if author is not None:
            statement = statement.where(
                FraudInvestigatorNote.author
                == author,
            )

        if visibility is not None:
            statement = statement.where(
                FraudInvestigatorNote.visibility
                == visibility,
            )

        statement = (
            statement
            .order_by(
                FraudInvestigatorNote
                .created_at
                .desc(),
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
        note: FraudInvestigatorNote,
    ) -> FraudInvestigatorNote:
        db.add(note)
        db.commit()
        db.refresh(note)

        return note


    @staticmethod
    def delete(
        db: Session,
        note: FraudInvestigatorNote,
    ) -> None:
        db.delete(note)
        db.commit()