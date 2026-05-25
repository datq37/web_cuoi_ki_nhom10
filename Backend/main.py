from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

import config
from database import Base, engine
from model.menu import Category, DailyMenu, MenuItem  # noqa: F401
from model.user import RefreshToken, User  # noqa: F401 — đăng ký metadata
from routes import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Tạo bảng khi khởi động (dev). Production nên dùng Alembic."""
    Base.metadata.create_all(bind=engine)
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
