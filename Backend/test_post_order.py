import requests

# Login as admin
resp = requests.post("http://localhost:8001/api/v1/auth/login", json={"taikhoan": "admin", "matkhau": "123456"})
token = resp.json().get("access_token")

# Post order with qr
headers = {"Authorization": f"Bearer {token}"}
payload = {
    "hinhthucthanhtoan": "qr",
    "chitiet": [{"mamon": "MON01", "soluong": 1}]
}
res = requests.post("http://localhost:8001/api/v1/orders", json=payload, headers=headers)
print("QR Payment:", res.status_code, res.text)

# Post order with cash
payload["hinhthucthanhtoan"] = "cash"
res2 = requests.post("http://localhost:8001/api/v1/orders", json=payload, headers=headers)
print("Cash Payment:", res2.status_code, res2.text)

