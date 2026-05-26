from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from crud import menu as menu_crud
from crud import orders as orders_crud
from model.orders import Order
from schemas.orders import OrderCreate, OrderUpdate


def get_order_or_404(db: Session, order_id: str) -> Order:
    """Lấy đơn hàng hoặc trả về lỗi 404."""
    order = orders_crud.get_order_by_id(db, order_id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy đơn hàng")
    return order


def verify_order_ownership(order: Order, makh: str) -> None:
    """Kiểm tra quyền sở hữu đơn hàng (chỉ chủ đơn hàng mới được thao tác)."""
    if order.makh != makh:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền thao tác trên đơn hàng này"
        )


def create_user_order(db: Session, makh: str, data: OrderCreate) -> Order:
    """Tạo đơn hàng mới (Giỏ hàng) hoặc bổ sung món vào Giỏ hàng hiện tại."""
    # Tìm xem khách hàng này đã có đơn hàng nào ở trạng thái "Giỏ hàng" chưa
    all_orders = orders_crud.get_orders_by_makh(db, makh)
    cart = None
    for o in all_orders:
        if o.trangthai == "Giỏ hàng":
            cart = o
            break

    # Nếu chưa có giỏ hàng, khởi tạo mới
    if not cart:
        cart = orders_crud.create_order(db, makh, data.hinhthucthanhtoan or "Tiền mặt")

    # Thêm các món ăn vào giỏ hàng
    for item in data.chitiet:
        thucdon = menu_crud.get_menu_item_by_id(db, item.mamon)
        if not thucdon:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Không tìm thấy món ăn với mã {item.mamon}"
            )
        if thucdon.hethang:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Món ăn {thucdon.ten} hiện đã hết hàng, không thể đặt"
            )
        
        # Thêm món và lưu giá bán tại thời điểm đặt
        orders_crud.add_item_to_order(db, cart, item.mamon, item.soluong, thucdon.gia or 0.0)

    # Tính toán lại tổng tiền của đơn hàng
    orders_crud.recalculate_order_total(db, cart)
    return cart


def update_user_order_item(db: Session, order_id: str, makh: str, data: OrderUpdate) -> Order:
    """Thêm/Xóa/Sửa số lượng món ăn trong đơn hàng đang là Giỏ hàng hoặc Chờ xác nhận."""
    order = get_order_or_404(db, order_id)
    verify_order_ownership(order, makh)

    if order.trangthai not in ["Giỏ hàng", "Chờ xác nhận"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Chỉ có thể sửa đơn hàng ở trạng thái Giỏ hàng hoặc Chờ xác nhận"
        )

    thucdon = menu_crud.get_menu_item_by_id(db, data.mamon)
    if not thucdon:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy món ăn với mã {data.mamon}"
        )

    # Cập nhật món ăn
    orders_crud.update_order_item(db, order, data.mamon, data.soluong, thucdon.gia or 0.0)
    # Tính lại tổng tiền
    orders_crud.recalculate_order_total(db, order)
    return order


def confirm_user_order(db: Session, order_id: str, makh: str) -> Order:
    """Chốt đặt hàng (chuyển trạng thái từ Giỏ hàng sang Chờ xác nhận)."""
    order = get_order_or_404(db, order_id)
    verify_order_ownership(order, makh)

    if order.trangthai != "Giỏ hàng":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Chỉ có thể chốt đơn hàng từ Giỏ hàng"
        )
    if not order.chitiet:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Giỏ hàng trống, vui lòng thêm món trước khi đặt"
        )

    # Chuyển sang trạng thái chờ admin xác nhận để nấu
    return orders_crud.update_order_status(db, order, "Chờ xác nhận")


def cancel_user_order(db: Session, order_id: str, makh: str) -> Order:
    """Hủy đơn hàng (chỉ áp dụng nếu đơn ở trạng thái Giỏ hàng hoặc Chờ xác nhận)."""
    order = get_order_or_404(db, order_id)
    verify_order_ownership(order, makh)

    if order.trangthai not in ["Giỏ hàng", "Chờ xác nhận"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Không thể hủy đơn khi đã được xác nhận nấu hoặc đã hoàn thành"
        )

    return orders_crud.update_order_status(db, order, "Đã hủy")


def get_user_order_detail(db: Session, order_id: str, makh: str) -> Order:
    """Xem chi tiết một đơn hàng cụ thể của khách hàng."""
    order = get_order_or_404(db, order_id)
    verify_order_ownership(order, makh)
    return order


def get_user_orders_history(db: Session, makh: str) -> list[Order]:
    """Lấy danh sách tất cả các đơn hàng đã đặt của khách hàng."""
    return orders_crud.get_orders_by_makh(db, makh)
