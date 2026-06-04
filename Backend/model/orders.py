from model.enums import OrderStatus, PaymentMethod
from sqlalchemy import Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class Order(Base):
    """Bảng orders — đơn hàng."""

    __tablename__ = "orders"

    id: Mapped[str] = mapped_column(String, primary_key=True, nullable=False)
    makh: Mapped[str | None] = mapped_column(ForeignKey("khachhang.makh"), nullable=True)
    tongtien: Mapped[float | None] = mapped_column(Float, nullable=True, default=0.0)
    # Các trạng thái: OrderStatus.CART, OrderStatus.PENDING_CONFIRMATION, OrderStatus.CONFIRMED, OrderStatus.PROCESSING, OrderStatus.DELIVERED, OrderStatus.CANCELLED
    trangthai: Mapped[str | None] = mapped_column(String, nullable=True, default="cart")
    thoigiandat: Mapped[str | None] = mapped_column(String, nullable=True)
    hinhthucthanhtoan: Mapped[str | None] = mapped_column(String, nullable=True)
    ghichu: Mapped[str | None] = mapped_column(String, nullable=True)

    # Thiết lập quan hệ
    khachhang: Mapped["KhachHang"] = relationship("KhachHang")
    chitiet: Mapped[list["OrderDetail"]] = relationship(
        "OrderDetail",
        back_populates="order",
        cascade="all, delete-orphan",
        lazy="joined"
    )
    payments: Mapped[list["Payment"]] = relationship(
        "Payment",
        back_populates="order",
        cascade="all, delete-orphan",
        lazy="select"
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
