import requests

# 1. Login to get token
resp = requests.post("http://localhost:8001/api/v1/auth/login", data={"username": "testuser", "password": "testuser"})
print("Login:", resp.status_code, resp.text)

token = resp.json().get("access_token")
if token:
    headers = {"Authorization": f"Bearer {token}"}
    res2 = requests.get("http://localhost:8001/api/v1/orders/history", headers=headers)
    print("History:", res2.status_code, res2.text)
