from datetime import datetime
from sqlalchemy.orm import Session
from crud import report as report_crud
from schemas.report import (
    RevenueResponse,
    OrdersSummaryResponse,
    PaymentSummaryResponse,
    TopSellingItemResponse
)
from model.enums import OrderStatus, PaymentStatus

def get_revenue_by_day(db: Session, date: str) -> RevenueResponse:
    # date format expected: YYYY-MM-DD
    orders = report_crud.get_orders_with_payments_by_prefix(db, date)
    
    total_orders = len(orders)
    total_revenue = sum((o.tongtien or 0.0) for o in orders if o.trangthai != OrderStatus.CANCELLED and o.trangthai != OrderStatus.CART)
    
    total_successful_payments = 0
    for o in orders:
        if any(p.status == PaymentStatus.PAID for p in o.payments):
            total_successful_payments += 1
            
    return RevenueResponse(
        total_orders=total_orders,
        total_revenue=total_revenue,
        total_successful_payments=total_successful_payments
    )


def get_revenue_by_week(db: Session, year: int, week: int) -> RevenueResponse:
    # filter by year first
    all_orders_year = report_crud.get_orders_with_payments_by_prefix(db, str(year))
    
    valid_orders = []
    for o in all_orders_year:
        if o.thoigiandat:
            try:
                dt = datetime.strptime(o.thoigiandat, "%Y-%m-%d %H:%M:%S")
                if dt.isocalendar()[1] == week:
                    valid_orders.append(o)
            except ValueError:
                pass

    total_orders = len(valid_orders)
    total_revenue = sum((o.tongtien or 0.0) for o in valid_orders if o.trangthai != OrderStatus.CANCELLED and o.trangthai != OrderStatus.CART)
    
    total_successful_payments = 0
    for o in valid_orders:
        if any(p.status == PaymentStatus.PAID for p in o.payments):
            total_successful_payments += 1
            
    return RevenueResponse(
        total_orders=total_orders,
        total_revenue=total_revenue,
        total_successful_payments=total_successful_payments
    )


def get_revenue_by_month(db: Session, year: int, month: int) -> RevenueResponse:
    prefix = f"{year}-{month:02d}"
    orders = report_crud.get_orders_with_payments_by_prefix(db, prefix)
    
    total_orders = len(orders)
    total_revenue = sum((o.tongtien or 0.0) for o in orders if o.trangthai != OrderStatus.CANCELLED and o.trangthai != OrderStatus.CART)
    
    total_successful_payments = 0
    for o in orders:
        if any(p.status == PaymentStatus.PAID for p in o.payments):
            total_successful_payments += 1
            
    return RevenueResponse(
        total_orders=total_orders,
        total_revenue=total_revenue,
        total_successful_payments=total_successful_payments
    )


def get_orders_summary(db: Session) -> OrdersSummaryResponse:
    orders = report_crud.get_all_orders(db)
    
    total = len(orders)
    completed = sum(1 for o in orders if o.trangthai == OrderStatus.DELIVERED)
    cancelled = sum(1 for o in orders if o.trangthai == OrderStatus.CANCELLED)
    # processing: not completed, not cancelled, not cart
    processing = sum(1 for o in orders if o.trangthai not in [OrderStatus.DELIVERED, OrderStatus.CANCELLED, OrderStatus.CART])
    
    return OrdersSummaryResponse(
        total_orders=total,
        completed_orders=completed,
        processing_orders=processing,
        cancelled_orders=cancelled
    )


def get_payment_summary(db: Session) -> PaymentSummaryResponse:
    payments = report_crud.get_all_payments(db)
    
    total = len(payments)
    successful = sum(1 for p in payments if p.status == PaymentStatus.PAID)
    pending = sum(1 for p in payments if p.status == PaymentStatus.PENDING)
    cancelled = sum(1 for p in payments if p.status == PaymentStatus.CANCELLED)
    
    return PaymentSummaryResponse(
        total_transactions=total,
        successful_transactions=successful,
        pending_transactions=pending,
        cancelled_transactions=cancelled
    )


def get_top_selling_items(db: Session, limit: int) -> list[TopSellingItemResponse]:
    items = report_crud.get_top_selling_items(db, limit)
    result = []
    for item in items:
        result.append(TopSellingItemResponse(
            mamon=item.mamon,
            ten=item.ten,
            gia=item.gia,
            soluongdaban=item.soluongdaban or 0,
            hinhanh=item.hinhanh
        ))
    return result
