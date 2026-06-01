from sqlalchemy import select
from sqlalchemy.orm import Session

from model.orders import Order
from model.thucdon import ThucDon

def get_order_by_id(db: Session, order_id: str) -> Order | None:
    return db.get(Order, order_id)

def get_out_of_stock_items(db: Session) -> list[ThucDon]:
    stmt = select(ThucDon).where(ThucDon.hethang == True)
    return list(db.execute(stmt).scalars().all())
