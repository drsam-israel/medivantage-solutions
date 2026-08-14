from collections.abc import Generator

from sqlalchemy.orm import Session

from app.database.session import SessionLocal


def get_db() -> Generator[Session, None, None]:
    """Provide one database session per API request."""

    database = SessionLocal()

    try:
        yield database
    finally:
        database.close()