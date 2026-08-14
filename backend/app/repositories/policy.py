from uuid import UUID

from sqlalchemy.orm import Session

from app.models.policy import Policy
from app.schemas.policy import (
    PolicyCreate,
    PolicyUpdate,
)


class PolicyRepository:
    @staticmethod
    def create(
        db: Session,
        policy_data: PolicyCreate,
    ) -> Policy:
        policy = Policy(
            **policy_data.model_dump(),
        )

        db.add(policy)
        db.commit()
        db.refresh(policy)

        return policy

    @staticmethod
    def get_by_id(
        db: Session,
        policy_id: UUID,
    ) -> Policy | None:
        return (
            db.query(Policy)
            .filter(
                Policy.id == policy_id,
            )
            .first()
        )

    @staticmethod
    def get_by_number(
        db: Session,
        policy_number: str,
    ) -> Policy | None:
        return (
            db.query(Policy)
            .filter(
                Policy.policy_number
                == policy_number,
            )
            .first()
        )

    @staticmethod
    def list(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        status: str | None = None,
        policy_type: str | None = None,
        policyholder_member_id: UUID | None = None,
        health_plan_id: UUID | None = None,
        is_active: bool | None = None,
    ) -> list[Policy]:
        query = db.query(Policy)

        if status is not None:
            query = query.filter(
                Policy.status == status,
            )

        if policy_type is not None:
            query = query.filter(
                Policy.policy_type
                == policy_type,
            )

        if (
            policyholder_member_id
            is not None
        ):
            query = query.filter(
                Policy.policyholder_member_id
                == policyholder_member_id,
            )

        if health_plan_id is not None:
            query = query.filter(
                Policy.health_plan_id
                == health_plan_id,
            )

        if is_active is not None:
            query = query.filter(
                Policy.is_active
                == is_active,
            )

        return (
            query
            .order_by(
                Policy.created_at.desc(),
            )
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def update(
        db: Session,
        policy: Policy,
        policy_data: PolicyUpdate,
    ) -> Policy:
        updates = (
            policy_data.model_dump(
                exclude_unset=True,
            )
        )

        for field, value in updates.items():
            setattr(
                policy,
                field,
                value,
            )

        db.add(policy)
        db.commit()
        db.refresh(policy)

        return policy

    @staticmethod
    def delete(
        db: Session,
        policy: Policy,
    ) -> None:
        db.delete(policy)
        db.commit()