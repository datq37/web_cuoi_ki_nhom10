from pydantic import BaseModel, ConfigDict, Field
from schemas.thucdon import ThucDonResponse


class OrderDetailBase(BaseModel):
    """Schema cơ sở cho chi tiết đơn hàng."""
    mamon: str = Field(..., description="Mã món ăn")
    soluong: int = Field(default=1, ge=1, description="Số lượng đặt")


class OrderDetailCreate(OrderDetailBase):
    """Schema tạo chi tiết đơn hàng (thêm vào giỏ)."""
    pass


class OrderDetailResponse(OrderDetailBase):
    """Schema phản hồi chi tiết đơn hàng."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    order_id: str
    gia: float | None = None
    thucdon: ThucDonResponse | None = None


class OrderBase(BaseModel):
    """Schema cơ sở của Đơn hàng."""
    hinhthucthanhtoan: str | None = Field(default="Tiền mặt", description="Hình thức thanh toán")


class OrderCreate(OrderBase):
    """Schema tạo đơn đặt hàng mới (giỏ hàng mới)."""
    chitiet: list[OrderDetailCreate] = Field(default=[], description="Danh sách các món đặt")


class OrderUpdate(BaseModel):
    """Schema cập nhật đơn đặt hàng (thay đổi món/số lượng)."""
    mamon: str = Field(..., description="Mã món ăn")
    soluong: int = Field(..., ge=0, description="Số lượng mới (bằng 0 sẽ xóa món)")


class OrderStatusUpdate(BaseModel):
    """Schema Admin hoặc User chốt/cập nhật trạng thái đơn."""
    trangthai: str = Field(..., description="Trạng thái đơn mới")


class OrderResponse(OrderBase):
    """Schema phản hồi thông tin đơn hàng đầy đủ."""
    model_config = ConfigDict(from_attributes=True)

    id: str
    makh: str
    tongtien: float
    trangthai: str
    thoigiandat: str | None = None
    chitiet: list[OrderDetailResponse] = []
