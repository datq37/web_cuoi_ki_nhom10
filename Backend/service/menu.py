from datetime import date
from fastapi import HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from crud import category as category_crud
from crud import menu as menu_crud
from model.danhmucmonan import DanhMucMonAn as Category
from model.daily_menu import DailyMenu
from model.thucdon import ThucDon as MenuItem
from schemas.danhmucmonan import DanhMucMonAnCreate as CategoryCreate, DanhMucMonAnUpdate as CategoryUpdate
from schemas.daily_menu import DailyMenuCreate
from schemas.thucdon import ThucDonCreate as MenuItemCreate, ThucDonUpdate as MenuItemUpdate
from service.upload import save_menu_item_image


# --- Category ---


def get_category_or_404(db: Session, category_id: int) -> Category:
    """Lấy danh mục hoặc trả về lỗi 404."""
    category = category_crud.get_category_by_id(db, category_id)
    if not category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy danh mục")
    return category


def create_category(db: Session, data: CategoryCreate) -> Category:
    """Tạo danh mục mới."""
    if category_crud.get_category_by_name(db, data.name):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Tên danh mục đã tồn tại")
    return category_crud.create_category(db, data)


def update_category(db: Session, category_id: int, data: CategoryUpdate) -> Category:
    """Cập nhật danh mục."""
    category = get_category_or_404(db, category_id)
    if data.name and data.name != category.name:
        existing = category_crud.get_category_by_name(db, data.name)
        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Tên danh mục đã tồn tại")
    return category_crud.update_category(db, category, data)


def delete_category(db: Session, category_id: int) -> None:
    """Xóa danh mục, báo lỗi nếu còn món ăn trực thuộc."""
    category = get_category_or_404(db, category_id)
    if category.thucdons:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Không thể xóa danh mục đang có món ăn",
        )
    category_crud.delete_category(db, category)


# --- Menu item (Món ăn) ---


def get_menu_item_or_404(db: Session, mamon: str) -> MenuItem:
    """Lấy thông tin món ăn hoặc trả về 404."""
    item = menu_crud.get_menu_item_by_id(db, mamon)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy món ăn")
    return item


def create_menu_item(db: Session, data: MenuItemCreate) -> MenuItem:
    """Tạo món ăn mới và kiểm tra tính hợp lệ của danh mục."""
    if data.danhmucid:
        get_category_or_404(db, data.danhmucid)
    return menu_crud.create_menu_item(db, data)


def update_menu_item(db: Session, mamon: str, data: MenuItemUpdate) -> MenuItem:
    """Cập nhật thông tin món ăn."""
    item = get_menu_item_or_404(db, mamon)
    if data.danhmucid:
        get_category_or_404(db, data.danhmucid)
    return menu_crud.update_menu_item(db, item, data)


def delete_menu_item(db: Session, mamon: str) -> None:
    """Xóa món ăn."""
    item = get_menu_item_or_404(db, mamon)
    menu_crud.delete_menu_item(db, item)


def toggle_menu_item(db: Session, mamon: str) -> MenuItem:
    """Đảo trạng thái hết hàng của món ăn."""
    item = get_menu_item_or_404(db, mamon)
    return menu_crud.toggle_menu_item_status(db, item)


async def upload_menu_item_image(db: Session, mamon: str, file: UploadFile) -> MenuItem:
    """Upload ảnh món ăn và cập nhật đường dẫn vào database."""
    item = get_menu_item_or_404(db, mamon)
    image_url = await save_menu_item_image(file)
    return menu_crud.update_menu_item_image(db, item, image_url)


# --- Daily menu ---


def add_to_daily_menu(db: Session, data: DailyMenuCreate) -> DailyMenu:
    """Thêm món vào lịch phục vụ ngày."""
    get_menu_item_or_404(db, data.menu_item_id)
    if menu_crud.get_daily_menu_entry_by_date_item(db, data.serve_date, data.menu_item_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Món đã có trong lịch thực đơn ngày này",
        )
    return menu_crud.add_daily_menu_item(db, data)


def get_daily_menu_for_date(db: Session, menu_date: date) -> list[DailyMenu]:
    """Xem thực đơn phục vụ của một ngày."""
    return menu_crud.get_daily_menu_by_date(db, menu_date)


def remove_from_daily_menu(db: Session, entry_id: int) -> None:
    """Xóa món khỏi lịch phục vụ ngày."""
    entry = menu_crud.get_daily_menu_entry(db, entry_id)
    if not entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy lịch thực đơn")
    menu_crud.delete_daily_menu_entry(db, entry)
