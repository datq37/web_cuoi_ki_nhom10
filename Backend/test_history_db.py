from database import SessionLocal
from crud.orders import get_orders_by_makh
from schemas.orders import OrderResponse

db = SessionLocal()
orders = get_orders_by_makh(db, "KH-987E7770")
for o in orders:
    res = OrderResponse.model_validate(o)
    print(res.model_dump(by_alias=True))
