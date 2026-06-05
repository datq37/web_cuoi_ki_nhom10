from model.enums import OrderStatus, PaymentMethod, PaymentStatus
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from crud import khachhang as khachhang_crud
from crud import menu as menu_crud
from crud import orders as orders_crud
from crud import payment as payment_crud
from model.orders import Order
from schemas.orders import OrderCreate, OrderUpdate
from service import settings as settings_service


def is_banking_order(order: Order) -> bool:
    method = (order.hinhthucthanhtoan or "").lower()
    return method in {PaymentMethod.BANKING.value, "qr"}


def has_paid_payment(order: Order) -> bool:
    return any(payment.status == PaymentStatus.PAID for payment in (order.payments or []))


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
    # Tìm xem khách hàng này đã có đơn hàng nào ở trạng thái OrderStatus.CART chưa
    all_orders = orders_crud.get_orders_by_makh(db, makh)
    cart = None
    for o in all_orders:
        if o.trangthai == OrderStatus.CART:
            cart = o
            break

    # Nếu chưa có giỏ hàng, khởi tạo mới
    if not cart:
        cart = orders_crud.create_order(db, makh, data.hinhthucthanhtoan or PaymentMethod.CASH, ghichu=data.ghichu)
    else:
        if data.ghichu is not None:
            cart.ghichu = data.ghichu

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

    if order.trangthai not in [OrderStatus.CART, OrderStatus.PENDING_CONFIRMATION]:
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

    ordering_status = settings_service.get_ordering_status(db)
    if not ordering_status.open:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"message": ordering_status.message},
        )

    if order.trangthai != OrderStatus.CART:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Chỉ có thể chốt đơn hàng từ Giỏ hàng"
        )
    if not order.chitiet:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Giỏ hàng trống, vui lòng thêm món trước khi đặt"
        )

    # Chuyển sang trạng thái chờ admin xác nhận để nấu, rồi cộng điểm một lần.
    confirmed_order = orders_crud.update_order_status(db, order, OrderStatus.PENDING_CONFIRMATION)
    khachhang = khachhang_crud.get_khachhang_by_makh(db, makh)
    if khachhang:
        khachhang_crud.add_purchase_points(db, khachhang, int(confirmed_order.tongtien or 0))
    return confirmed_order


def cancel_user_order(db: Session, order_id: str, makh: str) -> Order:
    """Hủy đơn hàng (chỉ áp dụng nếu đơn ở trạng thái Giỏ hàng hoặc Chờ xác nhận)."""
    order = get_order_or_404(db, order_id)
    verify_order_ownership(order, makh)

    if order.trangthai not in [OrderStatus.CART, OrderStatus.PENDING_CONFIRMATION]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Không thể hủy đơn khi đã được xác nhận nấu hoặc đã hoàn thành"
        )

    return orders_crud.update_order_status(db, order, OrderStatus.CANCELLED)


def get_user_order_detail(db: Session, order_id: str, makh: str) -> Order:
    """Xem chi tiết một đơn hàng cụ thể của khách hàng."""
    order = get_order_or_404(db, order_id)
    verify_order_ownership(order, makh)
    return order


def get_user_orders_history(db: Session, makh: str) -> list[Order]:
    """Lấy danh sách tất cả các đơn hàng đã đặt của khách hàng."""
    return orders_crud.get_orders_by_makh(db, makh)


# --- ADMIN SERVICES ---

def get_all_orders_admin(db: Session) -> list[Order]:
    """Lấy danh sách toàn bộ đơn hàng cho Admin."""
    return orders_crud.get_all_orders(db)


def get_order_detail_admin(db: Session, order_id: str) -> Order:
    """Lấy chi tiết đơn hàng cho Admin."""
    order = orders_crud.get_order_by_id(db, order_id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Đơn hàng không tồn tại")
    return order


def deduct_order_ingredients_stock(db: Session, order: Order) -> None:
    """Trừ tồn kho nguyên liệu tương ứng với đơn hàng."""
    from model.congthuc import CongThuc
    from model.khohang import KhoHang
    from sqlalchemy import select

    for item in order.chitiet:
        if not item.mamon:
            continue
        stmt = select(CongThuc).where(CongThuc.mamon == item.mamon)
        recipes = db.execute(stmt).scalars().all()
        for ct in recipes:
            if not ct.mahang or not ct.dinhluong:
                continue
            stock_stmt = select(KhoHang).where(KhoHang.mahang == ct.mahang)
            kho = db.execute(stock_stmt).scalar_one_or_none()
            if kho:
                order_qty = item.soluong or 0
                deduction = ct.dinhluong * order_qty
                current_qty = kho.soluong or 0.0
                kho.soluong = max(0.0, current_qty - deduction)
                db.add(kho)
    db.commit()


def update_order_status_admin(db: Session, order_id: str, new_status: str) -> Order:
    """Cập nhật trạng thái đơn hàng (Admin)."""
    order = orders_crud.get_order_by_id(db, order_id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Đơn hàng không tồn tại")

    next_status = new_status.value if hasattr(new_status, "value") else str(new_status)
    if (
        is_banking_order(order)
        and next_status not in {OrderStatus.PENDING_CONFIRMATION.value, OrderStatus.CANCELLED.value}
        and not has_paid_payment(order)
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Đơn chuyển khoản chưa được xác nhận thanh toán",
        )
    
    old_status = order.trangthai
    updated_order = orders_crud.update_order_status(db, order, new_status)
    
    # Nếu chuyển sang đã giao hàng (delivered) và trước đó chưa giao
    if old_status != OrderStatus.DELIVERED and new_status == OrderStatus.DELIVERED:
        deduct_order_ingredients_stock(db, updated_order)
        
    return updated_order


def confirm_order_payment_admin(db: Session, order_id: str) -> Order:
    """Admin xác nhận đã nhận tiền chuyển khoản cho một đơn hàng."""
    order = orders_crud.get_order_by_id(db, order_id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Đơn hàng không tồn tại")

    if not is_banking_order(order):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Chỉ xác nhận chuyển khoản cho đơn thanh toán QR/chuyển khoản",
        )

    if order.trangthai == OrderStatus.CANCELLED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Không thể xác nhận thanh toán cho đơn đã huỷ",
        )

    payments = list(order.payments or [])
    paid_payment = next((p for p in payments if p.status == PaymentStatus.PAID), None)
    if paid_payment:
        return get_order_detail_admin(db, order_id)

    payment = next((p for p in payments if p.status == PaymentStatus.PENDING), None)
    if not payment:
        payment = payment_crud.create_payment(db, order.id, PaymentMethod.BANKING.value)

    payment_crud.update_payment_status(db, payment, PaymentStatus.PAID)
    return get_order_detail_admin(db, order_id)


def get_orders_by_date_admin(db: Session, date_str: str) -> list[Order]:
    """Lọc đơn hàng theo ngày cho Admin (format: YYYY-MM-DD)."""
    return orders_crud.get_orders_by_date(db, date_str)
