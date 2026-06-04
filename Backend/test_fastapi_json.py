from fastapi.encoders import jsonable_encoder
from schemas.orders import OrderResponse
import json

o = {
    "hinhthucthanhtoan": "cash",
    "id": "OD-7038749D",
    "makh": "KH024",
    "tongtien": 35000.0,
    "trangthai": "pending_confirmation",
    "thoigiandat": "2026-06-04 12:50:09",
    "chitiet": []
}
r = OrderResponse(**o)
print(json.dumps(jsonable_encoder(r)))
