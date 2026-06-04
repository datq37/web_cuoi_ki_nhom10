from sqlalchemy.orm import Session
from model.khuyenmai import KhuyenMai
from schemas.khuyenmai import KhuyenMaiCreate, KhuyenMaiUpdate

def get_items(db: Session, skip: int = 0, limit: int = 100):
    total = db.query(KhuyenMai).count()
    items = db.query(KhuyenMai).offset(skip).limit(limit).all()
    return items, total

def get_item(db: Session, promo_id: int):
    return db.query(KhuyenMai).filter(KhuyenMai.id == promo_id).first()

def get_item_by_ma(db: Session, ma: str):
    return db.query(KhuyenMai).filter(KhuyenMai.ma == ma).first()

def create_item(db: Session, item: KhuyenMaiCreate):
    dump_data = item.model_dump()
    if 'hoatdong' in dump_data and isinstance(dump_data['hoatdong'], bool):
        dump_data['hoatdong'] = 1 if dump_data['hoatdong'] else 0
    db_item = KhuyenMai(**dump_data)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def update_item(db: Session, promo_id: int, item: KhuyenMaiUpdate):
    db_item = db.query(KhuyenMai).filter(KhuyenMai.id == promo_id).first()
    if not db_item:
        return None
    
    update_data = item.model_dump(exclude_unset=True)
    if 'hoatdong' in update_data and isinstance(update_data['hoatdong'], bool):
        update_data['hoatdong'] = 1 if update_data['hoatdong'] else 0
    for key, value in update_data.items():
        setattr(db_item, key, value)
        
    db.commit()
    db.refresh(db_item)
    return db_item

def delete_item(db: Session, promo_id: int):
    db_item = db.query(KhuyenMai).filter(KhuyenMai.id == promo_id).first()
    if db_item:
        db.delete(db_item)
        db.commit()
        return True
    return False
