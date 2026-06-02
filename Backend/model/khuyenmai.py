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
    ma: Mapped[str | None] = mapped_column(String, nullable=True)
    mota: Mapped[str | None] = mapped_column(String, nullable=True)
    loai: Mapped[str | None] = mapped_column(String, nullable=True)
    giatrigiam: Mapped[float | None] = mapped_column(Integer, nullable=True)
    dontooithieu: Mapped[float | None] = mapped_column(Integer, nullable=True)
    dadung: Mapped[int | None] = mapped_column(Integer, nullable=True, default=0)
    gioihan: Mapped[int | None] = mapped_column(Integer, nullable=True)
    trangthai: Mapped[str | None] = mapped_column(String, nullable=True)
    hoatdong: Mapped[bool | None] = mapped_column(Integer, nullable=True, default=1)

