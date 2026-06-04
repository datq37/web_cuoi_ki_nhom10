from database import SessionLocal
from model.orders import Order
from model.khachhang import KhachHang

db = SessionLocal()
orders = db.query(Order).all()
print(f"Total orders in DB: {len(orders)}")
for o in orders:
    print(f"Order {o.id} - Customer {o.makh} - Status {o.trangthai}")
