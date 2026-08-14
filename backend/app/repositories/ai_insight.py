from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.ai_insight import AIInsight


class AIInsightRepository:
    @staticmethod
    def create(
        db: Session,
        insight: AIInsight,
    ) -> AIInsight:
        db.add(insight)
        db.commit()
        db.refresh(insight)

        return insight

    @staticmethod
    def get_by_id(
        db: Session,
        insight_id: UUID,
    ) -> AIInsight | None:
        statement = select(AIInsight).where(
            AIInsight.id == insight_id,
        )

        return db.scalar(statement)

    @staticmethod
    def get_by_insight_number(
        db: Session,
        insight_number: str,
    ) -> AIInsight | None:
        statement = select(AIInsight).where(
            AIInsight.insight_number
            == insight_number,
        )

        return db.scalar(statement)

    @staticmethod
    def list(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        status: str | None = None,
        priority: str | None = None,
        risk_level: str | None = None,
        insight_type: str | None = None,
        source_module: str | None = None,
        assigned_reviewer: str | None = None,
        review_status: str | None = None,
    ) -> list[AIInsight]:
        statement = select(AIInsight)

        if status is not None:
            statement = statement.where(
                AIInsight.status == status,
            )

        if priority is not None:
            statement = statement.where(
                AIInsight.priority == priority,
            )

        if risk_level is not None:
            statement = statement.where(
                AIInsight.risk_level == risk_level,
            )

        if insight_type is not None:
            statement = statement.where(
                AIInsight.insight_type
                == insight_type,
            )

        if source_module is not None:
            statement = statement.where(
                AIInsight.source_module
                == source_module,
            )

        if assigned_reviewer is not None:
            statement = statement.where(
                AIInsight.assigned_reviewer
                == assigned_reviewer,
            )

        if review_status is not None:
            statement = statement.where(
                AIInsight.review_status
                == review_status,
            )

        statement = (
            statement
            .order_by(
                AIInsight.detected_date.desc(),
                AIInsight.created_at.desc(),
            )
            .offset(skip)
            .limit(limit)
        )

        return list(
            db.scalars(statement).all(),
        )

    @staticmethod
    def update(
        db: Session,
        insight: AIInsight,
    ) -> AIInsight:
        db.add(insight)
        db.commit()
        db.refresh(insight)

        return insight

    @staticmethod
    def delete(
        db: Session,
        insight: AIInsight,
    ) -> None:
        db.delete(insight)
        db.commit()