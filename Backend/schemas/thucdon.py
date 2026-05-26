from pydantic import BaseModel, ConfigDict, Field


class ThucDonBase(BaseModel):
    ten: str | None = None
    gia: float | None = None
    soluong: int | None = None
    hinhanh: str | None = None
    mieuta: str | None = None
    soluongdaban: int | None = None
    hethang: bool | None = False
    tags: list[str] | None = None
    danhmucid: int | None = None


class ThucDonCreate(ThucDonBase):
    mamon: str = Field(..., min_length=1)


class ThucDonUpdate(BaseModel):
    ten: str | None = None
    gia: float | None = None
    soluong: int | None = None
    hinhanh: str | None = None
    mieuta: str | None = None
    soluongdaban: int | None = None
    hethang: bool | None = None
    tags: list[str] | None = None
    danhmucid: int | None = None


class ThucDonResponse(ThucDonBase):
    model_config = ConfigDict(from_attributes=True)

    mamon: str
