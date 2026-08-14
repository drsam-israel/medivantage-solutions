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
from app.schemas.ai_insight import (
    AIInsightApprovalRequest,
    AIInsightApprovalResponse,
    AIInsightCreate,
    AIInsightResponse,
    AIInsightUpdate,
)
from app.services.ai_insight import AIInsightService


router = APIRouter(
    prefix="/ai-insights",
    tags=["AI Insights"],
)


@router.post(
    "",
    response_model=AIInsightResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_ai_insight(
    insight_data: AIInsightCreate,
    db: Session = Depends(get_db),
) -> AIInsightResponse:
    return AIInsightService.create_insight(
        db,
        insight_data,
    )


@router.get(
    "",
    response_model=list[AIInsightResponse],
)
def list_ai_insights(
    skip: int = Query(
        default=0,
        ge=0,
    ),
    limit: int = Query(
        default=100,
        ge=1,
        le=500,
    ),
    status_filter: str | None = Query(
        default=None,
        alias="status",
    ),
    priority: str | None = None,
    risk_level: str | None = None,
    insight_type: str | None = None,
    source_module: str | None = None,
    assigned_reviewer: str | None = None,
    review_status: str | None = None,
    db: Session = Depends(get_db),
) -> list[AIInsightResponse]:
    return AIInsightService.list_insights(
        db=db,
        skip=skip,
        limit=limit,
        status_filter=status_filter,
        priority=priority,
        risk_level=risk_level,
        insight_type=insight_type,
        source_module=source_module,
        assigned_reviewer=assigned_reviewer,
        review_status=review_status,
    )


@router.get(
    "/{insight_id}",
    response_model=AIInsightResponse,
)
def get_ai_insight(
    insight_id: UUID,
    db: Session = Depends(get_db),
) -> AIInsightResponse:
    return AIInsightService.get_insight(
        db,
        insight_id,
    )


@router.put(
    "/{insight_id}",
    response_model=AIInsightResponse,
)
def update_ai_insight(
    insight_id: UUID,
    insight_data: AIInsightUpdate,
    db: Session = Depends(get_db),
) -> AIInsightResponse:
    return AIInsightService.update_insight(
        db,
        insight_id,
        insight_data,
    )


@router.post(
    "/{insight_id}/approve",
    response_model=AIInsightApprovalResponse,
)
def approve_ai_recommendation(
    insight_id: UUID,
    approval: AIInsightApprovalRequest,
    db: Session = Depends(get_db),
) -> AIInsightApprovalResponse:
    return (
        AIInsightService.approve_recommendation(
            db,
            insight_id,
            approval,
        )
    )


@router.delete(
    "/{insight_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_ai_insight(
    insight_id: UUID,
    db: Session = Depends(get_db),
) -> Response:
    AIInsightService.delete_insight(
        db,
        insight_id,
    )

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )