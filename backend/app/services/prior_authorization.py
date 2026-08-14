from datetime import datetime, timezone
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.prior_authorization import PriorAuthorization
from app.repositories.prior_authorization import (
    PriorAuthorizationRepository,
)
from app.schemas.prior_authorization import (
    PriorAuthorizationCreate,
    PriorAuthorizationDecision,
    PriorAuthorizationUpdate,
)


class PriorAuthorizationService:
    ALLOWED_DECISION_ACTIONS = {
        "APPROVE",
        "REQUEST_MORE_INFORMATION",
        "ESCALATE",
        "DENY",
    }

    @staticmethod
    def create_authorization(
        db: Session,
        authorization_data: PriorAuthorizationCreate,
    ) -> PriorAuthorization:
        existing = PriorAuthorizationRepository.get_by_number(
            db,
            authorization_data.authorization_number,
        )

        if existing is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Authorization number already exists.",
            )

        authorization = PriorAuthorization(
            **authorization_data.model_dump()
        )

        return PriorAuthorizationRepository.create(
            db,
            authorization,
        )

    @staticmethod
    def get_authorization(
        db: Session,
        authorization_id: UUID,
    ) -> PriorAuthorization:
        authorization = PriorAuthorizationRepository.get_by_id(
            db,
            authorization_id,
        )

        if authorization is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Prior authorization not found.",
            )

        return authorization

    @staticmethod
    def list_authorizations(
        db: Session,
        *,
        skip: int = 0,
        limit: int = 100,
        member_id: UUID | None = None,
        provider_id: UUID | None = None,
        status_filter: str | None = None,
        priority: str | None = None,
    ) -> list[PriorAuthorization]:
        return PriorAuthorizationRepository.list(
            db,
            skip=skip,
            limit=limit,
            member_id=member_id,
            provider_id=provider_id,
            status=status_filter,
            priority=priority,
        )

    @staticmethod
    def update_authorization(
        db: Session,
        authorization_id: UUID,
        authorization_data: PriorAuthorizationUpdate,
    ) -> PriorAuthorization:
        authorization = (
            PriorAuthorizationService.get_authorization(
                db,
                authorization_id,
            )
        )

        updates = authorization_data.model_dump(
            exclude_unset=True
        )

        for field, value in updates.items():
            setattr(
                authorization,
                field,
                value,
            )

        return PriorAuthorizationRepository.save(
            db,
            authorization,
        )

    @staticmethod
    def make_decision(
        db: Session,
        authorization_id: UUID,
        decision_data: PriorAuthorizationDecision,
    ) -> PriorAuthorization:
        authorization = (
            PriorAuthorizationService.get_authorization(
                db,
                authorization_id,
            )
        )

        action = decision_data.action.strip().upper()

        if action not in (
            PriorAuthorizationService
            .ALLOWED_DECISION_ACTIONS
        ):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=(
                    "Invalid decision action. "
                    "Allowed actions: APPROVE, "
                    "REQUEST_MORE_INFORMATION, "
                    "ESCALATE, DENY."
                ),
            )

        if action == "APPROVE":
            authorization.status = "APPROVED"
            authorization.final_decision = "APPROVED"
            authorization.decision_rationale = (
                decision_data.rationale
            )
            authorization.information_requested = None
            authorization.escalation_reason = None
            authorization.escalated_to = None

        elif action == "REQUEST_MORE_INFORMATION":
            if not decision_data.information_requested:
                raise HTTPException(
                    status_code=(
                        status.HTTP_422_UNPROCESSABLE_ENTITY
                    ),
                    detail=(
                        "information_requested is required "
                        "when requesting more information."
                    ),
                )

            authorization.status = (
                "MORE_INFORMATION_REQUIRED"
            )
            authorization.final_decision = None
            authorization.decision_rationale = (
                decision_data.rationale
            )
            authorization.information_requested = (
                decision_data.information_requested
            )
            authorization.escalation_reason = None
            authorization.escalated_to = None

        elif action == "ESCALATE":
            if not decision_data.escalation_reason:
                raise HTTPException(
                    status_code=(
                        status.HTTP_422_UNPROCESSABLE_ENTITY
                    ),
                    detail=(
                        "escalation_reason is required "
                        "when escalating an authorization."
                    ),
                )

            authorization.status = "ESCALATED"
            authorization.final_decision = None
            authorization.decision_rationale = (
                decision_data.rationale
            )
            authorization.information_requested = None
            authorization.escalation_reason = (
                decision_data.escalation_reason
            )
            authorization.escalated_to = (
                decision_data.escalated_to
                or "MEDICAL_DIRECTOR"
            )

        elif action == "DENY":
            if not decision_data.rationale:
                raise HTTPException(
                    status_code=(
                        status.HTTP_422_UNPROCESSABLE_ENTITY
                    ),
                    detail=(
                        "rationale is required "
                        "when denying an authorization."
                    ),
                )

            authorization.status = "DENIED"
            authorization.final_decision = "DENIED"
            authorization.decision_rationale = (
                decision_data.rationale
            )
            authorization.information_requested = None
            authorization.escalation_reason = None
            authorization.escalated_to = None

        authorization.decided_by = (
            decision_data.reviewer
        )
        authorization.decided_at = datetime.now(
            timezone.utc
        )

        return PriorAuthorizationRepository.save(
            db,
            authorization,
        )

    @staticmethod
    def delete_authorization(
        db: Session,
        authorization_id: UUID,
    ) -> None:
        authorization = (
            PriorAuthorizationService.get_authorization(
                db,
                authorization_id,
            )
        )

        PriorAuthorizationRepository.delete(
            db,
            authorization,
        )