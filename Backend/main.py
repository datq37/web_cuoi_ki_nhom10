from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import config
from database import Base, engine
from model.user import RefreshToken, User  # noqa: F401 — đăng ký metadata
from routes import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Tạo bảng khi khởi động (dev). Production nên dùng Alembic."""
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="API Quản lý Căng tin",
    description="Module Auth & Người dùng",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=config.API_V1_PREFIX)


@app.get("/health")
def health_check():
    return {"status": "ok"}
