from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ReviewBase(BaseModel):
    user_id: str | None = None
    menu_item_id: str | None = None
    rating: int | None = Field(default=None, ge=1, le=5)
    comment: str | None = None
    created_at: datetime | None = None


class ReviewCreate(ReviewBase):
    pass


class ReviewUpdate(BaseModel):
    user_id: str | None = None
    menu_item_id: str | None = None
    rating: int | None = Field(default=None, ge=1, le=5)
    comment: str | None = None
    created_at: datetime | None = None


class ReviewResponse(ReviewBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
