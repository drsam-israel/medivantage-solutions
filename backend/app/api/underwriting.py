from uuid import UUID

from fastapi import (
    APIRouter,
    Depends,
    Query,
    Response,
    status,
)
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.schemas.underwriting_application import (
    UnderwritingApplicationCreate,
    UnderwritingApplicationResponse,
    UnderwritingApplicationUpdate,
)
from app.services.underwriting_application import (
    UnderwritingApplicationService,
)


router = APIRouter(
    prefix="/underwriting",
    tags=["Medical Underwriting"],
)


@router.post(
    "",
    response_model=UnderwritingApplicationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_underwriting_application(
    application_data: UnderwritingApplicationCreate,
    db: Session = Depends(get_db),
) -> UnderwritingApplicationResponse:
    return (
        UnderwritingApplicationService
        .create_application(
            db,
            application_data,
        )
    )


@router.get(
    "",
    response_model=list[
        UnderwritingApplicationResponse
    ],
)
def list_underwriting_applications(
    skip: int = Query(
        default=0,
        ge=0,
    ),
    limit: int = Query(
        default=100,
        ge=1,
        le=500,
    ),
    member_id: UUID | None = None,
    application_status: str | None = None,
    assigned_underwriter: str | None = None,
    db: Session = Depends(get_db),
) -> list[UnderwritingApplicationResponse]:
    return (
        UnderwritingApplicationService
        .list_applications(
            db=db,
            skip=skip,
            limit=limit,
            member_id=member_id,
            application_status=
                application_status,
            assigned_underwriter=
                assigned_underwriter,
        )
    )


@router.get(
    "/number/{application_number}",
    response_model=
        UnderwritingApplicationResponse,
)
def get_underwriting_application_by_number(
    application_number: str,
    db: Session = Depends(get_db),
) -> UnderwritingApplicationResponse:
    return (
        UnderwritingApplicationService
        .get_application_by_number(
            db,
            application_number,
        )
    )


@router.get(
    "/{application_id}",
    response_model=
        UnderwritingApplicationResponse,
)
def get_underwriting_application(
    application_id: UUID,
    db: Session = Depends(get_db),
) -> UnderwritingApplicationResponse:
    return (
        UnderwritingApplicationService
        .get_application(
            db,
            application_id,
        )
    )


@router.patch(
    "/{application_id}",
    response_model=
        UnderwritingApplicationResponse,
)
def update_underwriting_application(
    application_id: UUID,
    application_data:
        UnderwritingApplicationUpdate,
    db: Session = Depends(get_db),
) -> UnderwritingApplicationResponse:
    return (
        UnderwritingApplicationService
        .update_application(
            db,
            application_id,
            application_data,
        )
    )


@router.delete(
    "/{application_id}",
    status_code=
        status.HTTP_204_NO_CONTENT,
)
def delete_underwriting_application(
    application_id: UUID,
    db: Session = Depends(get_db),
) -> Response:
    (
        UnderwritingApplicationService
        .delete_application(
            db,
            application_id,
        )
    )

    return Response(
        status_code=
            status.HTTP_204_NO_CONTENT,
    )