from pydantic.alias_generators import to_camel
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class KhoHangBase(BaseModel):

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    ten: str | None = None
    soluong: float | None = None
    gianhap: Decimal | None = None
    trangthai: str | None = None
    donvi: str | None = None
    nhacungcap: str | None = None


class KhoHangCreate(KhoHangBase):

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    mahang: str = Field(..., min_length=1)


class KhoHangUpdate(BaseModel):

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    ten: str | None = None
    soluong: float | None = None
    gianhap: Decimal | None = None
    trangthai: str | None = None
    donvi: str | None = None
    nhacungcap: str | None = None


class KhoHangResponse(KhoHangBase):

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)

    mahang: str


class KhoHangListResponse(BaseModel):

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    items: list[KhoHangResponse]
    total: int
