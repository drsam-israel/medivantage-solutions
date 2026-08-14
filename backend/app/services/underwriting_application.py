from datetime import datetime, timezone
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.repositories.member import MemberRepository
from app.repositories.underwriting_application import (
    UnderwritingApplicationRepository,
)
from app.schemas.underwriting_application import (
    UnderwritingApplicationCreate,
    UnderwritingApplicationUpdate,
)


ALLOWED_STATUSES = {
    "PENDING_REVIEW",
    "AI_REVIEW",
    "MANUAL_REVIEW",
    "APPROVED",
    "DECLINED",
    "REFERRED",
}

FINAL_STATUSES = {
    "APPROVED",
    "DECLINED",
}

ALLOWED_STATUS_TRANSITIONS = {
    "PENDING_REVIEW": {
        "AI_REVIEW",
        "MANUAL_REVIEW",
        "APPROVED",
        "DECLINED",
        "REFERRED",
    },
    "AI_REVIEW": {
        "MANUAL_REVIEW",
        "APPROVED",
        "DECLINED",
        "REFERRED",
    },
    "MANUAL_REVIEW": {
        "APPROVED",
        "DECLINED",
        "REFERRED",
    },
    "REFERRED": {
        "MANUAL_REVIEW",
        "APPROVED",
        "DECLINED",
    },
    "APPROVED": set(),
    "DECLINED": set(),
}


class UnderwritingApplicationService:
    """Business logic for medical underwriting applications."""

    @staticmethod
    def _normalize_status(
        value: str,
    ) -> str:
        return (
            value.strip()
            .upper()
            .replace(" ", "_")
        )

    @staticmethod
    def _validate_status(
        value: str,
    ) -> str:
        normalized = (
            UnderwritingApplicationService
            ._normalize_status(value)
        )

        if normalized not in ALLOWED_STATUSES:
            raise HTTPException(
                status_code=
                    status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=(
                    f"Invalid underwriting status: "
                    f"{normalized}."
                ),
            )

        return normalized

    @staticmethod
    def create_application(
        db: Session,
        application_data:
            UnderwritingApplicationCreate,
    ):
        member = MemberRepository.get_by_id(
            db,
            application_data.member_id,
        )

        if member is None:
            raise HTTPException(
                status_code=
                    status.HTTP_404_NOT_FOUND,
                detail="Member not found.",
            )

        existing_application = (
            UnderwritingApplicationRepository
            .get_by_application_number(
                db,
                application_data.application_number,
            )
        )

        if existing_application is not None:
            raise HTTPException(
                status_code=
                    status.HTTP_409_CONFLICT,
                detail=(
                    "Underwriting application number "
                    "already exists."
                ),
            )

        normalized_status = (
            UnderwritingApplicationService
            ._validate_status(
                application_data.status,
            )
        )

        normalized_payload = (
            application_data.model_copy(
                update={
                    "status":
                        normalized_status,
                }
            )
        )

        try:
            return (
                UnderwritingApplicationRepository
                .create(
                    db,
                    normalized_payload,
                )
            )

        except IntegrityError as exc:
            db.rollback()

            raise HTTPException(
                status_code=
                    status.HTTP_409_CONFLICT,
                detail=(
                    "Underwriting application "
                    "conflicts with existing data."
                ),
            ) from exc

    @staticmethod
    def get_application(
        db: Session,
        application_id: UUID,
    ):
        application = (
            UnderwritingApplicationRepository
            .get_by_id(
                db,
                application_id,
            )
        )

        if application is None:
            raise HTTPException(
                status_code=
                    status.HTTP_404_NOT_FOUND,
                detail=(
                    "Underwriting application "
                    "not found."
                ),
            )

        return application

    @staticmethod
    def get_application_by_number(
        db: Session,
        application_number: str,
    ):
        application = (
            UnderwritingApplicationRepository
            .get_by_application_number(
                db,
                application_number,
            )
        )

        if application is None:
            raise HTTPException(
                status_code=
                    status.HTTP_404_NOT_FOUND,
                detail=(
                    "Underwriting application "
                    "not found."
                ),
            )

        return application

    @staticmethod
    def list_applications(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        member_id: UUID | None = None,
        application_status: str | None = None,
        assigned_underwriter: str | None = None,
    ):
        normalized_status = None

        if application_status:
            normalized_status = (
                UnderwritingApplicationService
                ._validate_status(
                    application_status,
                )
            )

        return (
            UnderwritingApplicationRepository
            .list(
                db=db,
                skip=skip,
                limit=limit,
                member_id=member_id,
                status=normalized_status,
                assigned_underwriter=
                    assigned_underwriter,
            )
        )

    @staticmethod
    def update_application(
        db: Session,
        application_id: UUID,
        application_data:
            UnderwritingApplicationUpdate,
    ):
        application = (
            UnderwritingApplicationService
            .get_application(
                db,
                application_id,
            )
        )

        updates = (
            application_data.model_dump(
                exclude_unset=True,
            )
        )

        if "status" in updates:
            new_status = (
                UnderwritingApplicationService
                ._validate_status(
                    updates["status"],
                )
            )

            current_status = (
                UnderwritingApplicationService
                ._normalize_status(
                    application.status,
                )
            )

            if (
                new_status != current_status
                and new_status
                not in ALLOWED_STATUS_TRANSITIONS.get(
                    current_status,
                    set(),
                )
            ):
                raise HTTPException(
                    status_code=
                        status.HTTP_409_CONFLICT,
                    detail=(
                        "Invalid underwriting "
                        f"status transition: "
                        f"{current_status} -> "
                        f"{new_status}."
                    ),
                )

            updates["status"] = new_status

            if (
                new_status in FINAL_STATUSES
                and "reviewed_at"
                not in updates
            ):
                updates["reviewed_at"] = (
                    datetime.now(
                        timezone.utc,
                    )
                )

        effective_status = (
            updates.get(
                "status",
                application.status,
            )
        )

        normalized_effective_status = (
            UnderwritingApplicationService
            ._normalize_status(
                effective_status,
            )
        )

        effective_decision = (
            updates.get(
                "decision",
                application.decision,
            )
        )

        effective_rationale = (
            updates.get(
                "decision_rationale",
                application.decision_rationale,
            )
        )

        if (
            normalized_effective_status
            in FINAL_STATUSES
        ):
            if not effective_decision:
                raise HTTPException(
                    status_code=
                        status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=(
                        "A final underwriting "
                        "decision is required."
                    ),
                )

            if not effective_rationale:
                raise HTTPException(
                    status_code=
                        status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=(
                        "Decision rationale is required "
                        "for final underwriting decisions."
                    ),
                )

        normalized_update = (
            UnderwritingApplicationUpdate(
                **updates,
            )
        )

        try:
            return (
                UnderwritingApplicationRepository
                .update(
                    db,
                    application,
                    normalized_update,
                )
            )

        except IntegrityError as exc:
            db.rollback()

            raise HTTPException(
                status_code=
                    status.HTTP_409_CONFLICT,
                detail=(
                    "Underwriting application "
                    "update conflicts with "
                    "existing data."
                ),
            ) from exc

    @staticmethod
    def delete_application(
        db: Session,
        application_id: UUID,
    ) -> None:
        application = (
            UnderwritingApplicationService
            .get_application(
                db,
                application_id,
            )
        )

        (
            UnderwritingApplicationRepository
            .delete(
                db,
                application,
            )
        )