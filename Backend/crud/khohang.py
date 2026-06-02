from sqlalchemy.orm import Session
from model.khohang import KhoHang
from schemas.khohang import KhoHangCreate, KhoHangUpdate

def get_items(db: Session, skip: int = 0, limit: int = 100):
    total = db.query(KhoHang).count()
    items = db.query(KhoHang).offset(skip).limit(limit).all()
    return items, total

def get_item(db: Session, mahang: str):
    return db.query(KhoHang).filter(KhoHang.mahang == mahang).first()

def create_item(db: Session, item: KhoHangCreate):
    db_item = KhoHang(**item.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def update_item(db: Session, mahang: str, item: KhoHangUpdate):
    db_item = db.query(KhoHang).filter(KhoHang.mahang == mahang).first()
    if not db_item:
        return None
    
    update_data = item.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_item, key, value)
        
    db.commit()
    db.refresh(db_item)
    return db_item

def delete_item(db: Session, mahang: str):
    db_item = db.query(KhoHang).filter(KhoHang.mahang == mahang).first()
    if db_item:
        db.delete(db_item)
        db.commit()
        return True
    return False
