import re

with open('service/orders.py', 'r') as f:
    content = f.read()

new_functions = """

# --- ADMIN SERVICES ---

def get_all_orders_admin(db: Session) -> list[Order]:
    \"\"\"Lấy danh sách toàn bộ đơn hàng cho Admin.\"\"\"
    return orders_crud.get_all_orders(db)


def get_order_detail_admin(db: Session, order_id: str) -> Order:
    \"\"\"Lấy chi tiết đơn hàng cho Admin.\"\"\"
    order = orders_crud.get_order_by_id(db, order_id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Đơn hàng không tồn tại")
    return order


def update_order_status_admin(db: Session, order_id: str, new_status: str) -> Order:
    \"\"\"Cập nhật trạng thái đơn hàng (Admin).\"\"\"
    order = orders_crud.get_order_by_id(db, order_id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Đơn hàng không tồn tại")
    
    # Không tạo trạng thái lạ, đã được validate ở mức Schema Enum
    return orders_crud.update_order_status(db, order, new_status)


def get_orders_by_date_admin(db: Session, date_str: str) -> list[Order]:
    \"\"\"Lọc đơn hàng theo ngày cho Admin (format: YYYY-MM-DD).\"\"\"
    return orders_crud.get_orders_by_date(db, date_str)
"""

if 'def get_all_orders_admin' not in content:
    content += new_functions
    with open('service/orders.py', 'w') as f:
        f.write(content)

