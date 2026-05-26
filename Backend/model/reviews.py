from datetime import datetime

from sqlalchemy import DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class Review(Base):
    """Bảng reviews — đánh giá món ăn."""

    __tablename__ = "reviews"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True, nullable=False)
    user_id: Mapped[str | None] = mapped_column(String, nullable=True)
    menu_item_id: Mapped[str | None] = mapped_column(String, nullable=True)
    rating: Mapped[int | None] = mapped_column(Integer, nullable=True)
    comment: Mapped[str | None] = mapped_column("comment", Text, nullable=True)
    created_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
