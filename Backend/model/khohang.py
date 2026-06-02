from sqlalchemy import Float, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class KhoHang(Base):
    """Bảng khohang — quản lý kho hàng."""

    __tablename__ = "khohang"

    mahang: Mapped[str] = mapped_column(String, primary_key=True, nullable=False)
    ten: Mapped[str | None] = mapped_column(String, nullable=True)
    soluong: Mapped[float | None] = mapped_column(Float, nullable=True)
    gianhap: Mapped[float | None] = mapped_column(Numeric, nullable=True)
    trangthai: Mapped[str | None] = mapped_column(String, nullable=True)
    donvi: Mapped[str | None] = mapped_column(String, nullable=True)
    nhacungcap: Mapped[str | None] = mapped_column(String, nullable=True)

