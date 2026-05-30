from typing import Annotated
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_active_admin
from model.khachhang import KhachHang
from schemas.orders import OrderResponse, OrderStatusUpdate
from service import orders as orders_service

router = APIRouter(prefix="/admin/orders", tags=["Admin Orders"])


@router.get("", response_model=list[OrderResponse])
def get_all_orders(
    db: Annotated[Session, Depends(get_db)],
    current_admin: Annotated[KhachHang, Depends(get_current_active_admin)],
):
    """
    [Chức năng 1] Danh sách toàn bộ đơn hàng (Chỉ Admin).
    """
    return orders_service.get_all_orders_admin(db)


@router.get("/by-date", response_model=list[OrderResponse])
def get_orders_by_date(
    date: str,
    db: Annotated[Session, Depends(get_db)],
    current_admin: Annotated[KhachHang, Depends(get_current_active_admin)],
):
    """
    [Chức năng 4] Lọc đơn hàng theo ngày (format YYYY-MM-DD).
    """
    return orders_service.get_orders_by_date_admin(db, date)


@router.get("/{order_id}", response_model=OrderResponse)
def get_order_detail(
    order_id: str,
    db: Annotated[Session, Depends(get_db)],
    current_admin: Annotated[KhachHang, Depends(get_current_active_admin)],
):
    """
    [Chức năng 2] Xem chi tiết một đơn hàng bất kỳ.
    """
    return orders_service.get_order_detail_admin(db, order_id)


@router.put("/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: str,
    data: OrderStatusUpdate,
    db: Annotated[Session, Depends(get_db)],
    current_admin: Annotated[KhachHang, Depends(get_current_active_admin)],
):
    """
    [Chức năng 3] Cập nhật trạng thái đơn hàng (sử dụng OrderStatus enum).
    """
    return orders_service.update_order_status_admin(db, order_id, data.trangthai)
