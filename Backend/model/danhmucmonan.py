from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class DanhMucMonAn(Base):
    """Bảng danhmucmonan — danh mục món ăn."""

    __tablename__ = "danhmucmonan"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True, nullable=False)
    name: Mapped[str | None] = mapped_column("name", String(100), nullable=True)
    image: Mapped[str | None] = mapped_column("image", String, nullable=True)

    # Quan hệ 1-N: Một danh mục có nhiều món ăn
    thucdons: Mapped[list["ThucDon"]] = relationship("ThucDon", back_populates="danhmuc", cascade="all, delete-orphan")
