import sys
from fastapi.testclient import TestClient
from main import app
from database import SessionLocal
from dependencies import get_current_user
from model.khachhang import KhachHang

# Override dependency
def override_get_current_user():
    return KhachHang(makh="KH-987E7770", vaitro="Admin")
    
app.dependency_overrides[get_current_user] = override_get_current_user

client = TestClient(app)
response = client.get("/api/v1/orders/history")
print("STATUS:", response.status_code)
print("DATA:", response.json())
