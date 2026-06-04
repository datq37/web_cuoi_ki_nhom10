from fastapi.testclient import TestClient
from main import app
from database import SessionLocal
from service.auth import create_access_token
from model.khachhang import KhachHang

client = TestClient(app)

db = SessionLocal()
admin = db.query(KhachHang).filter_by(taikhoan="admin").first()
token = create_access_token(data={"sub": admin.taikhoan})

response = client.post(
    "/api/v1/promotions",
    headers={"Authorization": f"Bearer {token}"},
    json={
        "ma": "TEST02",
        "ten": "Test Promo 2",
        "loai": "phan_tram",
        "giatrigiam": 10,
        "dontooithieu": 100000,
        "gioihan": 100,
        "hansudung": "2026-12-31",
        "trangthai": "dang_chay",
        "hoatdong": True
    }
)
print(response.status_code, response.json())
