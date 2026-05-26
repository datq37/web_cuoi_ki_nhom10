from sqlalchemy import func, select
from sqlalchemy.orm import Session

from model.danhmucmonan import DanhMucMonAn as Category
from schemas.danhmucmonan import DanhMucMonAnCreate as CategoryCreate, DanhMucMonAnUpdate as CategoryUpdate


def get_category_by_id(db: Session, category_id: int) -> Category | None:
    """Lấy danh mục theo ID (integer)."""
    return db.get(Category, category_id)


def get_category_by_name(db: Session, name: str) -> Category | None:
    """Lấy danh mục theo tên."""
    stmt = select(Category).where(Category.name == name)
    return db.execute(stmt).scalar_one_or_none()


def get_categories(db: Session, *, skip: int = 0, limit: int = 100) -> tuple[list[Category], int]:
    """Lấy danh sách các danh mục phân trang."""
    stmt = select(Category)
    total = db.execute(select(func.count()).select_from(Category)).scalar_one()
    items = db.execute(stmt.order_by(Category.name).offset(skip).limit(limit)).scalars().all()
    return list(items), total


def create_category(db: Session, data: CategoryCreate) -> Category:
    """Tạo danh mục món ăn mới."""
    category = Category(name=data.name)
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


def update_category(db: Session, category: Category, data: CategoryUpdate) -> Category:
    """Cập nhật danh mục."""
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(category, field, value)
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


def delete_category(db: Session, category: Category) -> None:
    """Xóa danh mục."""
    db.delete(category)
    db.commit()
