from database import SessionLocal
from schemas.khuyenmai import KhuyenMaiCreate
from crud.khuyenmai import create_item
from datetime import date

db = SessionLocal()

item = KhuyenMaiCreate(
    ma="TEST02",
    ten="Test Promo 2",
    loai="phan_tram",
    giatrigiam=10,
    dontooithieu=100000,
    gioihan=100,
    hansudung=date(2026, 12, 31),
    trangthai="dang_chay",
    hoatdong=True
)

try:
    print(create_item(db, item))
except Exception as e:
    import traceback
    traceback.print_exc()
