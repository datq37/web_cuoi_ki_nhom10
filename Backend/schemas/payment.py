from pydantic.alias_generators import to_camel
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from model.enums import PaymentMethod, PaymentStatus


class PaymentBase(BaseModel):
    """Schema cơ sở của Payment."""

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    order_id: str = Field(..., description="Mã đơn hàng cần thanh toán")
    method: PaymentMethod = Field(..., description="Phương thức thanh toán: CASH hoặc BANKING")


class PaymentCreate(PaymentBase):
    """Schema khi client gửi yêu cầu tạo thanh toán."""

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    pass


class PaymentResponse(PaymentBase):
    """Schema trả về thông tin thanh toán."""

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)

    id: str
    status: PaymentStatus
    created_at: datetime | None = None
    tongtien: float = Field(0.0, description="Tổng tiền thanh toán (tính động từ đơn hàng)")
