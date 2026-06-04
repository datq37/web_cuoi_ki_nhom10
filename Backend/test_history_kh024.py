import json
from database import SessionLocal
from model.orders import Order
import service.orders as orders_service
from schemas.orders import OrderResponse

db = SessionLocal()
orders = orders_service.get_user_orders_history(db, "KH024")
responses = [OrderResponse.model_validate(o).model_dump() for o in orders]
# custom encoder for datetime
class DateTimeEncoder(json.JSONEncoder):
    def default(self, obj):
        if hasattr(obj, 'isoformat'):
            return obj.isoformat()
        return super().default(obj)
print(json.dumps(responses, indent=2, cls=DateTimeEncoder))
