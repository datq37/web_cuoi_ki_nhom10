import uuid
from datetime import datetime
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from model.orders import Order, OrderDetail
from model.thucdon import ThucDon


def get_order_by_id(db: Session, order_id: str) -> Order | None:
    """Lấy đơn hàng theo ID kèm theo chi tiết món ăn."""
    stmt = (
        select(Order)
        .options(joinedload(Order.chitiet).joinedload(OrderDetail.thucdon))
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


def create_order(db: Session, makh: str, hinhthucthanhtoan: str = "Tiền mặt") -> Order:
    """Khởi tạo một đơn hàng mới (ở trạng thái Giỏ hàng)."""
    order_id = f"OD-{uuid.uuid4().hex[:8].upper()}"
    thoigian = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    order = Order(
        id=order_id,
        makh=makh,
        tongtien=0.0,
        trangthai="Giỏ hàng",
        thoigiandat=thoigian,
        hinhthucthanhtoan=hinhthucthanhtoan,
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
    order.trangthai = trangthai
    if trangthai != "Giỏ hàng":
        # Cập nhật lại thời gian chốt đặt hàng thực tế
        order.thoigiandat = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    db.add(order)
    db.commit()
    db.refresh(order)
    return order


def delete_order(db: Session, order: Order) -> None:
    """Xóa đơn hàng và chi tiết đơn hàng (CASCADE tự động do quan hệ)."""
    db.delete(order)
    db.commit()
