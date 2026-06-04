from sqlalchemy import Integer, String, Boolean, Text
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
    # Thêm trường vai trò để phục vụ phân quyền (Admin / Nhân viên / Khách hàng)
    vaitro: Mapped[str | None] = mapped_column(String, nullable=True, default="Khách hàng")
    # Đồng bộ với cột is_active bool NULL DEFAULT true trong CSDL
    is_active: Mapped[bool | None] = mapped_column(Boolean, nullable=True, default=True)
    avatar: Mapped[str | None] = mapped_column(Text, nullable=True)
    phone: Mapped[str | None] = mapped_column(String, nullable=True)
    email: Mapped[str | None] = mapped_column(String, nullable=True)
    dept: Mapped[str | None] = mapped_column(String, nullable=True)
    building: Mapped[str | None] = mapped_column(String, nullable=True)
    floor: Mapped[str | None] = mapped_column(String, nullable=True)
    desk: Mapped[str | None] = mapped_column(String, nullable=True)
    points: Mapped[int | None] = mapped_column(Integer, nullable=False, default=0)
    total_spent: Mapped[int | None] = mapped_column(Integer, nullable=False, default=0)
