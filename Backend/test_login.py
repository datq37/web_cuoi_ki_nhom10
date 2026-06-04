import requests
res = requests.post("http://127.0.0.1:8000/api/v1/auth/login", json={"taikhoan": "0987654321", "matkhau": "password123"})
print(res.status_code, res.text)
