from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class MemberBase(BaseModel):
    member_number: str = Field(min_length=3, max_length=50)
    national_id: str | None = Field(default=None, max_length=50)

    first_name: str = Field(min_length=1, max_length=100)
    middle_name: str | None = Field(default=None, max_length=100)
    last_name: str = Field(min_length=1, max_length=100)

    date_of_birth: date
    gender: str = Field(min_length=1, max_length=30)

    email: EmailStr | None = None
    phone: str | None = Field(default=None, max_length=50)

    city: str | None = Field(default=None, max_length=100)
    region: str | None = Field(default=None, max_length=100)
    country: str = Field(default="Saudi Arabia", max_length=100)

    enrollment_status: str = Field(
        default="active",
        max_length=50,
    )

    is_active: bool = True


class MemberCreate(MemberBase):
    pass


class MemberUpdate(BaseModel):
    national_id: str | None = Field(default=None, max_length=50)

    first_name: str | None = Field(
        default=None,
        min_length=1,
        max_length=100,
    )
    middle_name: str | None = Field(default=None, max_length=100)
    last_name: str | None = Field(
        default=None,
        min_length=1,
        max_length=100,
    )

    date_of_birth: date | None = None
    gender: str | None = Field(default=None, max_length=30)

    email: EmailStr | None = None
    phone: str | None = Field(default=None, max_length=50)

    city: str | None = Field(default=None, max_length=100)
    region: str | None = Field(default=None, max_length=100)
    country: str | None = Field(default=None, max_length=100)

    enrollment_status: str | None = Field(
        default=None,
        max_length=50,
    )

    is_active: bool | None = None


class MemberResponse(MemberBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    created_at: datetime
    updated_at: datetime