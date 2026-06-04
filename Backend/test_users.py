from database import SessionLocal
from model.khachhang import KhachHang

db = SessionLocal()
users = db.query(KhachHang).all()
print(f"Tổng số khách hàng trong DB: {len(users)}")
for u in users:
    print(f"Tài khoản: {u.taikhoan}, Mật khẩu: {u.matkhau}")
db.close()
