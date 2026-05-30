from model.enums import PaymentStatus, PaymentMethod
from fastapi import HTTPException
from sqlalchemy.orm import Session

from crud import payment as payment_crud
from crud import orders as orders_crud
from model.payment import Payment


def create_payment_service(db: Session, order_id: str, method: str, user_makh: str) -> Payment:
    # Validate order exists
    order = orders_crud.get_order_by_id(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Không tìm thấy đơn hàng")

    # Order thuộc về user hiện tại
    if order.makh != user_makh:
        raise HTTPException(status_code=403, detail="Đơn hàng không thuộc về bạn")

    # Kiểm tra xem đơn hàng đã có thanh toán nào hoàn tất chưa
    # Hoặc đã có thanh toán đang pending chưa
    for p in order.payments:
        if p.status == PaymentStatus.PAID:
            raise HTTPException(status_code=400, detail="Đơn hàng này đã được thanh toán")
        if p.status == PaymentStatus.PENDING:
            raise HTTPException(status_code=400, detail="Đơn hàng đang có một thanh toán chờ xử lý")

    # Tạo thanh toán
    payment = payment_crud.create_payment(db, order_id, method)
    
    # Đồng bộ hinhthucthanhtoan của Order nếu muốn
    order.hinhthucthanhtoan = method
    db.commit()

    return payment_crud.get_payment_by_id(db, payment.id)


def get_payment_service(db: Session, payment_id: str) -> Payment:
    payment = payment_crud.get_payment_by_id(db, payment_id)
    if not payment:
        raise HTTPException(status_code=404, detail="Không tìm thấy giao dịch thanh toán")
    return payment


def confirm_payment_service(db: Session, payment_id: str) -> Payment:
    payment = get_payment_service(db, payment_id)
    if payment.status == PaymentStatus.CANCELLED:
        raise HTTPException(status_code=400, detail="Không thể xác nhận giao dịch đã bị huỷ")
    if payment.status == PaymentStatus.PAID:
        raise HTTPException(status_code=400, detail="Giao dịch này đã được xác nhận từ trước")
    
    return payment_crud.update_payment_status(db, payment, PaymentStatus.PAID)


def cancel_payment_service(db: Session, payment_id: str) -> Payment:
    payment = get_payment_service(db, payment_id)
    if payment.status == PaymentStatus.PAID:
        raise HTTPException(status_code=400, detail="Không thể huỷ giao dịch đã hoàn tất")
    if payment.status == PaymentStatus.CANCELLED:
        raise HTTPException(status_code=400, detail="Giao dịch này đã bị huỷ từ trước")
    
    return payment_crud.update_payment_status(db, payment, PaymentStatus.CANCELLED)
