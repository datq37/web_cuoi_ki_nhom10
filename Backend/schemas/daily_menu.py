from pydantic.alias_generators import to_camel
from datetime import date
from pydantic import BaseModel, ConfigDict, Field
from schemas.thucdon import ThucDonResponse


class DailyMenuBase(BaseModel):
    """Schema cơ sở lịch thực đơn theo ngày."""

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    serve_date: date | None = None
    menu_item_id: str | None = Field(default=None, description="Mã món ăn (mamon)")


class DailyMenuCreate(DailyMenuBase):
    """Schema thêm món vào lịch ngày."""

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    serve_date: date = Field(..., description="Ngày phục vụ (YYYY-MM-DD)")
    menu_item_id: str = Field(..., min_length=1, description="Mã món ăn (mamon)")


class DailyMenuUpdate(BaseModel):
    """Schema cập nhật lịch ngày."""

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    serve_date: date | None = None
    menu_item_id: str | None = None


class DailyMenuResponse(DailyMenuBase):
    """Schema phản hồi thông tin lịch ngày."""

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)

    id: int
    thucdon: ThucDonResponse | None = None


class DailyMenuListResponse(BaseModel):
    """Schema danh sách thực đơn theo ngày."""

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    date: date
    items: list[DailyMenuResponse]
