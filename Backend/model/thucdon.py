from sqlalchemy import Boolean, Float, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship

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
    danhmucid: Mapped[int | None] = mapped_column(ForeignKey("danhmucmonan.id"), nullable=True)

    # Quan hệ N-1: Món ăn thuộc về một danh mục
    danhmuc: Mapped["DanhMucMonAn"] = relationship("DanhMucMonAn", back_populates="thucdons")

    # Quan hệ 1-N: Món ăn có nhiều định lượng nguyên liệu
    congthucs: Mapped[list["CongThuc"]] = relationship("CongThuc", back_populates="thucdon", cascade="all, delete-orphan")

    @property
    def nguyen_lieu(self):
        return [{"id": ct.mahang, "so_luong": ct.dinhluong} for ct in self.congthucs]
