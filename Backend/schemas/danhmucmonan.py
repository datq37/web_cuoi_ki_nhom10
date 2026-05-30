from pydantic.alias_generators import to_camel
from pydantic import BaseModel, ConfigDict, Field


class DanhMucMonAnBase(BaseModel):

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    name: str | None = Field(default=None, max_length=100)


class DanhMucMonAnCreate(DanhMucMonAnBase):

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    name: str = Field(..., min_length=1, max_length=100)


class DanhMucMonAnUpdate(BaseModel):

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    name: str | None = Field(default=None, max_length=100)


class DanhMucMonAnResponse(DanhMucMonAnBase):

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)

    id: int
