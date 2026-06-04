from database import SessionLocal
from model.thucdon import ThucDon
db = SessionLocal()
mon_ans = db.query(ThucDon).all()
for m in mon_ans:
    if m.hinhanh and m.hinhanh.startswith('/uploads'):
        print(f"{m.mamon}: {m.hinhanh}")
    elif m.hinhanh:
        print(f"{m.mamon}: {m.hinhanh[:50]} (length: {len(m.hinhanh)})")
    else:
        print(f"{m.mamon}: NULL")
db.close()
