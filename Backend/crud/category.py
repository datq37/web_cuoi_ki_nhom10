import uuid

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from model.menu import Category
from schemas.category import CategoryCreate, CategoryUpdate


def get_category_by_id(db: Session, category_id: uuid.UUID) -> Category | None:
    return db.get(Category, category_id)


def get_category_by_name(db: Session, name: str) -> Category | None:
    stmt = select(Category).where(Category.name == name)
    return db.execute(stmt).scalar_one_or_none()


def get_categories(db: Session, *, skip: int = 0, limit: int = 100) -> tuple[list[Category], int]:
    stmt = select(Category)
    total = db.execute(select(func.count()).select_from(Category)).scalar_one()
    items = db.execute(stmt.order_by(Category.name).offset(skip).limit(limit)).scalars().all()
    return list(items), total


def create_category(db: Session, data: CategoryCreate) -> Category:
    category = Category(name=data.name, description=data.description)
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


def update_category(db: Session, category: Category, data: CategoryUpdate) -> Category:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(category, field, value)
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


def delete_category(db: Session, category: Category) -> None:
    db.delete(category)
    db.commit()
