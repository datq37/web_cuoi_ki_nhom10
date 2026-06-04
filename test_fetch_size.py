import requests, time

res = requests.post("http://localhost:8001/api/v1/auth/login", data={"username": "testuser", "password": "testuser"})
token = res.json().get("access_token")

start = time.time()
res = requests.get("http://localhost:8001/api/v1/menus/items", headers={"Authorization": f"Bearer {token}"})
end = time.time()

print(f"Menus API size: {len(res.content)} bytes")
print(f"Time taken: {end - start:.3f} seconds")

start = time.time()
res = requests.get("http://localhost:8001/api/v1/orders/history", headers={"Authorization": f"Bearer {token}"})
end = time.time()

print(f"Orders API size: {len(res.content)} bytes")
print(f"Time taken: {end - start:.3f} seconds")

