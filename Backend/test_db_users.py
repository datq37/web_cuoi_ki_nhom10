from database import SessionLocal
from model.khachhang import KhachHang
from model.orders import Order

db = SessionLocal()
users = db.query(KhachHang).all()
print("Users:")
for u in users:
    print(f"{u.makh} - {u.taikhoan} - {u.ten}")

orders = db.query(Order).all()
print("\nOrders:")
for o in orders:
    print(f"Order {o.id} - Customer {o.makh} - Status {o.trangthai}")
