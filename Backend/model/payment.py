from datetime import datetime
from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class Payment(Base):
    """Bảng payments — quản lý thanh toán đơn hàng."""

    __tablename__ = "payments"

    id: Mapped[str] = mapped_column(String, primary_key=True, nullable=False)
    order_id: Mapped[str | None] = mapped_column(ForeignKey("orders.id", ondelete="CASCADE"), nullable=True)
    method: Mapped[str | None] = mapped_column(String, nullable=True) # CASH, BANKING
    status: Mapped[str | None] = mapped_column(String, nullable=True, default="PENDING") # PENDING, PAID, CANCELLED
    created_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True, default=datetime.now)

    # Thiết lập quan hệ với bảng orders
    order: Mapped["Order"] = relationship("Order", back_populates="payments", lazy="joined")

    @property
    def tongtien(self) -> float:
        """Thuộc tính tính tổng tiền động từ các chi tiết đơn hàng liên quan."""
        if self.order and hasattr(self.order, "chitiet"):
            return sum((item.gia or 0.0) * (item.soluong or 0) for item in self.order.chitiet)
        return 0.0
