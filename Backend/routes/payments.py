from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from schemas.payment import PaymentCreate, PaymentResponse
from service import payment as payment_service
from crud.payment import get_payments, get_payments_by_user
from dependencies import get_current_user
from model.khachhang import KhachHang


router = APIRouter(prefix="/payments", tags=["Payments"])


@router.post("", response_model=PaymentResponse)
def create_payment(
    payment_in: PaymentCreate, 
    db: Session = Depends(get_db),
    current_user: KhachHang = Depends(get_current_user)
):
    """Tạo thanh toán cho đơn hàng."""
    return payment_service.create_payment_service(db, payment_in.order_id, payment_in.method, current_user.makh)


@router.get("/my-history", response_model=list[PaymentResponse])
def get_my_payments(
    db: Session = Depends(get_db),
    current_user: KhachHang = Depends(get_current_user)
):
    """Lịch sử giao dịch thanh toán của người dùng hiện tại."""
    return get_payments_by_user(db, current_user.makh)


@router.get("/{payment_id}", response_model=PaymentResponse)
def get_payment(payment_id: str, db: Session = Depends(get_db)):
    """Xem chi tiết một giao dịch thanh toán."""
    return payment_service.get_payment_service(db, payment_id)


@router.get("", response_model=list[PaymentResponse])
def get_all_payments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Lấy danh sách tất cả thanh toán (Admin)."""
    return get_payments(db, skip=skip, limit=limit)


@router.put("/{payment_id}/confirm", response_model=PaymentResponse)
def confirm_payment(payment_id: str, db: Session = Depends(get_db)):
    """Admin xác nhận giao dịch thanh toán đã thành công."""
    return payment_service.confirm_payment_service(db, payment_id)


@router.put("/{payment_id}/cancel", response_model=PaymentResponse)
def cancel_payment(payment_id: str, db: Session = Depends(get_db)):
    """Admin huỷ giao dịch thanh toán."""
    return payment_service.cancel_payment_service(db, payment_id)
