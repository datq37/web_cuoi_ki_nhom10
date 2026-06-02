from sqlalchemy import Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class NhanVien(Base):
    """Bảng nhanvien — nhân viên."""

    __tablename__ = "nhanvien"

    manv: Mapped[str] = mapped_column(String, primary_key=True, nullable=False)
    ten: Mapped[str | None] = mapped_column(String, nullable=True)
    tuoi: Mapped[int | None] = mapped_column(Integer, nullable=True)
    chucvu: Mapped[str | None] = mapped_column(String, nullable=True)
    luong: Mapped[float | None] = mapped_column(Float, nullable=True)
    email: Mapped[str | None] = mapped_column(String, nullable=True)
    sodienthoai: Mapped[str | None] = mapped_column(String, nullable=True)
    ngaybatdau: Mapped[str | None] = mapped_column(String, nullable=True)
    viettat: Mapped[str | None] = mapped_column(String, nullable=True)
    maunen: Mapped[str | None] = mapped_column(String, nullable=True)
    hoatdonggannhat: Mapped[str | None] = mapped_column(String, nullable=True)
