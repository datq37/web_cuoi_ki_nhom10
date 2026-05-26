from datetime import date

from sqlalchemy import Date, Integer
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class DailyMenu(Base):
    """Bảng daily_menu — lịch phục vụ món theo ngày."""

    __tablename__ = "daily_menu"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True, nullable=False)
    serve_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    menu_item_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
