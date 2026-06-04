from sqlalchemy import Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class CongThuc(Base):
    """Bảng congthuc — định lượng nguyên liệu cho món ăn (Recipe)."""

    __tablename__ = "congthuc"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True, nullable=False)
    mamon: Mapped[str | None] = mapped_column(ForeignKey("thucdon.mamon", ondelete="CASCADE"), nullable=True)
    mahang: Mapped[str | None] = mapped_column(ForeignKey("khohang.mahang", ondelete="CASCADE"), nullable=True)
    dinhluong: Mapped[float | None] = mapped_column(Float, nullable=True, default=0.0)

    # Thiết lập quan hệ
    thucdon: Mapped["ThucDon"] = relationship("ThucDon", back_populates="congthucs")
    khohang: Mapped["KhoHang"] = relationship("KhoHang")
