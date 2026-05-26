from pydantic import BaseModel, ConfigDict, Field


class OrderBase(BaseModel):
    makh: str | None = None
    tongtien: float | None = None
    trangthai: str | None = None
    thoigiandat: str | None = None
    hinhthucthanhtoan: str | None = None


class OrderCreate(OrderBase):
    id: str | None = None


class OrderUpdate(BaseModel):
    makh: str | None = None
    tongtien: float | None = None
    trangthai: str | None = None
    thoigiandat: str | None = None
    hinhthucthanhtoan: str | None = None


class OrderResponse(OrderBase):
    model_config = ConfigDict(from_attributes=True)

    id: str | None = None
