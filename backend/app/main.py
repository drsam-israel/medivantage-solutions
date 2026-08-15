from collections.abc import Sequence

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from app.api.ai_insights import router as ai_insight_router
from app.api.eligibility import router as eligibility_router
from app.api.enrollments import router as enrollment_router
from app.api.fraud_actions import router as fraud_action_router
from app.api.fraud_alerts import router as fraud_alert_router
from app.api.fraud_cases import router as fraud_case_router
from app.api.fraud_evidence import router as fraud_evidence_router
from app.api.fraud_investigator_notes import (
    router as fraud_investigator_note_router,
)
from app.api.fraud_recoveries import (
    router as fraud_recovery_router,
)
from app.api.fraud_timeline_events import (
    router as fraud_timeline_event_router,
)
from app.api.health_plans import router as health_plan_router
from app.api.members import router as member_router
from app.api.policies import router as policy_router
from app.api.providers import router as provider_router
from app.api.v1.router import api_router
from app.core.config import settings
from app.database.session import engine


def resolve_cors_origins(
    configured_origins: str | Sequence[str] | None,
) -> list[str]:
    """
    Normalize configured CORS origins and always include
    MediVantage development and production frontend URLs.
    """

    required_origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://medivantage-frontend.onrender.com",
    ]

    if configured_origins is None:
        return required_origins

    if isinstance(configured_origins, str):
        normalized_origins = [
            origin.strip()
            for origin in configured_origins.split(",")
            if origin.strip()
        ]
    else:
        normalized_origins = [
            str(origin).strip()
            for origin in configured_origins
            if str(origin).strip()
        ]

    return list(
        dict.fromkeys(
            [
                *normalized_origins,
                *required_origins,
            ],
        ),
    )


cors_origins = resolve_cors_origins(
    settings.cors_origins,
)


app = FastAPI(
    title=settings.app_name,
    description=(
        "Backend API for the AI-powered healthcare insurance "
        "intelligence platform."
    ),
    version=settings.app_version,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ------------------------------------------------------------------
# Existing API Routers
# ------------------------------------------------------------------

app.include_router(
    provider_router,
    prefix=settings.api_v1_prefix,
)

app.include_router(
    member_router,
    prefix=settings.api_v1_prefix,
)

app.include_router(
    health_plan_router,
    prefix=settings.api_v1_prefix,
)

app.include_router(
    enrollment_router,
    prefix=settings.api_v1_prefix,
)

app.include_router(
    eligibility_router,
    prefix=settings.api_v1_prefix,
)

app.include_router(
    policy_router,
    prefix=settings.api_v1_prefix,
)

app.include_router(
    fraud_case_router,
    prefix=settings.api_v1_prefix,
)

app.include_router(
    fraud_alert_router,
    prefix=settings.api_v1_prefix,
)

app.include_router(
    fraud_evidence_router,
    prefix=settings.api_v1_prefix,
)

app.include_router(
    fraud_investigator_note_router,
    prefix=settings.api_v1_prefix,
)

app.include_router(
    fraud_action_router,
    prefix=settings.api_v1_prefix,
)

app.include_router(
    fraud_recovery_router,
    prefix=settings.api_v1_prefix,
)

app.include_router(
    fraud_timeline_event_router,
    prefix=settings.api_v1_prefix,
)

app.include_router(
    ai_insight_router,
    prefix=settings.api_v1_prefix,
)


# ------------------------------------------------------------------
# Versioned API Router
# ------------------------------------------------------------------

app.include_router(
    api_router,
    prefix=settings.api_v1_prefix,
)


# ------------------------------------------------------------------
# Root Endpoint
# ------------------------------------------------------------------

@app.get("/")
def root() -> dict[str, str]:
    return {
        "product": "MediVantage Solutions",
        "message": (
            "Enterprise healthcare insurance API is operational."
        ),
    }


# ------------------------------------------------------------------
# Application Health Check
# ------------------------------------------------------------------

@app.get("/api/v1/health")
def health_check() -> dict[str, str]:
    return {
        "status": "healthy",
        "service": "medivantage-api",
        "version": settings.app_version,
    }


# ------------------------------------------------------------------
# Database Health Check
# ------------------------------------------------------------------

@app.get("/api/v1/health/database")
def database_health_check() -> dict[str, str]:
    try:
        with engine.connect() as connection:
            connection.execute(
                text("SELECT 1"),
            )

        return {
            "status": "healthy",
            "database": "postgresql",
            "connection": "successful",
        }

    except SQLAlchemyError:
        return {
            "status": "unhealthy",
            "database": "postgresql",
            "connection": "failed",
        }