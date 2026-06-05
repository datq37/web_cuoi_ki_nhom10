from sqlalchemy import DateTime, String, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class CanteenSetting(Base):
    """Bảng canteen_settings — lưu cấu hình căng tin dạng JSON."""

    __tablename__ = "canteen_settings"

    key: Mapped[str] = mapped_column(String, primary_key=True, nullable=False)
    value: Mapped[dict | list] = mapped_column(JSONB, nullable=False)
    updated_at = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())
