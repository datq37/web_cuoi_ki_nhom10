from database import SessionLocal
from service.auth import create_access_token
from model.khachhang import KhachHang
import urllib.request
import urllib.parse
import json

db = SessionLocal()
admin = db.query(KhachHang).filter_by(taikhoan='admin').first()
if not admin:
    print("No admin found")
    exit(1)

token = create_access_token(admin)
data = {
    "ma": "TEST03",
    "ten": "Test Promo 3",
    "mota": "abc",
    "loai": "phan_tram",
    "giatrigiam": 10,
    "dontooithieu": 0,
    "gioihan": 100,
    "hansudung": "2026-12-31",
    "trangthai": "dang_chay",
    "hoatdong": True
}
req = urllib.request.Request(
    'http://localhost:8001/api/v1/promotions',
    data=json.dumps(data).encode('utf-8'),
    headers={
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    },
    method='POST'
)
try:
    with urllib.request.urlopen(req) as response:
        print(response.status, response.read().decode())
except urllib.error.HTTPError as e:
    print(e.code, e.read().decode())
