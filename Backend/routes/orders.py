from model.enums import OrderStatus, PaymentMethod
from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user
from model.khachhang import KhachHang
from schemas.orders import OrderCreate, OrderResponse, OrderUpdate
from service import orders as orders_service

router = APIRouter(prefix="/orders", tags=["Đơn hàng (Orders)"])


@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    data: OrderCreate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[KhachHang, Depends(get_current_user)],
):
    """Đặt món / Thêm món vào giỏ hàng."""
    return orders_service.create_user_order(db, current_user.makh, data)


@router.patch("/{order_id}", response_model=OrderResponse)
def update_order_item(
    order_id: str,
    data: OrderUpdate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[KhachHang, Depends(get_current_user)],
):
    """Cập nhật số lượng món ăn trong giỏ hoặc đơn đang chờ xác nhận."""
    return orders_service.update_user_order_item(db, order_id, current_user.makh, data)


@router.post("/{order_id}/confirm", response_model=OrderResponse)
def confirm_order(
    order_id: str,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[KhachHang, Depends(get_current_user)],
):
    """Chốt đặt hàng (chuyển trạng thái từ Giỏ hàng sang Chờ xác nhận)."""
    return orders_service.confirm_user_order(db, order_id, current_user.makh)


@router.post("/{order_id}/cancel", response_model=OrderResponse)
def cancel_order(
    order_id: str,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[KhachHang, Depends(get_current_user)],
):
    """Hủy đặt món (chỉ có thể hủy nếu đơn ở trạng thái Giỏ hàng hoặc Chờ xác nhận)."""
    return orders_service.cancel_user_order(db, order_id, current_user.makh)


@router.get("/history", response_model=list[OrderResponse])
def get_orders_history(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[KhachHang, Depends(get_current_user)],
):
    """Xem danh sách toàn bộ lịch sử đơn hàng của chính mình."""
    return orders_service.get_user_orders_history(db, current_user.makh)


@router.get("/{order_id}", response_model=OrderResponse)
def get_order_detail(
    order_id: str,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[KhachHang, Depends(get_current_user)],
):
    """Xem chi tiết thông tin một đơn hàng của chính mình."""
    return orders_service.get_user_order_detail(db, order_id, current_user.makh)
