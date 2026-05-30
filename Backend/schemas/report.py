from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel
from schemas.thucdon import ThucDonResponse

class BaseReportSchema(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)

class RevenueResponse(BaseReportSchema):
    """Schema chung cho thống kê doanh thu (Ngày, Tuần, Tháng)"""
    total_orders: int = Field(default=0, description="Tổng số đơn hàng")
    total_revenue: float = Field(default=0.0, description="Tổng doanh thu")
    total_successful_payments: int | None = Field(default=None, description="Tổng số thanh toán thành công (nếu có)")


class OrdersSummaryResponse(BaseReportSchema):
    """Tổng quan đơn hàng"""
    total_orders: int = 0
    completed_orders: int = 0
    processing_orders: int = 0
    cancelled_orders: int = 0


class PaymentSummaryResponse(BaseReportSchema):
    """Tổng quan giao dịch thanh toán"""
    total_transactions: int = 0
    successful_transactions: int = 0
    pending_transactions: int = 0
    cancelled_transactions: int = 0


class TopSellingItemResponse(BaseReportSchema):
    """Chi tiết top món bán chạy (kế thừa ThucDonResponse để tái sử dụng nhưng override/thêm fields nếu cần)"""
    mamon: str
    ten: str | None = None
    gia: float | None = None
    soluongdaban: int | None = 0
    hinhanh: str | None = None
