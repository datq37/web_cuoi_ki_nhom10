from datetime import date

from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel


class ComboBase(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)

    ten: str | None = None
    mota: str | None = None
    loai_gia: str | None = "phan_tram"
    gia_tri_giam: int | None = 0
    hansudung: date | None = None
    trangthai: str | None = "dang_chay"
    hoatdong: bool | int | None = True


class ComboCreate(ComboBase):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)

    ten: str = Field(..., min_length=1)
    mon_an_ids: list[str] = Field(..., min_length=2)


class ComboUpdate(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)

    ten: str | None = None
    mota: str | None = None
    loai_gia: str | None = None
    gia_tri_giam: int | None = None
    hansudung: date | None = None
    trangthai: str | None = None
    hoatdong: bool | int | None = None
    mon_an_ids: list[str] | None = None


class ComboResponse(ComboBase):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)

    id: int
    mon_an_ids: list[str] = []


class ComboListResponse(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)

    items: list[ComboResponse]
    total: int
