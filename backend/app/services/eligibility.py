from datetime import date
from uuid import UUID

from sqlalchemy.orm import Session

from app.repositories.eligibility import EligibilityRepository
from app.repositories.member import MemberRepository
from app.repositories.provider import ProviderRepository
from app.schemas.eligibility import (
    EligibilityRequest,
    EligibilityResponse,
)


class EligibilityService:
    """
    Business logic for healthcare insurance eligibility verification.
    """

    ACTIVE_ENROLLMENT_STATUSES = {
        "active",
        "approved",
        "in_force",
    }

    @staticmethod
    def verify_eligibility(
        db: Session,
        request_data: EligibilityRequest,
    ) -> EligibilityResponse:
        member = MemberRepository.get_by_id(
            db,
            request_data.member_id,
        )

        if member is None:
            return EligibilityResponse(
                eligible=False,
                member_id=request_data.member_id,
                member_name="Unknown member",
                policy_number=None,
                plan_name=None,
                coverage_status="MEMBER_NOT_FOUND",
                effective_date=None,
                expiration_date=None,
                message="Member record was not found.",
            )

        member_name = EligibilityService._get_member_name(member)

        provider = ProviderRepository.get_by_id(
            db,
            request_data.provider_id,
        )

        if provider is None:
            return EligibilityResponse(
                eligible=False,
                member_id=member.id,
                member_name=member_name,
                policy_number=None,
                plan_name=None,
                coverage_status="PROVIDER_NOT_FOUND",
                effective_date=None,
                expiration_date=None,
                message="Provider record was not found.",
            )

        enrollment = (
            EligibilityRepository
            .get_member_enrollment_for_service_date(
                db=db,
                member_id=request_data.member_id,
                service_date=request_data.service_date,
            )
        )

        if enrollment is None:
            latest_enrollment = (
                EligibilityRepository.get_latest_member_enrollment(
                    db=db,
                    member_id=request_data.member_id,
                )
            )

            return EligibilityService._build_no_coverage_response(
                member_id=member.id,
                member_name=member_name,
                service_date=request_data.service_date,
                latest_enrollment=latest_enrollment,
            )

        health_plan = enrollment.health_plan

        if not enrollment.is_active:
            return EligibilityService._build_response(
                member_id=member.id,
                member_name=member_name,
                enrollment=enrollment,
                eligible=False,
                coverage_status="INACTIVE_ENROLLMENT",
                message="The member's enrollment is inactive.",
            )

        if (
            enrollment.enrollment_status.lower()
            not in EligibilityService.ACTIVE_ENROLLMENT_STATUSES
        ):
            return EligibilityService._build_response(
                member_id=member.id,
                member_name=member_name,
                enrollment=enrollment,
                eligible=False,
                coverage_status="ENROLLMENT_NOT_ACTIVE",
                message=(
                    "The enrollment status does not permit "
                    "eligibility."
                ),
            )

        if health_plan is None:
            return EligibilityService._build_response(
                member_id=member.id,
                member_name=member_name,
                enrollment=enrollment,
                eligible=False,
                coverage_status="HEALTH_PLAN_NOT_FOUND",
                message=(
                    "The enrollment is not linked to a valid "
                    "health plan."
                ),
            )

        if not health_plan.is_active:
            return EligibilityService._build_response(
                member_id=member.id,
                member_name=member_name,
                enrollment=enrollment,
                eligible=False,
                coverage_status="HEALTH_PLAN_INACTIVE",
                message="The member's health plan is inactive.",
            )

        if (
            health_plan.effective_date
            and request_data.service_date
            < health_plan.effective_date
        ):
            return EligibilityService._build_response(
                member_id=member.id,
                member_name=member_name,
                enrollment=enrollment,
                eligible=False,
                coverage_status="PLAN_NOT_YET_EFFECTIVE",
                message=(
                    "The health plan is not effective on the "
                    "requested service date."
                ),
            )

        if (
            health_plan.expiration_date
            and request_data.service_date
            > health_plan.expiration_date
        ):
            return EligibilityService._build_response(
                member_id=member.id,
                member_name=member_name,
                enrollment=enrollment,
                eligible=False,
                coverage_status="PLAN_EXPIRED",
                message=(
                    "The health plan expired before the requested "
                    "service date."
                ),
            )

        return EligibilityService._build_response(
            member_id=member.id,
            member_name=member_name,
            enrollment=enrollment,
            eligible=True,
            coverage_status="ACTIVE",
            message=(
                "Member is eligible for covered services on the "
                "requested service date."
            ),
        )

    @staticmethod
    def _build_no_coverage_response(
        member_id: UUID,
        member_name: str,
        service_date: date,
        latest_enrollment,
    ) -> EligibilityResponse:
        if latest_enrollment is None:
            return EligibilityResponse(
                eligible=False,
                member_id=member_id,
                member_name=member_name,
                policy_number=None,
                plan_name=None,
                coverage_status="NO_ENROLLMENT",
                effective_date=None,
                expiration_date=None,
                message="No enrollment was found for this member.",
            )

        if service_date < latest_enrollment.coverage_start_date:
            status_code = "COVERAGE_NOT_STARTED"
            message = (
                "Coverage had not started on the requested "
                "service date."
            )
        elif (
            latest_enrollment.coverage_end_date is not None
            and service_date
            > latest_enrollment.coverage_end_date
        ):
            status_code = "COVERAGE_EXPIRED"
            message = (
                "Coverage expired before the requested service "
                "date."
            )
        else:
            status_code = "NO_VALID_COVERAGE"
            message = (
                "No valid enrollment covers the requested "
                "service date."
            )

        return EligibilityService._build_response(
            member_id=member_id,
            member_name=member_name,
            enrollment=latest_enrollment,
            eligible=False,
            coverage_status=status_code,
            message=message,
        )

    @staticmethod
    def _build_response(
        member_id: UUID,
        member_name: str,
        enrollment,
        eligible: bool,
        coverage_status: str,
        message: str,
    ) -> EligibilityResponse:
        health_plan = enrollment.health_plan

        return EligibilityResponse(
            eligible=eligible,
            member_id=member_id,
            member_name=member_name,
            policy_number=enrollment.policy_number,
            plan_name=(
                health_plan.plan_name
                if health_plan is not None
                else None
            ),
            coverage_status=coverage_status,
            effective_date=enrollment.coverage_start_date,
            expiration_date=enrollment.coverage_end_date,
            message=message,
        )

    @staticmethod
    def _get_member_name(member) -> str:
        first_name = getattr(member, "first_name", "")
        last_name = getattr(member, "last_name", "")

        full_name = f"{first_name} {last_name}".strip()

        return full_name or "Member"