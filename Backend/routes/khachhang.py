from typing import Annotated

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from crud import khachhang as khachhang_crud
from database import get_db
from dependencies import get_current_active_admin, get_current_user
from model.khachhang import KhachHang
from schemas.khachhang import (
    KhachHangCreate,
    KhachHangListResponse,
    KhachHangResponse,
    KhachHangUpdate,
    ProfileUpdate,
)
from service import khachhang as khachhang_service

router = APIRouter(prefix="/khachhang", tags=["Khách hàng"])


@router.get("/me", response_model=KhachHangResponse)
def get_me(current_user: Annotated[KhachHang, Depends(get_current_user)]):
    """Xem hồ sơ cá nhân."""
    return current_user


@router.patch("/me", response_model=KhachHangResponse)
def update_me(
    data: ProfileUpdate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[KhachHang, Depends(get_current_user)],
):
    """Cập nhật hồ sơ cá nhân."""
    return khachhang_service.update_profile(db, current_user, data)


@router.get("", response_model=KhachHangListResponse)
def list_khachhang(
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[KhachHang, Depends(get_current_active_admin)],
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    vaitro: str | None = Query(None, description="Lọc theo vai trò"),
):
    """Admin: danh sách tài khoản khách hàng."""
    skip = (page - 1) * page_size
    khachhangs, total = khachhang_crud.get_khachhangs(db, skip=skip, limit=page_size, vaitro=vaitro)
    return KhachHangListResponse(items=khachhangs, total=total, page=page, page_size=page_size)


@router.get("/{makh}", response_model=KhachHangResponse)
def get_khachhang(
    makh: str,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[KhachHang, Depends(get_current_active_admin)],
):
    """Admin: chi tiết tài khoản khách hàng."""
    return khachhang_service.get_khachhang_or_404(db, makh)


@router.post("", response_model=KhachHangResponse, status_code=status.HTTP_201_CREATED)
def create_khachhang(
    data: KhachHangCreate,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[KhachHang, Depends(get_current_active_admin)],
):
    """Admin: tạo tài khoản khách hàng mới."""
    return khachhang_service.create_khachhang_admin(db, data)


@router.patch("/{makh}", response_model=KhachHangResponse)
def update_khachhang(
    makh: str,
    data: KhachHangUpdate,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[KhachHang, Depends(get_current_active_admin)],
):
    """Admin: cập nhật tài khoản khách hàng."""
    return khachhang_service.update_khachhang_admin(db, makh, data)


@router.delete("/{makh}", status_code=status.HTTP_204_NO_CONTENT)
def delete_khachhang(
    makh: str,
    db: Annotated[Session, Depends(get_db)],
    current_admin: Annotated[KhachHang, Depends(get_current_active_admin)],
):
    """Admin: xóa tài khoản khách hàng."""
    khachhang_service.delete_khachhang_admin(db, makh, current_admin)
