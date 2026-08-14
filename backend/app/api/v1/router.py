from fastapi import APIRouter

from app.api.claim_intelligence import (
    router as claim_intelligence_router,
)
from app.api.prior_authorizations import (
    router as prior_authorizations_router,
)
from app.api.reimbursements import (
    router as reimbursements_router,
)
from app.api.underwriting import (
    router as underwriting_router,
)
from app.api.v1.claims import (
    router as claims_router,
)


api_router = APIRouter()


api_router.include_router(
    claims_router,
)

api_router.include_router(
    claim_intelligence_router,
)

api_router.include_router(
    prior_authorizations_router,
)

api_router.include_router(
    reimbursements_router,
)

api_router.include_router(
    underwriting_router,
)