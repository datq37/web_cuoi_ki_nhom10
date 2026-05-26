from pydantic import BaseModel, ConfigDict, Field


class KhachHangBase(BaseModel):
    ten: str | None = None
    tuoi: int | None = None
    taikhoan: str | None = None
    lichsudathang: str | None = None


class KhachHangCreate(KhachHangBase):
    makh: str = Field(..., min_length=1)
    matkhau: str | None = None


class KhachHangUpdate(BaseModel):
    ten: str | None = None
    tuoi: int | None = None
    taikhoan: str | None = None
    matkhau: str | None = None
    lichsudathang: str | None = None


class KhachHangResponse(KhachHangBase):
    model_config = ConfigDict(from_attributes=True)

    makh: str
