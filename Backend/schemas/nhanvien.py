from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

class NhanVienBase(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    ten: str | None = None
    tuoi: int | None = None
    chucvu: str | None = None
    luong: float | None = None
    email: str | None = None
    sodienthoai: str | None = None
    ngaybatdau: str | None = None
    viettat: str | None = None
    maunen: str | None = None
    hoatdonggannhat: str | None = None

class NhanVienCreate(NhanVienBase):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    manv: str

class NhanVienUpdate(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    ten: str | None = None
    tuoi: int | None = None
    chucvu: str | None = None
    luong: float | None = None
    email: str | None = None
    sodienthoai: str | None = None
    ngaybatdau: str | None = None
    viettat: str | None = None
    maunen: str | None = None
    hoatdonggannhat: str | None = None

class NhanVienResponse(NhanVienBase):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    manv: str

class NhanVienListResponse(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    items: list[NhanVienResponse]
    total: int
