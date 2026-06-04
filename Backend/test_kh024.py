from database import SessionLocal
from model.orders import Order
from model.khachhang import KhachHang
import service.orders as orders_service

db = SessionLocal()
orders = orders_service.get_user_orders_history(db, "KH024")
print(f"History returned {len(orders)} orders for KH024")
for o in orders:
    print(o.madon)

