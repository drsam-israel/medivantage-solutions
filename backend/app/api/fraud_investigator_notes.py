from uuid import UUID

from fastapi import (
    APIRouter,
    Depends,
    Query,
    Response,
    status,
)
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.schemas.fraud_investigator_note import (
    FraudInvestigatorNoteCreate,
    FraudInvestigatorNoteResponse,
    FraudInvestigatorNoteUpdate,
)
from app.services.fraud_investigator_note import (
    FraudInvestigatorNoteService,
)


router = APIRouter(
    prefix="/fraud-investigator-notes",
    tags=["Fraud Investigation"],
)


@router.post(
    "",
    response_model=FraudInvestigatorNoteResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_fraud_investigator_note(
    note_data: FraudInvestigatorNoteCreate,
    db: Session = Depends(get_db),
) -> FraudInvestigatorNoteResponse:
    return FraudInvestigatorNoteService.create_note(
        db,
        note_data,
    )


@router.get(
    "",
    response_model=list[FraudInvestigatorNoteResponse],
)
def list_fraud_investigator_notes(
    skip: int = Query(
        default=0,
        ge=0,
    ),
    limit: int = Query(
        default=100,
        ge=1,
        le=500,
    ),
    fraud_case_id: UUID | None = None,
    author: str | None = None,
    visibility: str | None = None,
    db: Session = Depends(get_db),
) -> list[FraudInvestigatorNoteResponse]:
    return FraudInvestigatorNoteService.list_notes(
        db=db,
        skip=skip,
        limit=limit,
        fraud_case_id=fraud_case_id,
        author=author,
        visibility=visibility,
    )


@router.get(
    "/number/{note_number}",
    response_model=FraudInvestigatorNoteResponse,
)
def get_fraud_investigator_note_by_number(
    note_number: str,
    db: Session = Depends(get_db),
) -> FraudInvestigatorNoteResponse:
    return FraudInvestigatorNoteService.get_note_by_number(
        db,
        note_number,
    )


@router.get(
    "/{note_id}",
    response_model=FraudInvestigatorNoteResponse,
)
def get_fraud_investigator_note(
    note_id: UUID,
    db: Session = Depends(get_db),
) -> FraudInvestigatorNoteResponse:
    return FraudInvestigatorNoteService.get_note(
        db,
        note_id,
    )


@router.put(
    "/{note_id}",
    response_model=FraudInvestigatorNoteResponse,
)
def update_fraud_investigator_note(
    note_id: UUID,
    note_data: FraudInvestigatorNoteUpdate,
    db: Session = Depends(get_db),
) -> FraudInvestigatorNoteResponse:
    return FraudInvestigatorNoteService.update_note(
        db,
        note_id,
        note_data,
    )


@router.delete(
    "/{note_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_fraud_investigator_note(
    note_id: UUID,
    db: Session = Depends(get_db),
) -> Response:
    FraudInvestigatorNoteService.delete_note(
        db,
        note_id,
    )

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )