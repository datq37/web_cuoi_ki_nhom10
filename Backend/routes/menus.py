from datetime import date
from typing import Annotated

from fastapi import APIRouter, Depends, File, Query, UploadFile, status
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_active_admin, get_current_user
from model.khachhang import KhachHang
from schemas.daily_menu import (
    DailyMenuCreate,
    DailyMenuListResponse,
    DailyMenuResponse,
)
from schemas.thucdon import (
    ThucDonCreate as MenuItemCreate,
    ThucDonListResponse as MenuItemListResponse,
    ThucDonResponse as MenuItemResponse,
    ThucDonUpdate as MenuItemUpdate,
)
from service import menu as menu_service

router = APIRouter(prefix="/menus", tags=["Thực đơn"])


# --- Món ăn ---


@router.get("/items", response_model=MenuItemListResponse)
def list_menu_items(
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[KhachHang, Depends(get_current_user)],
    category_id: int | None = Query(None, description="Lọc theo ID danh mục (integer)"),
    hethang: bool | None = Query(None, description="Lọc theo trạng thái hết hàng (true/false)"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
):
    """Xem danh sách món ăn — yêu cầu đã đăng nhập."""
    from crud import menu as menu_crud

    items, total = menu_crud.get_menu_items(
        db, skip=skip, limit=limit, category_id=category_id, hethang=hethang
    )
    return MenuItemListResponse(items=items, total=total)


@router.get("/top-selling-today", response_model=MenuItemListResponse)
def get_top_selling_today(
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[KhachHang, Depends(get_current_user)],
    limit: int = Query(3, ge=1, le=12),
    date_str: str | None = Query(None, description="Ngày cần xem top món, format YYYY-MM-DD"),
):
    """Xem top món bán chạy trong ngày theo số lượng đã đặt."""
    from crud import menu as menu_crud

    items = menu_crud.get_top_selling_today(db, limit=limit, date_str=date_str)
    return MenuItemListResponse(items=items, total=len(items))


@router.get("/items/{mamon}", response_model=MenuItemResponse)
def get_menu_item(
    mamon: str,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[KhachHang, Depends(get_current_user)],
):
    """Xem thông tin chi tiết một món ăn — yêu cầu đã đăng nhập."""
    return menu_service.get_menu_item_or_404(db, mamon)


@router.post("/items", response_model=MenuItemResponse, status_code=status.HTTP_201_CREATED)
def create_menu_item(
    data: MenuItemCreate,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[KhachHang, Depends(get_current_active_admin)],
):
    """Admin: thêm món ăn mới."""
    return menu_service.create_menu_item(db, data)


@router.patch("/items/{mamon}", response_model=MenuItemResponse)
def update_menu_item(
    mamon: str,
    data: MenuItemUpdate,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[KhachHang, Depends(get_current_active_admin)],
):
    """Admin: cập nhật món ăn."""
    return menu_service.update_menu_item(db, mamon, data)


@router.delete("/items/{mamon}", status_code=status.HTTP_204_NO_CONTENT)
def delete_menu_item(
    mamon: str,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[KhachHang, Depends(get_current_active_admin)],
):
    """Admin: xóa món ăn."""
    menu_service.delete_menu_item(db, mamon)


@router.post("/items/{mamon}/upload-image", response_model=MenuItemResponse)
async def upload_menu_item_image(
    mamon: str,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[KhachHang, Depends(get_current_active_admin)],
    file: UploadFile = File(...),
):
    """Admin: upload ảnh món ăn (lưu trong thư mục uploads)."""
    return await menu_service.upload_menu_item_image(db, mamon, file)


@router.patch("/items/{mamon}/toggle-status", response_model=MenuItemResponse)
def toggle_menu_item_status(
    mamon: str,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[KhachHang, Depends(get_current_active_admin)],
):
    """Admin: bật/tắt món (đổi trạng thái hết hàng)."""
    return menu_service.toggle_menu_item(db, mamon)


# --- Lịch thực đơn theo ngày ---


@router.get("/daily", response_model=DailyMenuListResponse)
def get_daily_menu(
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[KhachHang, Depends(get_current_user)],
    menu_date: date = Query(..., description="Ngày cần xem thực đơn (YYYY-MM-DD)"),
):
    """Xem thực đơn phục vụ của một ngày — yêu cầu đã đăng nhập."""
    entries = menu_service.get_daily_menu_for_date(db, menu_date)
    return DailyMenuListResponse(date=menu_date, items=entries)


@router.post("/daily", response_model=DailyMenuResponse, status_code=status.HTTP_201_CREATED)
def add_daily_menu_item(
    data: DailyMenuCreate,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[KhachHang, Depends(get_current_active_admin)],
):
    """Admin: thêm món vào lịch phục vụ ngày."""
    return menu_service.add_to_daily_menu(db, data)


@router.delete("/daily/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_daily_menu_item(
    entry_id: int,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[KhachHang, Depends(get_current_active_admin)],
):
    """Admin: xóa món khỏi lịch ngày."""
    menu_service.remove_from_daily_menu(db, entry_id)
