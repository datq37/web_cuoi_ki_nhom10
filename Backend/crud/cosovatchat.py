from sqlalchemy.orm import Session
from model.cosovatchat import CoSoVatChat
from schemas.cosovatchat import CoSoVatChatCreate, CoSoVatChatUpdate

def get_item(db: Session, id: str):
    return db.query(CoSoVatChat).filter(CoSoVatChat.id == id).first()

def get_items(db: Session, skip: int = 0, limit: int = 100):
    total = db.query(CoSoVatChat).count()
    items = db.query(CoSoVatChat).offset(skip).limit(limit).all()
    return items, total

def create_item(db: Session, item: CoSoVatChatCreate):
    db_item = CoSoVatChat(
        id=item.id,
        ten=item.ten,
        soluong=item.soluong,
        chatluong=item.chatluong,
        danhmuc=item.danhmuc,
        ghichu=item.ghichu
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def update_item(db: Session, id: str, item: CoSoVatChatUpdate):
    db_item = get_item(db, id=id)
    if db_item:
        update_data = item.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_item, key, value)
        db.commit()
        db.refresh(db_item)
    return db_item

def delete_item(db: Session, id: str):
    db_item = get_item(db, id=id)
    if db_item:
        db.delete(db_item)
        db.commit()
        return True
    return False
