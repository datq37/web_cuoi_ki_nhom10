from database import SessionLocal
from model.thucdon import ThucDon
db = SessionLocal()
mon_ans = db.query(ThucDon).limit(5).all()
for m in mon_ans:
    print(f"{m.mamon}: {m.hinhanh}")
db.close()
