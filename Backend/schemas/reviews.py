from pydantic.alias_generators import to_camel
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ReviewBase(BaseModel):

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    user_id: str | None = None
    menu_item_id: str | None = None
    rating: int | None = Field(default=None, ge=1, le=5)
    comment: str | None = None
    created_at: datetime | None = None
    images: list[str] | None = None


class ReviewCreate(ReviewBase):

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    pass


class ReviewUpdate(BaseModel):

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    user_id: str | None = None
    menu_item_id: str | None = None
    rating: int | None = Field(default=None, ge=1, le=5)
    comment: str | None = None
    created_at: datetime | None = None


class ReviewResponse(ReviewBase):

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)

    id: int
