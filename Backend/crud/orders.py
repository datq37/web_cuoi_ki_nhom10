from model.enums import OrderStatus, PaymentMethod
import uuid
from datetime import datetime
from zoneinfo import ZoneInfo
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from model.orders import Order, OrderDetail
from model.thucdon import ThucDon

VN_TZ = ZoneInfo("Asia/Ho_Chi_Minh")


def now_vn_str() -> str:
    return datetime.now(VN_TZ).strftime("%Y-%m-%d %H:%M:%S")


def get_order_by_id(db: Session, order_id: str) -> Order | None:
    """Lấy đơn hàng theo ID kèm theo chi tiết món ăn."""
    stmt = (
        select(Order)
        .options(
            joinedload(Order.khachhang),
            joinedload(Order.chitiet).joinedload(OrderDetail.thucdon),
            joinedload(Order.payments)
        )
        .where(Order.id == order_id)
    )
    return db.execute(stmt).unique().scalar_one_or_none()


def get_orders_by_makh(db: Session, makh: str) -> list[Order]:
    """Lấy toàn bộ lịch sử đơn hàng của một khách hàng."""
    stmt = (
        select(Order)
        .options(joinedload(Order.chitiet).joinedload(OrderDetail.thucdon))
        .where(Order.makh == makh)
        .order_by(Order.thoigiandat.desc() if Order.thoigiandat is not None else Order.id.desc())
    )
    return list(db.execute(stmt).unique().scalars().all())


def create_order(
    db: Session,
    makh: str,
    hinhthucthanhtoan: str = PaymentMethod.CASH,
    ghichu: str | None = None,
) -> Order:
    """Khởi tạo một đơn hàng mới (ở trạng thái Giỏ hàng)."""
    order_id = f"OD-{uuid.uuid4().hex[:8].upper()}"
    thoigian = now_vn_str()

    order = Order(
        id=order_id,
        makh=makh,
        tongtien=0.0,
        trangthai=OrderStatus.CART,
        thoigiandat=thoigian,
        hinhthucthanhtoan=hinhthucthanhtoan,
        ghichu=ghichu,
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    return order


def add_item_to_order(db: Session, order: Order, mamon: str, soluong: int, gia: float) -> OrderDetail:
    """Thêm một món ăn vào chi tiết đơn hàng (hoặc tăng số lượng nếu đã có)."""
    stmt = select(OrderDetail).where(
        OrderDetail.order_id == order.id,
        OrderDetail.mamon == mamon
    )
    detail = db.execute(stmt).scalar_one_or_none()

    if detail:
        detail.soluong += soluong
        detail.gia = gia  # cập nhật giá mới nhất
    else:
        detail = OrderDetail(
            order_id=order.id,
            mamon=mamon,
            soluong=soluong,
            gia=gia
        )
        db.add(detail)

    db.commit()
    db.refresh(detail)
    return detail


def update_order_item(db: Session, order: Order, mamon: str, new_soluong: int, gia: float) -> None:
    """Cập nhật số lượng của một món ăn trong đơn. Nếu số lượng bằng 0 sẽ xóa món khỏi đơn."""
    stmt = select(OrderDetail).where(
        OrderDetail.order_id == order.id,
        OrderDetail.mamon == mamon
    )
    detail = db.execute(stmt).scalar_one_or_none()

    if detail:
        if new_soluong <= 0:
            db.delete(detail)
        else:
            detail.soluong = new_soluong
            detail.gia = gia
        db.commit()


def recalculate_order_total(db: Session, order: Order) -> float:
    """Tính toán lại tổng tiền của đơn hàng dựa trên tổng chi tiết các món."""
    total = 0.0
    for detail in order.chitiet:
        if detail.gia and detail.soluong:
            total += detail.gia * detail.soluong

    order.tongtien = total
    db.add(order)
    db.commit()
    db.refresh(order)
    return total


def update_order_status(db: Session, order: Order, trangthai: str) -> Order:
    """Cập nhật trạng thái của đơn hàng."""
    old_status = order.trangthai
    order.trangthai = trangthai
    if old_status == OrderStatus.CART and trangthai != OrderStatus.CART:
        # Chỉ ghi thời gian chốt đặt hàng một lần, không đổi khi admin cập nhật trạng thái.
        order.thoigiandat = now_vn_str()
    db.add(order)
    db.commit()
    db.refresh(order)
    return order


def delete_order(db: Session, order: Order) -> None:
    """Xóa đơn hàng và chi tiết đơn hàng (CASCADE tự động do quan hệ)."""
    db.delete(order)
    db.commit()

def get_all_orders(db: Session) -> list[Order]:
    """Lấy toàn bộ đơn hàng của tất cả khách hàng (cho Admin)."""
    stmt = (
        select(Order)
        .options(
            joinedload(Order.khachhang),
            joinedload(Order.chitiet).joinedload(OrderDetail.thucdon),
            joinedload(Order.payments)
        )
        .order_by(Order.thoigiandat.desc() if Order.thoigiandat is not None else Order.id.desc())
    )
    return list(db.execute(stmt).unique().scalars().all())


def get_orders_by_date(db: Session, date_str: str) -> list[Order]:
    """Lọc đơn hàng theo ngày (cho Admin), format: YYYY-MM-DD."""
    stmt = (
        select(Order)
        .options(
            joinedload(Order.khachhang),
            joinedload(Order.chitiet).joinedload(OrderDetail.thucdon),
            joinedload(Order.payments)
        )
        .where(Order.thoigiandat.startswith(date_str))
        .order_by(Order.thoigiandat.desc() if Order.thoigiandat is not None else Order.id.desc())
    )
    return list(db.execute(stmt).unique().scalars().all())
