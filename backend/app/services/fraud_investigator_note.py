from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.fraud_investigator_note import (
    FraudInvestigatorNote,
)
from app.repositories.fraud_case import (
    FraudCaseRepository,
)
from app.repositories.fraud_investigator_note import (
    FraudInvestigatorNoteRepository,
)
from app.schemas.fraud_investigator_note import (
    FraudInvestigatorNoteCreate,
    FraudInvestigatorNoteUpdate,
)


class FraudInvestigatorNoteService:
    ALLOWED_VISIBILITY = {
        "INTERNAL",
        "LEGAL",
        "RESTRICTED",
    }


    @staticmethod
    def create_note(
        db: Session,
        note_data: FraudInvestigatorNoteCreate,
    ) -> FraudInvestigatorNote:
        existing = (
            FraudInvestigatorNoteRepository
            .get_by_number(
                db,
                note_data.note_number,
            )
        )

        if existing is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    "Fraud investigator note number "
                    "already exists."
                ),
            )

        fraud_case = (
            FraudCaseRepository
            .get_by_id(
                db,
                note_data.fraud_case_id,
            )
        )

        if fraud_case is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=(
                    "Parent fraud investigation "
                    "case not found."
                ),
            )

        note = FraudInvestigatorNote(
            **note_data.model_dump()
        )

        FraudInvestigatorNoteService._validate_note(
            note,
        )

        return (
            FraudInvestigatorNoteRepository
            .create(
                db,
                note,
            )
        )


    @staticmethod
    def get_note(
        db: Session,
        note_id: UUID,
    ) -> FraudInvestigatorNote:
        note = (
            FraudInvestigatorNoteRepository
            .get_by_id(
                db,
                note_id,
            )
        )

        if note is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=(
                    "Fraud investigator note not found."
                ),
            )

        return note


    @staticmethod
    def get_note_by_number(
        db: Session,
        note_number: str,
    ) -> FraudInvestigatorNote:
        note = (
            FraudInvestigatorNoteRepository
            .get_by_number(
                db,
                note_number,
            )
        )

        if note is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=(
                    "Fraud investigator note not found."
                ),
            )

        return note


    @staticmethod
    def list_notes(
        db: Session,
        *,
        skip: int = 0,
        limit: int = 100,
        fraud_case_id: UUID | None = None,
        author: str | None = None,
        visibility: str | None = None,
    ) -> list[FraudInvestigatorNote]:
        return (
            FraudInvestigatorNoteRepository
            .list(
                db,
                skip=skip,
                limit=limit,
                fraud_case_id=fraud_case_id,
                author=author,
                visibility=visibility,
            )
        )


    @staticmethod
    def update_note(
        db: Session,
        note_id: UUID,
        note_data: FraudInvestigatorNoteUpdate,
    ) -> FraudInvestigatorNote:
        note = (
            FraudInvestigatorNoteService
            .get_note(
                db,
                note_id,
            )
        )

        updates = note_data.model_dump(
            exclude_unset=True,
        )

        for field, value in updates.items():
            setattr(
                note,
                field,
                value,
            )

        FraudInvestigatorNoteService._validate_note(
            note,
        )

        return (
            FraudInvestigatorNoteRepository
            .save(
                db,
                note,
            )
        )


    @staticmethod
    def delete_note(
        db: Session,
        note_id: UUID,
    ) -> None:
        note = (
            FraudInvestigatorNoteService
            .get_note(
                db,
                note_id,
            )
        )

        FraudInvestigatorNoteRepository.delete(
            db,
            note,
        )


    @staticmethod
    def _validate_note(
        note: FraudInvestigatorNote,
    ) -> None:
        visibility = (
            note.visibility
            .strip()
            .upper()
        )

        if (
            visibility
            not in FraudInvestigatorNoteService
            .ALLOWED_VISIBILITY
        ):
            raise HTTPException(
                status_code=(
                    status.HTTP_422_UNPROCESSABLE_ENTITY
                ),
                detail=(
                    "Invalid investigator note visibility."
                ),
            )

        note.visibility = visibility

        if not note.author.strip():
            raise HTTPException(
                status_code=(
                    status.HTTP_422_UNPROCESSABLE_ENTITY
                ),
                detail=(
                    "Investigator note author is required."
                ),
            )

        if not note.note_text.strip():
            raise HTTPException(
                status_code=(
                    status.HTTP_422_UNPROCESSABLE_ENTITY
                ),
                detail=(
                    "Investigator note text is required."
                ),
            )