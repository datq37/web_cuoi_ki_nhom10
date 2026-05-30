from model.enums import PaymentStatus, PaymentMethod
import uuid
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from model.payment import Payment
from model.orders import Order


def get_payment_by_id(db: Session, payment_id: str) -> Payment | None:
    """Lấy thông tin một payment theo ID, kèm theo order và chi tiết order."""
    stmt = (
        select(Payment)
        .options(joinedload(Payment.order).joinedload(Order.chitiet))
        .where(Payment.id == payment_id)
    )
    return db.execute(stmt).unique().scalar_one_or_none()


def get_payments(db: Session, skip: int = 0, limit: int = 100) -> list[Payment]:
    """Lấy danh sách tất cả các payment (dành cho Admin)."""
    stmt = (
        select(Payment)
        .options(joinedload(Payment.order).joinedload(Order.chitiet))
        .order_by(Payment.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    return list(db.execute(stmt).unique().scalars().all())


def get_payments_by_user(db: Session, makh: str) -> list[Payment]:
    """Lấy danh sách các payment của một khách hàng."""
    stmt = (
        select(Payment)
        .join(Order)
        .options(joinedload(Payment.order).joinedload(Order.chitiet))
        .where(Order.makh == makh)
        .order_by(Payment.created_at.desc())
    )
    return list(db.execute(stmt).unique().scalars().all())


def create_payment(db: Session, order_id: str, method: str) -> Payment:
    """Tạo mới một payment (trạng thái mặc định là PENDING)."""
    payment_id = f"PAY-{uuid.uuid4().hex[:8].upper()}"
    payment = Payment(
        id=payment_id,
        order_id=order_id,
        method=method,
        status=PaymentStatus.PENDING
    )
    db.add(payment)
    db.commit()
    db.refresh(payment)
    return payment


def update_payment_status(db: Session, payment: Payment, new_status: str) -> Payment:
    """Cập nhật trạng thái của payment."""
    payment.status = new_status
    db.add(payment)
    db.commit()
    db.refresh(payment)
    return payment
