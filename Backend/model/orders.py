from sqlalchemy import Float, String
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class Order(Base):
    """
    Bảng orders — đơn hàng.
    SQL không có cột NOT NULL / PRIMARY KEY; dùng `id` làm khóa chính tạm cho ORM.
    """

    __tablename__ = "orders"
    __mapper_args__ = {"primary_key": ["id"]}

    id: Mapped[str | None] = mapped_column(String, nullable=True)
    makh: Mapped[str | None] = mapped_column(String, nullable=True)
    tongtien: Mapped[float | None] = mapped_column(Float, nullable=True)
    trangthai: Mapped[str | None] = mapped_column(String, nullable=True)
    thoigiandat: Mapped[str | None] = mapped_column(String, nullable=True)
    hinhthucthanhtoan: Mapped[str | None] = mapped_column(String, nullable=True)
