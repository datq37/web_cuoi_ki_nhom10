from pydantic.alias_generators import to_camel
from pydantic import BaseModel, ConfigDict, Field
from schemas.thucdon import ThucDonResponse
from schemas.khachhang import KhachHangResponse
from schemas.payment import PaymentResponse
from model.enums import OrderStatus, PaymentMethod


class OrderDetailBase(BaseModel):
    """Schema cơ sở cho chi tiết đơn hàng."""

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    mamon: str = Field(..., description="Mã món ăn")
    soluong: int = Field(default=1, ge=1, description="Số lượng đặt")


class OrderDetailCreate(OrderDetailBase):
    """Schema tạo chi tiết đơn hàng (thêm vào giỏ)."""

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    pass


class OrderDetailResponse(OrderDetailBase):
    """Schema phản hồi chi tiết đơn hàng."""

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)

    id: int
    order_id: str
    gia: float | None = None
    thucdon: ThucDonResponse | None = None


class OrderBase(BaseModel):
    """Schema cơ sở của Đơn hàng."""

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    hinhthucthanhtoan: PaymentMethod | None = Field(default=PaymentMethod.CASH, description="Hình thức thanh toán")
    ghichu: str | None = Field(default=None, description="Ghi chú đơn hàng", alias="ghiChu")


class OrderCreate(OrderBase):
    """Schema tạo đơn đặt hàng mới (giỏ hàng mới)."""

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    chitiet: list[OrderDetailCreate] = Field(default=[], description="Danh sách các món đặt")


class OrderUpdate(BaseModel):
    """Schema cập nhật đơn đặt hàng (thay đổi món/số lượng)."""

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    mamon: str = Field(..., description="Mã món ăn")
    soluong: int = Field(..., ge=0, description="Số lượng mới (bằng 0 sẽ xóa món)")


class OrderStatusUpdate(BaseModel):
    """Schema Admin hoặc User chốt/cập nhật trạng thái đơn."""

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    trangthai: OrderStatus = Field(..., description="Trạng thái đơn mới", alias="trangThai")


class OrderResponse(OrderBase):
    """Schema phản hồi thông tin đơn hàng đầy đủ."""

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)

    id: str = Field(..., alias="maDon")
    makh: str = Field(..., alias="maKh")
    tongtien: float = Field(..., alias="tongTien")
    trangthai: OrderStatus = Field(..., alias="trangThai")
    thoigiandat: str | None = Field(None, alias="thoiGianDat")
    chitiet: list[OrderDetailResponse] = []
    khachhang: KhachHangResponse | None = None
    payments: list[PaymentResponse] = []
