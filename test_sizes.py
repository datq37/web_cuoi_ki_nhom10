from Backend.database import engine, SessionLocal
from Backend.models import ThucDon
from sqlalchemy import text

db = SessionLocal()
res = db.execute(text("SELECT mamon, octet_length(hinhanh) FROM thucdon WHERE hinhanh IS NOT NULL")).fetchall()
for r in res:
    print(f"Món {r[0]}: {r[1]} bytes")
