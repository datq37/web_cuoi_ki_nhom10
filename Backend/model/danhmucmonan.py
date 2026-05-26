from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class DanhMucMonAn(Base):
    """Bảng danhmucmonan — danh mục món ăn."""

    __tablename__ = "danhmucmonan"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True, nullable=False)
    name: Mapped[str | None] = mapped_column("name", String(100), nullable=True)
