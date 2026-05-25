"""Tạo tài khoản Admin đầu tiên. Chạy từ thư mục Backend: python scripts/seed_admin.py"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from database import Base, SessionLocal, engine
from crud import user as user_crud
from model.user import User, RefreshToken  # noqa: F401
from model.user import UserRole
from service.auth import get_password_hash

ADMIN_EMAIL = "admin@cangtin.local"
ADMIN_PASSWORD = "Admin@123"
ADMIN_NAME = "Quản trị viên"


def main() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if user_crud.get_user_by_email(db, ADMIN_EMAIL):
            print(f"Admin đã tồn tại: {ADMIN_EMAIL}")
            return
        user_crud.create_user(
            db,
            email=ADMIN_EMAIL,
            hashed_password=get_password_hash(ADMIN_PASSWORD),
            full_name=ADMIN_NAME,
            role=UserRole.ADMIN,
        )
        print(f"Đã tạo Admin: {ADMIN_EMAIL} / {ADMIN_PASSWORD}")
    finally:
        db.close()


if __name__ == "__main__":
    main()
