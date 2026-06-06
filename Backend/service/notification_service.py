from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from crud import notification as notification_crud
from model.enums import OrderStatus
from schemas.notification import (
    BaseNotificationResponse,
    OutOfStockItem,
    OutOfStockResponse
)


def get_order_deadline() -> BaseNotificationResponse:
    """
    [Chức năng 1] Nhắc nhở deadline đặt món.
    Do database không có cấu hình deadline, trả về thông báo mặc định.
    """
    return BaseNotificationResponse(
        message="Hạn chót đặt món là 10:30 AM hàng ngày. Vui lòng hoàn tất đặt món trước thời gian này để được phục vụ tốt nhất."
    )


def get_order_ready_status(db: Session, order_id: str) -> BaseNotificationResponse:
    """
    [Chức năng 2] Thông báo đơn đã sẵn sàng.
    """
    order = notification_crud.get_order_by_id(db, order_id)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy đơn hàng {order_id}."
        )
    
    if order.trangthai == OrderStatus.CONFIRMED:
        return BaseNotificationResponse(message=f"Đơn hàng {order_id} sắp được giao tới bạn.")
    if order.trangthai == OrderStatus.DELIVERED:
        return BaseNotificationResponse(message=f"Đơn hàng {order_id} đã được giao.")
    else:
        return BaseNotificationResponse(message=f"Đơn hàng {order_id} chưa sẵn sàng (trạng thái: {order.trangthai}).")


def get_out_of_stock_items(db: Session) -> OutOfStockResponse:
    """
    [Chức năng 3] Thông báo món hết.
    """
    items = notification_crud.get_out_of_stock_items(db)
    
    out_of_stock_items = []
    for item in items:
        out_of_stock_items.append(OutOfStockItem(
            mamon=item.mamon,
            ten=item.ten
        ))
        
    return OutOfStockResponse(
        message="Danh sách các món đã hết hàng.",
        items=out_of_stock_items
    )
