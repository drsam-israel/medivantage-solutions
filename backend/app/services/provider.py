from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.provider import Provider
from app.repositories.provider import ProviderRepository
from app.schemas.provider import (
    ProviderCreate,
    ProviderUpdate,
)


class ProviderService:
    """Business logic for healthcare provider management."""

    @staticmethod
    def create_provider(
        db: Session,
        provider_data: ProviderCreate,
    ) -> Provider:
        existing_provider = (
            ProviderRepository.get_by_code(
                db,
                provider_data.provider_code,
            )
        )

        if existing_provider:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    "A provider with this provider code "
                    "already exists."
                ),
            )

        if provider_data.license_number:
            existing_license = (
                ProviderRepository.get_by_license_number(
                    db,
                    provider_data.license_number,
                )
            )

            if existing_license:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=(
                        "A provider with this license number "
                        "already exists."
                    ),
                )

        try:
            return ProviderRepository.create(
                db,
                provider_data,
            )

        except IntegrityError as exc:
            db.rollback()

            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    "Provider could not be created because "
                    "a unique value already exists."
                ),
            ) from exc

    @staticmethod
    def get_provider(
        db: Session,
        provider_id: UUID,
    ) -> Provider:
        provider = ProviderRepository.get_by_id(
            db,
            provider_id,
        )

        if provider is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Provider not found.",
            )

        return provider

    @staticmethod
    def list_providers(
        db: Session,
        *,
        skip: int = 0,
        limit: int = 20,
        provider_name: str | None = None,
        provider_type: str | None = None,
        network_status: str | None = None,
        city: str | None = None,
        is_active: bool | None = None,
    ) -> list[Provider]:
        return ProviderRepository.list(
            db,
            skip=skip,
            limit=limit,
            provider_name=provider_name,
            provider_type=provider_type,
            network_status=network_status,
            city=city,
            is_active=is_active,
        )

    @staticmethod
    def update_provider(
        db: Session,
        provider_id: UUID,
        provider_data: ProviderUpdate,
    ) -> Provider:
        provider = (
            ProviderService.get_provider(
                db,
                provider_id,
            )
        )

        if provider_data.license_number:
            existing_license = (
                ProviderRepository.get_by_license_number(
                    db,
                    provider_data.license_number,
                )
            )

            if (
                existing_license
                and existing_license.id
                != provider.id
            ):
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=(
                        "A provider with this license number "
                        "already exists."
                    ),
                )

        try:
            return ProviderRepository.update(
                db,
                provider,
                provider_data,
            )

        except IntegrityError as exc:
            db.rollback()

            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    "Provider could not be updated because "
                    "a unique value already exists."
                ),
            ) from exc

    @staticmethod
    def delete_provider(
        db: Session,
        provider_id: UUID,
    ) -> None:
        provider = (
            ProviderService.get_provider(
                db,
                provider_id,
            )
        )

        ProviderRepository.delete(
            db,
            provider,
        )