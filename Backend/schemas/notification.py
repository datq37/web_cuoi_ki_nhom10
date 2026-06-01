from pydantic import BaseModel

class BaseNotificationResponse(BaseModel):
    message: str

class OutOfStockItem(BaseModel):
    mamon: str
    ten: str | None = None

class OutOfStockResponse(BaseModel):
    message: str
    items: list[OutOfStockItem]
