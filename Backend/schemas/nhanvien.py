from pydantic.alias_generators import to_camel
from pydantic import BaseModel, ConfigDict, Field


class NhanVienBase(BaseModel):

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    ten: str | None = None
    tuoi: int | None = None
    chucvu: str | None = None
    luong: float | None = None


class NhanVienCreate(NhanVienBase):

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    manv: str = Field(..., min_length=1)


class NhanVienUpdate(BaseModel):

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    ten: str | None = None
    tuoi: int | None = None
    chucvu: str | None = None
    luong: float | None = None


class NhanVienResponse(NhanVienBase):

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)

    manv: str
