from uuid import UUID

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.provider import Provider
from app.schemas.provider import ProviderCreate, ProviderUpdate


class ProviderRepository:
    """Database operations for healthcare providers."""

    @staticmethod
    def create(db: Session, provider_data: ProviderCreate) -> Provider:
        provider = Provider(**provider_data.model_dump())

        db.add(provider)

        try:
            db.commit()
            db.refresh(provider)
            return provider
        except IntegrityError:
            db.rollback()
            raise

    @staticmethod
    def get_by_id(db: Session, provider_id: UUID) -> Provider | None:
        return db.get(Provider, provider_id)

    @staticmethod
    def get_by_code(db: Session, provider_code: str) -> Provider | None:
        statement = select(Provider).where(
            Provider.provider_code == provider_code
        )
        return db.scalar(statement)

    @staticmethod
    def get_by_license_number(
        db: Session,
        license_number: str,
    ) -> Provider | None:
        statement = select(Provider).where(
            Provider.license_number == license_number
        )
        return db.scalar(statement)

    @staticmethod
    def list(
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
        statement = select(Provider)

        if provider_name:
            statement = statement.where(
                Provider.provider_name.ilike(f"%{provider_name}%")
            )

        if provider_type:
            statement = statement.where(
                Provider.provider_type == provider_type
            )

        if network_status:
            statement = statement.where(
                Provider.network_status == network_status
            )

        if city:
            statement = statement.where(
                Provider.city.ilike(f"%{city}%")
            )

        if is_active is not None:
            statement = statement.where(
                Provider.is_active == is_active
            )

        statement = (
            statement
            .order_by(Provider.provider_name.asc())
            .offset(skip)
            .limit(limit)
        )

        return list(db.scalars(statement).all())

    @staticmethod
    def update(
        db: Session,
        provider: Provider,
        provider_data: ProviderUpdate,
    ) -> Provider:
        update_values = provider_data.model_dump(exclude_unset=True)

        for field_name, field_value in update_values.items():
            setattr(provider, field_name, field_value)

        try:
            db.commit()
            db.refresh(provider)
            return provider
        except IntegrityError:
            db.rollback()
            raise

    @staticmethod
    def delete(db: Session, provider: Provider) -> None:
        db.delete(provider)
        db.commit()