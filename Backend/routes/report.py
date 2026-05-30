from typing import Annotated
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_active_admin
from model.khachhang import KhachHang
from schemas.report import (
    RevenueResponse,
    OrdersSummaryResponse,
    PaymentSummaryResponse,
    TopSellingItemResponse
)
from service import report as report_service

router = APIRouter(prefix="/reports", tags=["Thống kê & Báo cáo (Admin)"])

# Chỉ định dependencies ở mức router để áp dụng cho tất cả endpoints
# Nhưng ở đây ta cứ dùng cho từng hàm cho rõ ràng như module admin_orders

@router.get("/revenue/day", response_model=RevenueResponse)
def get_revenue_by_day(
    date: str,
    db: Annotated[Session, Depends(get_db)],
    current_admin: Annotated[KhachHang, Depends(get_current_active_admin)],
):
    """
    [Chức năng 1] Doanh thu theo ngày. Truyền tham số date (YYYY-MM-DD).
    """
    return report_service.get_revenue_by_day(db, date)


@router.get("/revenue/week", response_model=RevenueResponse)
def get_revenue_by_week(
    year: int,
    week: int,
    db: Annotated[Session, Depends(get_db)],
    current_admin: Annotated[KhachHang, Depends(get_current_active_admin)],
):
    """
    [Chức năng 2] Doanh thu theo tuần. Truyền tham số year và week (ISO tuần thứ n trong năm).
    """
    return report_service.get_revenue_by_week(db, year, week)


@router.get("/revenue/month", response_model=RevenueResponse)
def get_revenue_by_month(
    year: int,
    month: int,
    db: Annotated[Session, Depends(get_db)],
    current_admin: Annotated[KhachHang, Depends(get_current_active_admin)],
):
    """
    [Chức năng 3] Doanh thu theo tháng. Truyền tham số year và month (1-12).
    """
    return report_service.get_revenue_by_month(db, year, month)


@router.get("/orders-summary", response_model=OrdersSummaryResponse)
def get_orders_summary(
    db: Annotated[Session, Depends(get_db)],
    current_admin: Annotated[KhachHang, Depends(get_current_active_admin)],
):
    """
    [Chức năng 4] Tổng quan đơn hàng (hoàn thành, đang xử lý, đã hủy).
    """
    return report_service.get_orders_summary(db)


@router.get("/payment-summary", response_model=PaymentSummaryResponse)
def get_payment_summary(
    db: Annotated[Session, Depends(get_db)],
    current_admin: Annotated[KhachHang, Depends(get_current_active_admin)],
):
    """
    [Chức năng 5] Tổng quan giao dịch thanh toán (thành công, chờ, hủy).
    """
    return report_service.get_payment_summary(db)


@router.get("/top-selling-items", response_model=list[TopSellingItemResponse])
def get_top_selling_items(
    limit: int,
    db: Annotated[Session, Depends(get_db)],
    current_admin: Annotated[KhachHang, Depends(get_current_active_admin)],
):
    """
    [Chức năng 6] Top món ăn bán chạy. Truyền tham số limit (số lượng cần lấy).
    """
    return report_service.get_top_selling_items(db, limit)
