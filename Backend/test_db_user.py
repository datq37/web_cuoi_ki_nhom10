from database import SessionLocal
from model.khachhang import KhachHang

db = SessionLocal()
kh = db.query(KhachHang).filter(KhachHang.taikhoan == 'ngoc.lb21').first()
if kh:
    print(f"Found! User: '{kh.taikhoan}', Pass: '{kh.matkhau}'")
    print("Length of pass:", len(kh.matkhau) if kh.matkhau else 0)
    print("Pass repr:", repr(kh.matkhau))
else:
    print("User not found!")
