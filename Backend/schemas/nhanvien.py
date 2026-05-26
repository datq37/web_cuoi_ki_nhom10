from pydantic import BaseModel, ConfigDict, Field


class NhanVienBase(BaseModel):
    ten: str | None = None
    tuoi: int | None = None
    chucvu: str | None = None
    luong: float | None = None


class NhanVienCreate(NhanVienBase):
    manv: str = Field(..., min_length=1)


class NhanVienUpdate(BaseModel):
    ten: str | None = None
    tuoi: int | None = None
    chucvu: str | None = None
    luong: float | None = None


class NhanVienResponse(NhanVienBase):
    model_config = ConfigDict(from_attributes=True)

    manv: str
