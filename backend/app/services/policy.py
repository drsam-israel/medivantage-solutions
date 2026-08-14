from uuid import UUID

from fastapi import (
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from app.models.health_plan import HealthPlan
from app.models.member import Member
from app.models.policy import Policy
from app.repositories.policy import (
    PolicyRepository,
)
from app.schemas.policy import (
    PolicyCreate,
    PolicyUpdate,
)


class PolicyService:
    @staticmethod
    def _normalize_text(
        value: str | None,
    ) -> str | None:
        if value is None:
            return None

        return value.strip().upper()

    @staticmethod
    def _get_member(
        db: Session,
        member_id: UUID,
    ) -> Member:
        member = (
            db.query(Member)
            .filter(
                Member.id == member_id,
            )
            .first()
        )

        if member is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Policyholder member not found.",
            )

        return member

    @staticmethod
    def _get_health_plan(
        db: Session,
        health_plan_id: UUID,
    ) -> HealthPlan:
        health_plan = (
            db.query(HealthPlan)
            .filter(
                HealthPlan.id == health_plan_id,
            )
            .first()
        )

        if health_plan is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Health plan not found.",
            )

        return health_plan

    @staticmethod
    def create_policy(
        db: Session,
        policy_data: PolicyCreate,
    ) -> Policy:
        PolicyService._get_member(
            db,
            policy_data.policyholder_member_id,
        )

        PolicyService._get_health_plan(
            db,
            policy_data.health_plan_id,
        )

        existing = (
            PolicyRepository.get_by_number(
                db,
                policy_data.policy_number,
            )
        )

        if existing is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    "A policy with this policy number "
                    "already exists."
                ),
            )

        normalized_data = (
            policy_data.model_copy(
                update={
                    "policy_number":
                        policy_data
                        .policy_number
                        .strip(),

                    "status":
                        PolicyService
                        ._normalize_text(
                            policy_data.status,
                        )
                        or "PENDING",

                    "policy_type":
                        PolicyService
                        ._normalize_text(
                            policy_data.policy_type,
                        )
                        or "INDIVIDUAL",

                    "premium_currency":
                        PolicyService
                        ._normalize_text(
                            policy_data
                            .premium_currency,
                        )
                        or "SAR",

                    "billing_frequency":
                        PolicyService
                        ._normalize_text(
                            policy_data
                            .billing_frequency,
                        )
                        or "MONTHLY",

                    "billing_status":
                        PolicyService
                        ._normalize_text(
                            policy_data
                            .billing_status,
                        )
                        or "PENDING",
                },
            )
        )

        return PolicyRepository.create(
            db,
            normalized_data,
        )

    @staticmethod
    def list_policies(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        policy_status: str | None = None,
        policy_type: str | None = None,
        policyholder_member_id:
            UUID | None = None,
        health_plan_id:
            UUID | None = None,
        is_active: bool | None = None,
    ) -> list[Policy]:
        normalized_status = (
            PolicyService._normalize_text(
                policy_status,
            )
        )

        normalized_policy_type = (
            PolicyService._normalize_text(
                policy_type,
            )
        )

        return PolicyRepository.list(
            db=db,
            skip=skip,
            limit=limit,
            status=normalized_status,
            policy_type=normalized_policy_type,
            policyholder_member_id=(
                policyholder_member_id
            ),
            health_plan_id=health_plan_id,
            is_active=is_active,
        )

    @staticmethod
    def get_policy(
        db: Session,
        policy_id: UUID,
    ) -> Policy:
        policy = (
            PolicyRepository.get_by_id(
                db,
                policy_id,
            )
        )

        if policy is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Policy not found.",
            )

        return policy

    @staticmethod
    def get_policy_by_number(
        db: Session,
        policy_number: str,
    ) -> Policy:
        policy = (
            PolicyRepository.get_by_number(
                db,
                policy_number.strip(),
            )
        )

        if policy is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Policy not found.",
            )

        return policy

    @staticmethod
    def update_policy(
        db: Session,
        policy_id: UUID,
        policy_data: PolicyUpdate,
    ) -> Policy:
        policy = (
            PolicyService.get_policy(
                db,
                policy_id,
            )
        )

        updates = (
            policy_data.model_dump(
                exclude_unset=True,
            )
        )

        if "status" in updates:
            updates["status"] = (
                PolicyService
                ._normalize_text(
                    updates["status"],
                )
            )

        if "policy_type" in updates:
            updates["policy_type"] = (
                PolicyService
                ._normalize_text(
                    updates["policy_type"],
                )
            )

        if "premium_currency" in updates:
            updates["premium_currency"] = (
                PolicyService
                ._normalize_text(
                    updates[
                        "premium_currency"
                    ],
                )
            )

        if "billing_frequency" in updates:
            updates["billing_frequency"] = (
                PolicyService
                ._normalize_text(
                    updates[
                        "billing_frequency"
                    ],
                )
            )

        if "billing_status" in updates:
            updates["billing_status"] = (
                PolicyService
                ._normalize_text(
                    updates[
                        "billing_status"
                    ],
                )
            )

        effective_date = (
            updates.get(
                "effective_date",
                policy.effective_date,
            )
        )

        expiry_date = (
            updates.get(
                "expiry_date",
                policy.expiry_date,
            )
        )

        if expiry_date < effective_date:
            raise HTTPException(
                status_code=(
                    status.HTTP_422_UNPROCESSABLE_CONTENT
                ),
                detail=(
                    "Policy expiry date cannot be "
                    "earlier than the effective date."
                ),
            )

        renewal_due_date = (
            updates.get(
                "renewal_due_date",
                policy.renewal_due_date,
            )
        )

        if (
            renewal_due_date is not None
            and renewal_due_date
            < effective_date
        ):
            raise HTTPException(
                status_code=(
                    status.HTTP_422_UNPROCESSABLE_CONTENT
                ),
                detail=(
                    "Renewal due date cannot be "
                    "earlier than the policy "
                    "effective date."
                ),
            )

        normalized_update = (
            policy_data.model_copy(
                update=updates,
            )
        )

        return PolicyRepository.update(
            db,
            policy,
            normalized_update,
        )

    @staticmethod
    def delete_policy(
        db: Session,
        policy_id: UUID,
    ) -> None:
        policy = (
            PolicyService.get_policy(
                db,
                policy_id,
            )
        )

        PolicyRepository.delete(
            db,
            policy,
        )