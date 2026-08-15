from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings


def normalize_database_url(database_url: str) -> str:
    """
    Normalize PostgreSQL connection URLs for SQLAlchemy.

    Render provides PostgreSQL URLs using the standard
    'postgresql://' scheme. MediVantage uses Psycopg 3,
    so SQLAlchemy must explicitly use the 'psycopg' driver.
    """

    if database_url.startswith("postgresql://"):
        return database_url.replace(
            "postgresql://",
            "postgresql+psycopg://",
            1,
        )

    return database_url


database_url = normalize_database_url(
    settings.database_url,
)


engine = create_engine(
    database_url,
    pool_pre_ping=True,
)


SessionLocal = sessionmaker(
    bind=engine,
    class_=Session,
    autoflush=False,
    autocommit=False,
    expire_on_commit=False,
)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()