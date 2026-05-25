import uuid
from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

from schemas.category import CategoryResponse


class MenuItemCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: str | None = None
    price: Decimal = Field(..., gt=0)
    category_id: uuid.UUID
    is_available: bool = True


class MenuItemUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = None
    price: Decimal | None = Field(default=None, gt=0)
    category_id: uuid.UUID | None = None
    is_available: bool | None = None


class MenuItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    description: str | None
    price: Decimal
    image_url: str | None
    is_available: bool
    category_id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    category: CategoryResponse | None = None


class MenuItemListResponse(BaseModel):
    items: list[MenuItemResponse]
    total: int


class DailyMenuCreate(BaseModel):
    date: date
    menu_item_id: uuid.UUID


class DailyMenuResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    date: date
    menu_item_id: uuid.UUID
    created_at: datetime
    menu_item: MenuItemResponse | None = None


class DailyMenuListResponse(BaseModel):
    date: date
    items: list[DailyMenuResponse]
