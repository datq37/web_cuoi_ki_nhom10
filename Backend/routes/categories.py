import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from crud import category as category_crud
from database import get_db
from dependencies import get_current_active_admin, get_current_user
from model.khachhang import KhachHang
from schemas.danhmucmonan import (
    DanhMucMonAnCreate as CategoryCreate,
    DanhMucMonAnResponse as CategoryResponse,
    DanhMucMonAnUpdate as CategoryUpdate,
)
from service import menu as menu_service

router = APIRouter(prefix="/categories", tags=["Danh mục món ăn"])


@router.get("", response_model=list[CategoryResponse])
def list_categories(
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[KhachHang, Depends(get_current_user)],
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=200),
):
    """Xem danh sách danh mục — mọi user đã đăng nhập."""
    items, _ = category_crud.get_categories(db, skip=skip, limit=limit)
    return items


@router.get("/{category_id}", response_model=CategoryResponse)
def get_category(
    category_id: uuid.UUID,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[KhachHang, Depends(get_current_user)],
):
    return menu_service.get_category_or_404(db, category_id)


@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    data: CategoryCreate,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[KhachHang, Depends(get_current_active_admin)],
):
    """Admin: tạo danh mục."""
    return menu_service.create_category(db, data)


@router.patch("/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: uuid.UUID,
    data: CategoryUpdate,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[KhachHang, Depends(get_current_active_admin)],
):
    """Admin: cập nhật danh mục."""
    return menu_service.update_category(db, category_id, data)


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(
    category_id: uuid.UUID,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[KhachHang, Depends(get_current_active_admin)],
):
    """Admin: xóa danh mục."""
    menu_service.delete_category(db, category_id)
