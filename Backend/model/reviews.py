from datetime import datetime

from sqlalchemy import DateTime, Integer, String, Text, ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class Review(Base):
    """Bảng reviews — đánh giá món ăn."""

    __tablename__ = "reviews"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True, nullable=False)
    user_id: Mapped[str | None] = mapped_column(String, nullable=True)
    menu_item_id: Mapped[str | None] = mapped_column(String, nullable=True)
    rating: Mapped[int | None] = mapped_column(Integer, nullable=True)
    comment: Mapped[str | None] = mapped_column("comment", Text, nullable=True)
    created_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    images: Mapped[list[str] | None] = mapped_column(ARRAY(Text), nullable=True)
    admin_reply: Mapped[str | None] = mapped_column(Text, nullable=True)
    admin_reply_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    # Quan hệ động sang bảng khách hàng
    khachhang: Mapped["KhachHang"] = relationship(
        "KhachHang",
        primaryjoin="Review.user_id == KhachHang.makh",
        foreign_keys=[user_id],
        lazy="joined"
    )
    thucdon: Mapped["ThucDon"] = relationship(
        "ThucDon",
        primaryjoin="Review.menu_item_id == ThucDon.mamon",
        foreign_keys=[menu_item_id],
        lazy="joined",
    )
