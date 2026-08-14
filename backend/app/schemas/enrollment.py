from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, model_validator


class EnrollmentBase(BaseModel):
    member_id: UUID
    health_plan_id: UUID

    policy_number: str = Field(min_length=3, max_length=100)

    enrollment_type: str = Field(
        default="individual",
        min_length=2,
        max_length=50,
    )

    relationship_to_subscriber: str = Field(
        default="self",
        min_length=2,
        max_length=50,
    )

    subscriber_member_id: UUID | None = None

    group_number: str | None = Field(
        default=None,
        max_length=100,
    )

    employer_name: str | None = Field(
        default=None,
        max_length=255,
    )

    coverage_start_date: date
    coverage_end_date: date | None = None

    enrollment_status: str = Field(
        default="active",
        min_length=2,
        max_length=50,
    )

    termination_reason: str | None = Field(
        default=None,
        max_length=255,
    )

    is_primary: bool = True
    is_active: bool = True

    @model_validator(mode="after")
    def validate_coverage_dates(self) -> "EnrollmentBase":
        if (
            self.coverage_end_date is not None
            and self.coverage_end_date < self.coverage_start_date
        ):
            raise ValueError(
                "Coverage end date cannot be earlier than coverage start date."
            )

        return self

    @model_validator(mode="after")
    def validate_subscriber_relationship(self) -> "EnrollmentBase":
        if (
            self.relationship_to_subscriber.lower() != "self"
            and self.subscriber_member_id is None
        ):
            raise ValueError(
                "Subscriber member ID is required for dependent enrollments."
            )

        return self


class EnrollmentCreate(EnrollmentBase):
    pass


class EnrollmentUpdate(BaseModel):
    health_plan_id: UUID | None = None

    enrollment_type: str | None = Field(
        default=None,
        min_length=2,
        max_length=50,
    )

    relationship_to_subscriber: str | None = Field(
        default=None,
        min_length=2,
        max_length=50,
    )

    subscriber_member_id: UUID | None = None

    group_number: str | None = Field(
        default=None,
        max_length=100,
    )

    employer_name: str | None = Field(
        default=None,
        max_length=255,
    )

    coverage_start_date: date | None = None
    coverage_end_date: date | None = None

    enrollment_status: str | None = Field(
        default=None,
        min_length=2,
        max_length=50,
    )

    termination_reason: str | None = Field(
        default=None,
        max_length=255,
    )

    is_primary: bool | None = None
    is_active: bool | None = None


class EnrollmentResponse(EnrollmentBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    created_at: datetime
    updated_at: datetime