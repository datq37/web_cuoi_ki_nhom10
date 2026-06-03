from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class CoSoVatChat(Base):
    """
    Bảng cosovatchat — SQL không khai báo PRIMARY KEY.
    Dùng `ten` làm khóa chính tạm cho ORM (cần đảm bảo `ten` unique trong dữ liệu thực tế).
    """

    __tablename__ = "cosovatchat"
    __mapper_args__ = {"primary_key": ["id"]}

    id: Mapped[str] = mapped_column(String, primary_key=True)
    ten: Mapped[str | None] = mapped_column(String, nullable=True)
    soluong: Mapped[str | None] = mapped_column(String, nullable=True)
    chatluong: Mapped[str | None] = mapped_column(String, nullable=True)
    danhmuc: Mapped[str | None] = mapped_column(String, nullable=True)
    ghichu: Mapped[str | None] = mapped_column(String, nullable=True)
