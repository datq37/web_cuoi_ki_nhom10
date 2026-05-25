import uuid
from datetime import date

from sqlalchemy import func, select
from sqlalchemy.orm import Session, joinedload

from model.menu import DailyMenu, MenuItem
from schemas.menu import DailyMenuCreate, MenuItemCreate, MenuItemUpdate


def get_menu_item_by_id(db: Session, item_id: uuid.UUID) -> MenuItem | None:
    stmt = (
        select(MenuItem)
        .options(joinedload(MenuItem.category))
        .where(MenuItem.id == item_id)
    )
    return db.execute(stmt).scalar_one_or_none()


def get_menu_items(
    db: Session,
    *,
    skip: int = 0,
    limit: int = 50,
    category_id: uuid.UUID | None = None,
    is_available: bool | None = None,
) -> tuple[list[MenuItem], int]:
    """Lấy danh sách món ăn, có thể lọc theo danh mục."""
    stmt = select(MenuItem).options(joinedload(MenuItem.category))
    count_stmt = select(func.count()).select_from(MenuItem)

    if category_id is not None:
        stmt = stmt.where(MenuItem.category_id == category_id)
        count_stmt = count_stmt.where(MenuItem.category_id == category_id)
    if is_available is not None:
        stmt = stmt.where(MenuItem.is_available == is_available)
        count_stmt = count_stmt.where(MenuItem.is_available == is_available)

    total = db.execute(count_stmt).scalar_one()
    items = db.execute(stmt.order_by(MenuItem.name).offset(skip).limit(limit)).scalars().all()
    return list(items), total


def create_menu_item(db: Session, data: MenuItemCreate) -> MenuItem:
    item = MenuItem(
        name=data.name,
        description=data.description,
        price=data.price,
        category_id=data.category_id,
        is_available=data.is_available,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return get_menu_item_by_id(db, item.id)  # type: ignore[return-value]


def update_menu_item(db: Session, item: MenuItem, data: MenuItemUpdate) -> MenuItem:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(item, field, value)
    db.add(item)
    db.commit()
    db.refresh(item)
    refreshed = get_menu_item_by_id(db, item.id)
    return refreshed  # type: ignore[return-value]


def delete_menu_item(db: Session, item: MenuItem) -> None:
    db.delete(item)
    db.commit()


def toggle_menu_item_status(db: Session, item: MenuItem) -> MenuItem:
    """Bật/tắt món ăn — đảo trạng thái is_available."""
    item.is_available = not item.is_available
    db.add(item)
    db.commit()
    db.refresh(item)
    refreshed = get_menu_item_by_id(db, item.id)
    return refreshed  # type: ignore[return-value]


def update_menu_item_image(db: Session, item: MenuItem, image_url: str) -> MenuItem:
    item.image_url = image_url
    db.add(item)
    db.commit()
    db.refresh(item)
    refreshed = get_menu_item_by_id(db, item.id)
    return refreshed  # type: ignore[return-value]


# --- Daily menu ---


def get_daily_menu_entry(db: Session, entry_id: uuid.UUID) -> DailyMenu | None:
    stmt = (
        select(DailyMenu)
        .options(joinedload(DailyMenu.menu_item).joinedload(MenuItem.category))
        .where(DailyMenu.id == entry_id)
    )
    return db.execute(stmt).scalar_one_or_none()


def get_daily_menu_by_date(db: Session, menu_date: date) -> list[DailyMenu]:
    """Lấy toàn bộ món trong lịch của một ngày."""
    stmt = (
        select(DailyMenu)
        .options(joinedload(DailyMenu.menu_item).joinedload(MenuItem.category))
        .where(DailyMenu.date == menu_date)
        .order_by(DailyMenu.created_at)
    )
    return list(db.execute(stmt).scalars().all())


def get_daily_menu_entry_by_date_item(
    db: Session, menu_date: date, menu_item_id: uuid.UUID
) -> DailyMenu | None:
    stmt = select(DailyMenu).where(
        DailyMenu.date == menu_date,
        DailyMenu.menu_item_id == menu_item_id,
    )
    return db.execute(stmt).scalar_one_or_none()


def add_daily_menu_item(db: Session, data: DailyMenuCreate) -> DailyMenu:
    entry = DailyMenu(date=data.date, menu_item_id=data.menu_item_id)
    db.add(entry)
    db.commit()
    db.refresh(entry)
    refreshed = get_daily_menu_entry(db, entry.id)
    return refreshed  # type: ignore[return-value]


def delete_daily_menu_entry(db: Session, entry: DailyMenu) -> None:
    db.delete(entry)
    db.commit()
