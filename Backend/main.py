from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

import config
from database import Base, engine
from model import (  # noqa: F401 — đăng ký metadata theo schema.sql
    CoSoVatChat,
    Combo,
    ComboMonAn,
    DailyMenu,
    DanhMucMonAn,
    KhachHang,
    KhoHang,
    KhuyenMai,
    NhanVien,
    Order,
    ThucDon,
    Payment,
)
from routes import admin_orders, auth, categories, khachhang, menus, notification, orders, payments, report
from routes import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Tự động tạo các bảng còn thiếu (ví dụ: chitietdonhang) nếu chưa tồn tại
    Base.metadata.create_all(bind=engine)
    
    # Tạo tài khoản admin mặc định nếu chưa có
    from database import SessionLocal
    from crud.khachhang import get_khachhang_by_taikhoan, create_khachhang
    from service.auth import get_password_hash
    with SessionLocal() as db:
        admin_user = get_khachhang_by_taikhoan(db, "admin")
        if not admin_user:
            create_khachhang(
                db, 
                taikhoan="admin", 
                matkhau=get_password_hash("123456"), 
                ten="Quản trị viên", 
                vaitro="Admin"
            )
            
    yield


# Phục vụ file ảnh tĩnh từ thư mục uploads
upload_dir = Path(config.UPLOAD_DIR)
upload_dir.mkdir(parents=True, exist_ok=True)

app = FastAPI(
    title="API Quản lý Căng tin",
    description="Auth, User & Thực đơn (Menu)",
    version="1.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount(f"/{config.UPLOAD_DIR}", StaticFiles(directory=str(upload_dir)), name="uploads")
app.include_router(api_router, prefix=config.API_V1_PREFIX)


@app.get("/health")
def health_check():
    return {"status": "ok"}
