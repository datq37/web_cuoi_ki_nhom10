from typing import Annotated
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user
from model.khachhang import KhachHang
from schemas.notification import (
    BaseNotificationResponse,
    OutOfStockResponse
)
from service import notification_service

router = APIRouter(prefix="/notifications", tags=["Thông báo (Notifications)"])


@router.get("/order-deadline", response_model=BaseNotificationResponse)
def get_order_deadline(
    current_user: Annotated[KhachHang, Depends(get_current_user)],
):
    """
    [Chức năng 1] Nhắc nhở deadline đặt món.
    """
    return notification_service.get_order_deadline()


@router.get("/order-ready/{order_id}", response_model=BaseNotificationResponse)
def get_order_ready_status(
    order_id: str,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[KhachHang, Depends(get_current_user)],
):
    """
    [Chức năng 2] Thông báo đơn đã sẵn sàng.
    """
    return notification_service.get_order_ready_status(db, order_id)


@router.get("/out-of-stock", response_model=OutOfStockResponse)
def get_out_of_stock_items(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[KhachHang, Depends(get_current_user)],
):
    """
    [Chức năng 3] Thông báo món hết.
    """
    return notification_service.get_out_of_stock_items(db)
