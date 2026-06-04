import requests

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

res = requests.post('http://localhost:8000/api/v1/auth/login', json={'taikhoan':'admin', 'matkhau':'123456'})
token = res.json().get('access_token') or res.json().get('accessToken')
if not token:
    print("Login failed:", res.text)
else:
    res2 = requests.post('http://localhost:8000/api/v1/promotions', json=data, headers={'Authorization': f'Bearer {token}'})
    print(res2.status_code, res2.text)
