import os
from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

# Chuỗi kết nối PostgreSQL — ưu tiên biến môi trường DATABASE_URL
DATABASE_URL: str = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:123456 @localhost:5432/canteen_db",
)

# Engine kết nối tới PostgreSQL
engine = create_engine(DATABASE_URL, pool_pre_ping=True)

# Factory tạo session cho mỗi request
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    """Lớp cơ sở — tất cả model SQLAlchemy kế thừa từ đây."""

    pass


def get_db() -> Generator[Session, None, None]:
    """
    Dependency FastAPI: cung cấp session DB và đảm bảo đóng sau request.
    Dùng: db: Session = Depends(get_db)
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
