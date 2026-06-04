import time, requests, json, os

token_file = "token.txt"
if os.path.exists(token_file):
    with open(token_file, "r") as f:
        token = f.read().strip()
    
    start = time.time()
    res = requests.get("http://localhost:8001/api/v1/orders/history", headers={"Authorization": f"Bearer {token}"})
    print(f"Fetch Orders took: {time.time() - start:.3f} seconds. Status: {res.status_code}")
else:
    print("No token")
