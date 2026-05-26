from datetime import date

from pydantic import BaseModel, ConfigDict


class DailyMenuBase(BaseModel):
    serve_date: date | None = None
    menu_item_id: int | None = None


class DailyMenuCreate(DailyMenuBase):
    pass


class DailyMenuUpdate(BaseModel):
    serve_date: date | None = None
    menu_item_id: int | None = None


class DailyMenuResponse(DailyMenuBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class DailyMenuListResponse(BaseModel):
    date: date
    items: list[DailyMenuResponse]
