from sqlalchemy import Boolean, Float, Integer, String, Text
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class ThucDon(Base):
    """Bảng thucdon — món ăn / thực đơn."""

    __tablename__ = "thucdon"

    mamon: Mapped[str] = mapped_column(String, primary_key=True, nullable=False)
    ten: Mapped[str | None] = mapped_column(String, nullable=True)
    gia: Mapped[float | None] = mapped_column(Float, nullable=True)
    soluong: Mapped[int | None] = mapped_column(Integer, nullable=True)
    hinhanh: Mapped[str | None] = mapped_column(Text, nullable=True)
    mieuta: Mapped[str | None] = mapped_column(Text, nullable=True)
    soluongdaban: Mapped[int | None] = mapped_column(Integer, nullable=True)
    hethang: Mapped[bool | None] = mapped_column(Boolean, nullable=True, default=False, server_default="false")
    tags: Mapped[list[str] | None] = mapped_column(ARRAY(String), nullable=True)
    danhmucid: Mapped[int | None] = mapped_column(Integer, nullable=True)
