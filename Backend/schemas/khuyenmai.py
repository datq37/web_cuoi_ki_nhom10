from datetime import date
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

class KhuyenMaiBase(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    ten: str | None = None
    hansudung: date | None = None
    ma: str | None = None
    mota: str | None = None
    loai: str | None = None
    giatrigiam: float | None = None
    dontooithieu: float | None = None
    dadung: int | None = 0
    gioihan: int | None = None
    trangthai: str | None = None
    hoatdong: bool | None = True

class KhuyenMaiCreate(KhuyenMaiBase):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    ma: str

class KhuyenMaiUpdate(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    ten: str | None = None
    hansudung: date | None = None
    ma: str | None = None
    mota: str | None = None
    loai: str | None = None
    giatrigiam: float | None = None
    dontooithieu: float | None = None
    dadung: int | None = None
    gioihan: int | None = None
    trangthai: str | None = None
    hoatdong: bool | None = None

class KhuyenMaiResponse(KhuyenMaiBase):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    id: int

class KhuyenMaiListResponse(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    items: list[KhuyenMaiResponse]
    total: int
