from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_active_admin, get_current_user
from model.khachhang import KhachHang
from schemas.settings import AppSettings, OrderingStatus
from service import settings as settings_service

router = APIRouter(prefix="/settings", tags=["Cài đặt"])


@router.get("", response_model=AppSettings)
def get_settings(
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[KhachHang, Depends(get_current_user)],
):
    """Khách hàng/Admin: xem cấu hình căng tin."""
    return settings_service.read_settings(db)


@router.put("", response_model=AppSettings)
def update_settings(
    data: AppSettings,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[KhachHang, Depends(get_current_active_admin)],
):
    """Admin: cập nhật cấu hình căng tin."""
    return settings_service.write_settings(data.model_dump(mode="json"), db)


@router.get("/ordering-status", response_model=OrderingStatus)
def get_ordering_status(
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[KhachHang, Depends(get_current_user)],
):
    """Khách hàng/Admin: kiểm tra hiện tại có được đặt món không."""
    return settings_service.get_ordering_status(db)
