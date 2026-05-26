"""Tạo tài khoản Admin đầu tiên. Chạy từ thư mục Backend: python scripts/seed_admin.py"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from database import Base, SessionLocal, engine
from crud import khachhang as khachhang_crud
from service.auth import get_password_hash

ADMIN_TAIKHOAN = "admin"
ADMIN_PASSWORD = "Admin@123"
ADMIN_NAME = "Quản trị viên"


def main() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if khachhang_crud.get_khachhang_by_taikhoan(db, ADMIN_TAIKHOAN):
            print(f"Admin da ton tai: {ADMIN_TAIKHOAN}")
            return
        khachhang_crud.create_khachhang(
            db,
            taikhoan=ADMIN_TAIKHOAN,
            matkhau=get_password_hash(ADMIN_PASSWORD),
            ten=ADMIN_NAME,
            vaitro="Admin",
        )
        print(f"Da tao Admin: {ADMIN_TAIKHOAN} / {ADMIN_PASSWORD}")
    finally:
        db.close()


if __name__ == "__main__":
    main()
