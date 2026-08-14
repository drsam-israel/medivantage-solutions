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
from app.schemas.fraud_timeline_event import (
    FraudTimelineEventCreate,
    FraudTimelineEventResponse,
    FraudTimelineEventUpdate,
)
from app.services.fraud_timeline_event import (
    FraudTimelineEventService,
)


router = APIRouter(
    prefix="/fraud-timeline-events",
    tags=["Fraud Investigation"],
)


@router.post(
    "",
    response_model=FraudTimelineEventResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_fraud_timeline_event(
    event_data: FraudTimelineEventCreate,
    db: Session = Depends(get_db),
) -> FraudTimelineEventResponse:
    return FraudTimelineEventService.create_event(
        db,
        event_data,
    )


@router.get(
    "",
    response_model=list[FraudTimelineEventResponse],
)
def list_fraud_timeline_events(
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
    event_type: str | None = None,
    performed_by: str | None = None,
    event_status: str | None = Query(
        default=None,
        alias="status",
    ),
    db: Session = Depends(get_db),
) -> list[FraudTimelineEventResponse]:
    return FraudTimelineEventService.list_events(
        db=db,
        skip=skip,
        limit=limit,
        fraud_case_id=fraud_case_id,
        event_type=event_type,
        performed_by=performed_by,
        status_filter=event_status,
    )


@router.get(
    "/number/{event_number}",
    response_model=FraudTimelineEventResponse,
)
def get_fraud_timeline_event_by_number(
    event_number: str,
    db: Session = Depends(get_db),
) -> FraudTimelineEventResponse:
    return FraudTimelineEventService.get_event_by_number(
        db,
        event_number,
    )


@router.get(
    "/{event_id}",
    response_model=FraudTimelineEventResponse,
)
def get_fraud_timeline_event(
    event_id: UUID,
    db: Session = Depends(get_db),
) -> FraudTimelineEventResponse:
    return FraudTimelineEventService.get_event(
        db,
        event_id,
    )


@router.put(
    "/{event_id}",
    response_model=FraudTimelineEventResponse,
)
def update_fraud_timeline_event(
    event_id: UUID,
    event_data: FraudTimelineEventUpdate,
    db: Session = Depends(get_db),
) -> FraudTimelineEventResponse:
    return FraudTimelineEventService.update_event(
        db,
        event_id,
        event_data,
    )


@router.delete(
    "/{event_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_fraud_timeline_event(
    event_id: UUID,
    db: Session = Depends(get_db),
) -> Response:
    FraudTimelineEventService.delete_event(
        db,
        event_id,
    )

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )