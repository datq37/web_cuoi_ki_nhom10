from datetime import date

from sqlalchemy import Date, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class DailyMenu(Base):
    """Bảng daily_menu — lịch phục vụ món theo ngày."""

    __tablename__ = "daily_menu"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True, nullable=False)
    serve_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    menu_item_id: Mapped[str | None] = mapped_column("menu_item_id", String, nullable=True)

    # Quan hệ N-1: Lịch ngày tham chiếu đến món ăn (ThucDon) - liên kết logic không tạo FK vật lý
    thucdon: Mapped["ThucDon"] = relationship(
        "ThucDon",
        primaryjoin="DailyMenu.menu_item_id == ThucDon.mamon",
        foreign_keys=[menu_item_id]
    )
