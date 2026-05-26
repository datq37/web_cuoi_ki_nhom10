from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class KhoHangBase(BaseModel):
    ten: str | None = None
    soluong: float | None = None
    gianhap: Decimal | None = None
    trangthai: str | None = None


class KhoHangCreate(KhoHangBase):
    mahang: str = Field(..., min_length=1)


class KhoHangUpdate(BaseModel):
    ten: str | None = None
    soluong: float | None = None
    gianhap: Decimal | None = None
    trangthai: str | None = None


class KhoHangResponse(KhoHangBase):
    model_config = ConfigDict(from_attributes=True)

    mahang: str
