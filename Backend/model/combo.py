from datetime import date, datetime

from sqlalchemy import Date, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class Combo(Base):
    """Bảng combo - nhóm nhiều món với giá ưu đãi."""

    __tablename__ = "combo"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True, nullable=False)
    ten: Mapped[str] = mapped_column(String, nullable=False)
    mota: Mapped[str | None] = mapped_column(Text, nullable=True)
    loai_gia: Mapped[str] = mapped_column(String, nullable=False, default="phan_tram")
    gia_tri_giam: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    hansudung: Mapped[date | None] = mapped_column(Date, nullable=True)
    trangthai: Mapped[str] = mapped_column(String, nullable=False, default="dang_chay")
    hoatdong: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    created_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    mon_an: Mapped[list["ComboMonAn"]] = relationship(
        "ComboMonAn",
        back_populates="combo",
        cascade="all, delete-orphan",
    )


class ComboMonAn(Base):
    """Bảng chi tiết món ăn trong combo."""

    __tablename__ = "combo_mon_an"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True, nullable=False)
    combo_id: Mapped[int] = mapped_column(ForeignKey("combo.id", ondelete="CASCADE"), nullable=False)
    mamon: Mapped[str] = mapped_column(ForeignKey("thucdon.mamon", ondelete="RESTRICT"), nullable=False)
    soluong: Mapped[int] = mapped_column(Integer, nullable=False, default=1)

    combo: Mapped["Combo"] = relationship("Combo", back_populates="mon_an")
