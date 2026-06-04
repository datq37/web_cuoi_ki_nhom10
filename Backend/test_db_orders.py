import sys
from database import SessionLocal
from model.orders import Order

db = SessionLocal()
orders = db.query(Order).all()
print("TOTAL ORDERS:", len(orders))
for o in orders:
    print(f"ID: {o.id}, Status: {o.trangthai}, Payment: {o.hinhthucthanhtoan}, Customer: {o.makh}")
