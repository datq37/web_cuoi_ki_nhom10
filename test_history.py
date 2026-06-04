import requests
import os

token_file = "token.txt"
if not os.path.exists(token_file):
    # Get a token for testuser
    res = requests.post("http://localhost:8001/api/v1/auth/login", data={"username": "testuser", "password": "testuser"})
    if res.status_code == 200:
        token = res.json()["access_token"]
        with open(token_file, "w") as f:
            f.write(token)
    else:
        print("Login failed", res.json())
        exit(1)

with open(token_file, "r") as f:
    token = f.read().strip()

res = requests.get("http://localhost:8001/api/v1/orders/history", headers={"Authorization": f"Bearer {token}"})
print("STATUS CODE:", res.status_code)
print("RESPONSE:", res.json())
