from datetime import date
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.ai_insight import AIInsight
from app.repositories.ai_insight import (
    AIInsightRepository,
)
from app.schemas.ai_insight import (
    AIInsightApprovalRequest,
    AIInsightCreate,
    AIInsightUpdate,
)


class AIInsightService:
    @staticmethod
    def _generate_insight_number(
        db: Session,
    ) -> str:
        year = date.today().year

        existing = AIInsightRepository.list(
            db=db,
            skip=0,
            limit=10000,
        )

        year_prefix = f"AI-{year}-"

        sequence_numbers: list[int] = []

        for insight in existing:
            if not insight.insight_number.startswith(
                year_prefix
            ):
                continue

            try:
                sequence_numbers.append(
                    int(
                        insight.insight_number[
                            len(year_prefix):
                        ]
                    )
                )
            except ValueError:
                continue

        next_sequence = (
            max(sequence_numbers) + 1
            if sequence_numbers
            else 1
        )

        return (
            f"{year_prefix}"
            f"{next_sequence:04d}"
        )

    @classmethod
    def create_insight(
        cls,
        db: Session,
        insight_data: AIInsightCreate,
    ) -> AIInsight:
        insight_number = (
            insight_data.insight_number
            or cls._generate_insight_number(db)
        )

        existing = (
            AIInsightRepository
            .get_by_insight_number(
                db,
                insight_number,
            )
        )

        if existing is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    "An AI insight with this "
                    "insight number already exists."
                ),
            )

        payload = insight_data.model_dump(
            exclude={"insight_number"},
        )

        insight = AIInsight(
            insight_number=insight_number,
            **payload,
        )

        return AIInsightRepository.create(
            db,
            insight,
        )

    @staticmethod
    def list_insights(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        status_filter: str | None = None,
        priority: str | None = None,
        risk_level: str | None = None,
        insight_type: str | None = None,
        source_module: str | None = None,
        assigned_reviewer: str | None = None,
        review_status: str | None = None,
    ) -> list[AIInsight]:
        return AIInsightRepository.list(
            db=db,
            skip=skip,
            limit=limit,
            status=status_filter,
            priority=priority,
            risk_level=risk_level,
            insight_type=insight_type,
            source_module=source_module,
            assigned_reviewer=assigned_reviewer,
            review_status=review_status,
        )

    @staticmethod
    def get_insight(
        db: Session,
        insight_id: UUID,
    ) -> AIInsight:
        insight = (
            AIInsightRepository.get_by_id(
                db,
                insight_id,
            )
        )

        if insight is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="AI insight not found.",
            )

        return insight

    @staticmethod
    def update_insight(
        db: Session,
        insight_id: UUID,
        insight_data: AIInsightUpdate,
    ) -> AIInsight:
        insight = (
            AIInsightService.get_insight(
                db,
                insight_id,
            )
        )

        changes = insight_data.model_dump(
            exclude_unset=True,
        )

        for field, value in changes.items():
            setattr(
                insight,
                field,
                value,
            )

        return AIInsightRepository.update(
            db,
            insight,
        )

    @staticmethod
    def approve_recommendation(
        db: Session,
        insight_id: UUID,
        approval: AIInsightApprovalRequest,
    ) -> AIInsight:
        insight = (
            AIInsightService.get_insight(
                db,
                insight_id,
            )
        )

        if insight.status == "APPROVED":
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    "This AI recommendation "
                    "has already been approved."
                ),
            )

        if insight.status == "CLOSED":
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    "A closed AI insight "
                    "cannot be approved."
                ),
            )

        insight.status = "APPROVED"

        insight.assigned_reviewer = (
            approval.reviewer
        )

        insight.review_status = "APPROVED"

        insight.review_comment = (
            approval.comment
        )

        insight.review_date = date.today()

        return AIInsightRepository.update(
            db,
            insight,
        )

    @staticmethod
    def delete_insight(
        db: Session,
        insight_id: UUID,
    ) -> None:
        insight = (
            AIInsightService.get_insight(
                db,
                insight_id,
            )
        )

        AIInsightRepository.delete(
            db,
            insight,
        )