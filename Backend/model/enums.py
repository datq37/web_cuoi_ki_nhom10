from enum import Enum

class OrderStatus(str, Enum):
    CART = "cart"
    PENDING_CONFIRMATION = "pending_confirmation"
    CONFIRMED = "confirmed"
    PROCESSING = "processing"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class PaymentMethod(str, Enum):
    CASH = "cash"
    BANKING = "banking"

class PaymentStatus(str, Enum):
    PENDING = "pending"
    PAID = "paid"
    CANCELLED = "cancelled"
