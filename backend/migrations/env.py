from logging.config import fileConfig

from alembic import context
from sqlalchemy import engine_from_config, pool

from app.core.config import settings
from app.database.base import Base

# Import all SQLAlchemy models so they are registered
# in Base.metadata before Alembic autogenerate runs.
from app.models.claim import Claim  # noqa: F401
from app.models.claim_intelligence import (
    ClaimIntelligence,
)  # noqa: F401
from app.models.enrollment import Enrollment  # noqa: F401
from app.models.fraud_case import FraudCase  # noqa: F401
from app.models.fraud_alert import FraudAlert  # noqa: F401
from app.models.fraud_evidence import FraudEvidence  # noqa: F401
from app.models.fraud_investigator_note import FraudInvestigatorNote  # noqa: F401
from app.models.fraud_action import FraudAction  # noqa: F401
from app.models.fraud_recovery import FraudRecovery  # noqa: F401
from app.models.fraud_timeline_event import FraudTimelineEvent  # noqa: F401
from app.models.health_plan import HealthPlan  # noqa: F401
from app.models.member import Member  # noqa: F401
from app.models.prior_authorization import (
    PriorAuthorization,
)  # noqa: F401
from app.models.provider import Provider  # noqa: F401
from app.models.reimbursement import Reimbursement  # noqa: F401
from app.models.underwriting_application import (
    UnderwritingApplication,
)  # noqa: F401

from app.models.policy import Policy  # noqa: F401
config = context.config

from app.models.ai_insight import AIInsight  # noqa: F401


config.set_main_option(
    "sqlalchemy.url",
    settings.database_url,
)


if config.config_file_name is not None:
    fileConfig(config.config_file_name)


target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Run migrations without creating a live database connection."""

    url = config.get_main_option(
        "sqlalchemy.url",
    )

    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={
            "paramstyle": "named",
        },
        compare_type=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations using a live database connection."""

    connectable = engine_from_config(
        config.get_section(
            config.config_ini_section,
            {},
        ),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()