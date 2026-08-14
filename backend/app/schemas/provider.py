from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class ProviderBase(BaseModel):
    provider_code: str = Field(min_length=2, max_length=50)
    provider_name: str = Field(min_length=2, max_length=255)
    provider_type: str = Field(min_length=2, max_length=100)

    specialty: str | None = Field(default=None, max_length=150)
    license_number: str | None = Field(default=None, max_length=100)
    network_status: str = Field(default="in_network", max_length=50)

    email: EmailStr | None = None
    phone: str | None = Field(default=None, max_length=50)

    city: str | None = Field(default=None, max_length=100)
    region: str | None = Field(default=None, max_length=100)
    country: str = Field(default="Saudi Arabia", max_length=100)

    is_active: bool = True


class ProviderCreate(ProviderBase):
    pass


class ProviderUpdate(BaseModel):
    provider_name: str | None = Field(default=None, min_length=2, max_length=255)
    provider_type: str | None = Field(default=None, min_length=2, max_length=100)
    specialty: str | None = Field(default=None, max_length=150)
    license_number: str | None = Field(default=None, max_length=100)
    network_status: str | None = Field(default=None, max_length=50)

    email: EmailStr | None = None
    phone: str | None = Field(default=None, max_length=50)

    city: str | None = Field(default=None, max_length=100)
    region: str | None = Field(default=None, max_length=100)
    country: str | None = Field(default=None, max_length=100)

    is_active: bool | None = None


class ProviderResponse(ProviderBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    created_at: datetime
    updated_at: datetime