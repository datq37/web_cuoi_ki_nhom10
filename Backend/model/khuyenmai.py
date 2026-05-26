from datetime import date

from sqlalchemy import Date, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class KhuyenMai(Base):
    """Bảng khuyenmai — khuyến mãi."""

    __tablename__ = "khuyenmai"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True, nullable=False)
    ten: Mapped[str | None] = mapped_column(String, nullable=True)
    hansudung: Mapped[date | None] = mapped_column(Date, nullable=True)
