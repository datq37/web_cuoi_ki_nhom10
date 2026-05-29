from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field, field_validator


class PaymentBase(BaseModel):
    """Schema cơ sở của Payment."""
    order_id: str = Field(..., description="Mã đơn hàng cần thanh toán")
    method: str = Field(..., description="Phương thức thanh toán: CASH hoặc BANKING")

    @field_validator("method")
    @classmethod
    def validate_method(cls, v: str) -> str:
        v = v.upper()
        if v not in ["CASH", "BANKING"]:
            raise ValueError("Phương thức thanh toán phải là CASH hoặc BANKING")
        return v


class PaymentCreate(PaymentBase):
    """Schema khi client gửi yêu cầu tạo thanh toán."""
    pass


class PaymentResponse(PaymentBase):
    """Schema trả về thông tin thanh toán."""
    model_config = ConfigDict(from_attributes=True)

    id: str
    status: str
    created_at: datetime | None = None
    tongtien: float = Field(0.0, description="Tổng tiền thanh toán (tính động từ đơn hàng)")
