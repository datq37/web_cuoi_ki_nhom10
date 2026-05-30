import re

with open('crud/orders.py', 'r') as f:
    content = f.read()

new_functions = """
def get_all_orders(db: Session) -> list[Order]:
    \"\"\"Lấy toàn bộ đơn hàng của tất cả khách hàng (cho Admin).\"\"\"
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
    \"\"\"Lọc đơn hàng theo ngày (cho Admin), format: YYYY-MM-DD.\"\"\"
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
"""

if 'def get_all_orders' not in content:
    content += new_functions
    with open('crud/orders.py', 'w') as f:
        f.write(content)
