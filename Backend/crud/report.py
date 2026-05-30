from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload
from model.orders import Order
from model.payment import Payment
from model.thucdon import ThucDon

def get_orders_with_payments_by_prefix(db: Session, prefix: str) -> list[Order]:
    """Lấy đơn hàng kèm theo thanh toán dựa trên chuỗi prefix ngày tháng."""
    stmt = (
        select(Order)
        .options(joinedload(Order.payments))
        .where(Order.thoigiandat.startswith(prefix))
    )
    return list(db.execute(stmt).unique().scalars().all())

def get_all_orders(db: Session) -> list[Order]:
    """Lấy tất cả đơn hàng để tổng hợp"""
    stmt = select(Order)
    return list(db.execute(stmt).scalars().all())

def get_all_payments(db: Session) -> list[Payment]:
    """Lấy tất cả thanh toán để tổng hợp"""
    stmt = select(Payment)
    return list(db.execute(stmt).scalars().all())

def get_top_selling_items(db: Session, limit: int = 10) -> list[ThucDon]:
    """Lấy top món bán chạy dựa trên soluongdaban"""
    stmt = (
        select(ThucDon)
        .order_by(ThucDon.soluongdaban.desc().nulls_last())
        .limit(limit)
    )
    return list(db.execute(stmt).scalars().all())
