from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class KhachHang(Base):
    """Bảng khachhang — khách hàng / tài khoản đăng nhập."""

    __tablename__ = "khachhang"

    makh: Mapped[str] = mapped_column(String, primary_key=True, nullable=False)
    ten: Mapped[str | None] = mapped_column(String, nullable=True)
    tuoi: Mapped[int | None] = mapped_column(Integer, nullable=True)
    taikhoan: Mapped[str | None] = mapped_column(String, nullable=True)
    matkhau: Mapped[str | None] = mapped_column(String, nullable=True)
    lichsudathang: Mapped[str | None] = mapped_column(String, nullable=True)
