from sqlalchemy import Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class Order(Base):
    """Bảng orders — đơn hàng."""

    __tablename__ = "orders"

    id: Mapped[str] = mapped_column(String, primary_key=True, nullable=False)
    makh: Mapped[str | None] = mapped_column(ForeignKey("khachhang.makh"), nullable=True)
    tongtien: Mapped[float | None] = mapped_column(Float, nullable=True, default=0.0)
    # Các trạng thái: "Giỏ hàng", "Chờ xác nhận", "Đã xác nhận", "Đang xử lý", "Đã giao", "Đã hủy"
    trangthai: Mapped[str | None] = mapped_column(String, nullable=True, default="Giỏ hàng")
    thoigiandat: Mapped[str | None] = mapped_column(String, nullable=True)
    hinhthucthanhtoan: Mapped[str | None] = mapped_column(String, nullable=True)

    # Thiết lập quan hệ
    khachhang: Mapped["KhachHang"] = relationship("KhachHang")
    chitiet: Mapped[list["OrderDetail"]] = relationship(
        "OrderDetail",
        back_populates="order",
        cascade="all, delete-orphan",
        lazy="joined"
    )


class OrderDetail(Base):
    """Bảng chitietdonhang — chi tiết đơn hàng (các món ăn được chọn)."""

    __tablename__ = "chitietdonhang"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True, nullable=False)
    order_id: Mapped[str | None] = mapped_column(ForeignKey("orders.id", ondelete="CASCADE"), nullable=True)
    mamon: Mapped[str | None] = mapped_column(String, nullable=True)
    soluong: Mapped[int | None] = mapped_column(Integer, nullable=True, default=1)
    gia: Mapped[float | None] = mapped_column(Float, nullable=True)

    # Thiết lập quan hệ
    order: Mapped["Order"] = relationship("Order", back_populates="chitiet")
    thucdon: Mapped["ThucDon"] = relationship(
        "ThucDon",
        primaryjoin="OrderDetail.mamon == ThucDon.mamon",
        foreign_keys=[mamon],
        lazy="joined"
    )
