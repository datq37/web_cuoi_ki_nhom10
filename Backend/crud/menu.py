from datetime import date, datetime
from sqlalchemy import func, select
from sqlalchemy.orm import Session, joinedload

from model.daily_menu import DailyMenu
from model.enums import OrderStatus
from model.orders import Order, OrderDetail
from model.thucdon import ThucDon as MenuItem
from schemas.daily_menu import DailyMenuCreate
from schemas.thucdon import ThucDonCreate as MenuItemCreate, ThucDonUpdate as MenuItemUpdate


def get_menu_item_by_id(db: Session, mamon: str) -> MenuItem | None:
    """Lấy món ăn theo mã món (mamon)."""
    stmt = (
        select(MenuItem)
        .options(joinedload(MenuItem.danhmuc))
        .where(MenuItem.mamon == mamon)
    )
    return db.execute(stmt).scalar_one_or_none()


def get_menu_items(
    db: Session,
    *,
    skip: int = 0,
    limit: int = 50,
    category_id: int | None = None,
    hethang: bool | None = None,
) -> tuple[list[MenuItem], int]:
    """Lấy danh sách món ăn, có phân trang và lọc theo danh mục, trạng thái hết hàng."""
    stmt = select(MenuItem).options(joinedload(MenuItem.danhmuc))
    count_stmt = select(func.count()).select_from(MenuItem)

    if category_id is not None:
        stmt = stmt.where(MenuItem.danhmucid == category_id)
        count_stmt = count_stmt.where(MenuItem.danhmucid == category_id)
    if hethang is not None:
        stmt = stmt.where(MenuItem.hethang == hethang)
        count_stmt = count_stmt.where(MenuItem.hethang == hethang)

    total = db.execute(count_stmt).scalar_one()
    items = db.execute(stmt.order_by(MenuItem.mamon.asc()).offset(skip).limit(limit)).scalars().all()
    return list(items), total


def get_top_selling_today(db: Session, *, limit: int = 3, date_str: str | None = None) -> list[MenuItem]:
    """Lấy top món bán chạy theo số lượng đã đặt trong ngày."""
    target_date = date_str or datetime.now().strftime("%Y-%m-%d")
    
    # 1. Truy vấn lấy danh sách mã món ăn bán chạy nhất trước để tránh lỗi GROUP BY trên PostgreSQL
    sold_qty = func.coalesce(func.sum(OrderDetail.soluong), 0).label("today_sold")
    id_stmt = (
        select(MenuItem.mamon, sold_qty)
        .join(OrderDetail, OrderDetail.mamon == MenuItem.mamon)
        .join(Order, Order.id == OrderDetail.order_id)
        .where(Order.thoigiandat.startswith(target_date))
        .where(Order.trangthai.notin_([OrderStatus.CART, OrderStatus.CANCELLED]))
        .group_by(MenuItem.mamon)
        .order_by(sold_qty.desc(), MenuItem.mamon.asc())
        .limit(limit)
    )
    
    id_results = db.execute(id_stmt).all()
    if not id_results:
        return []
        
    sold_map = {mamon: int(today_sold) for mamon, today_sold in id_results}
    mamon_ids = list(sold_map.keys())
    
    # 2. Truy vấn đầy đủ thông tin món ăn kèm danh mục liên quan của các món này
    fetch_stmt = (
        select(MenuItem)
        .options(joinedload(MenuItem.danhmuc))
        .where(MenuItem.mamon.in_(mamon_ids))
    )
    items_fetched = db.execute(fetch_stmt).scalars().all()
    
    # Cập nhật số lượng đã bán và sắp xếp lại theo đúng thứ tự bán chạy
    items_dict = {item.mamon: item for item in items_fetched}
    result_items = []
    for mamon_id in mamon_ids:
        if mamon_id in items_dict:
            item = items_dict[mamon_id]
            item.soluongdaban = sold_map[mamon_id]
            result_items.append(item)
            
    return result_items


def create_menu_item(db: Session, data: MenuItemCreate) -> MenuItem:
    """Tạo món ăn mới."""
    item = MenuItem(
        mamon=data.mamon,
        ten=data.ten,
        gia=data.gia,
        soluong=data.soluong,
        hinhanh=data.hinhanh,
        mieuta=data.mieuta,
        soluongdaban=data.soluongdaban or 0,
        hethang=data.hethang or False,
        tags=data.tags,
        danhmucid=data.danhmucid,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return get_menu_item_by_id(db, item.mamon)  # type: ignore[return-value]


def update_menu_item(db: Session, item: MenuItem, data: MenuItemUpdate) -> MenuItem:
    """Cập nhật thông tin món ăn."""
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(item, field, value)
    db.add(item)
    db.commit()
    db.refresh(item)
    return get_menu_item_by_id(db, item.mamon)  # type: ignore[return-value]


def delete_menu_item(db: Session, item: MenuItem) -> None:
    """Xóa món ăn."""
    db.delete(item)
    db.commit()


def toggle_menu_item_status(db: Session, item: MenuItem) -> MenuItem:
    """Đảo trạng thái hết hàng (hethang)."""
    item.hethang = not item.hethang
    db.add(item)
    db.commit()
    db.refresh(item)
    return get_menu_item_by_id(db, item.mamon)  # type: ignore[return-value]


def update_menu_item_image(db: Session, item: MenuItem, image_url: str) -> MenuItem:
    """Cập nhật đường dẫn ảnh món ăn."""
    item.hinhanh = image_url
    db.add(item)
    db.commit()
    db.refresh(item)
    return get_menu_item_by_id(db, item.mamon)  # type: ignore[return-value]


# --- Daily menu ---


def get_daily_menu_entry(db: Session, entry_id: int) -> DailyMenu | None:
    """Lấy thông tin một lịch phục vụ món theo ID lịch."""
    stmt = (
        select(DailyMenu)
        .options(joinedload(DailyMenu.thucdon).joinedload(MenuItem.danhmuc))
        .where(DailyMenu.id == entry_id)
    )
    return db.execute(stmt).scalar_one_or_none()


def get_daily_menu_by_date(db: Session, menu_date: date) -> list[DailyMenu]:
    """Lấy toàn bộ món trong lịch của một ngày cụ thể."""
    stmt = (
        select(DailyMenu)
        .options(joinedload(DailyMenu.thucdon).joinedload(MenuItem.danhmuc))
        .where(DailyMenu.serve_date == menu_date)
        .order_by(DailyMenu.id.asc())
    )
    return list(db.execute(stmt).scalars().all())


def get_daily_menu_entry_by_date_item(
    db: Session, menu_date: date, menu_item_id: str
) -> DailyMenu | None:
    """Lấy thông tin lịch theo ngày và mã món."""
    stmt = select(DailyMenu).where(
        DailyMenu.serve_date == menu_date,
        DailyMenu.menu_item_id == menu_item_id,
    )
    return db.execute(stmt).scalar_one_or_none()


def add_daily_menu_item(db: Session, data: DailyMenuCreate) -> DailyMenu:
    """Thêm món vào lịch phục vụ ngày."""
    entry = DailyMenu(serve_date=data.serve_date, menu_item_id=data.menu_item_id)
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return get_daily_menu_entry(db, entry.id)  # type: ignore[return-value]


def delete_daily_menu_entry(db: Session, entry: DailyMenu) -> None:
    """Xóa một món ăn khỏi lịch ngày."""
    db.delete(entry)
    db.commit()
