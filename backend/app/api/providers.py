from uuid import UUID

from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.schemas.provider import (
    ProviderCreate,
    ProviderResponse,
    ProviderUpdate,
)
from app.services.provider import ProviderService

router = APIRouter(
    prefix="/providers",
    tags=["Providers"],
)


@router.post(
    "",
    response_model=ProviderResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_provider(
    provider: ProviderCreate,
    db: Session = Depends(get_db),
):
    return ProviderService.create_provider(db, provider)


@router.get(
    "",
    response_model=list[ProviderResponse],
)
def list_providers(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    provider_name: str | None = None,
    provider_type: str | None = None,
    network_status: str | None = None,
    city: str | None = None,
    is_active: bool | None = None,
    db: Session = Depends(get_db),
):
    return ProviderService.list_providers(
        db=db,
        skip=skip,
        limit=limit,
        provider_name=provider_name,
        provider_type=provider_type,
        network_status=network_status,
        city=city,
        is_active=is_active,
    )


@router.get(
    "/{provider_id}",
    response_model=ProviderResponse,
)
def get_provider(
    provider_id: UUID,
    db: Session = Depends(get_db),
):
    return ProviderService.get_provider(db, provider_id)


@router.put(
    "/{provider_id}",
    response_model=ProviderResponse,
)
def update_provider(
    provider_id: UUID,
    provider: ProviderUpdate,
    db: Session = Depends(get_db),
):
    return ProviderService.update_provider(
        db,
        provider_id,
        provider,
    )


@router.delete(
    "/{provider_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_provider(
    provider_id: UUID,
    db: Session = Depends(get_db),
):
    ProviderService.delete_provider(db, provider_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)