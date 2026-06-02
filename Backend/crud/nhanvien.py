from sqlalchemy.orm import Session
from model.nhanvien import NhanVien
from schemas.nhanvien import NhanVienCreate, NhanVienUpdate

def get_items(db: Session, skip: int = 0, limit: int = 100):
    total = db.query(NhanVien).count()
    items = db.query(NhanVien).offset(skip).limit(limit).all()
    return items, total

def get_item(db: Session, manv: str):
    return db.query(NhanVien).filter(NhanVien.manv == manv).first()

def create_item(db: Session, item: NhanVienCreate):
    db_item = NhanVien(**item.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def update_item(db: Session, manv: str, item: NhanVienUpdate):
    db_item = db.query(NhanVien).filter(NhanVien.manv == manv).first()
    if not db_item:
        return None
    
    update_data = item.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_item, key, value)
        
    db.commit()
    db.refresh(db_item)
    return db_item

def delete_item(db: Session, manv: str):
    db_item = db.query(NhanVien).filter(NhanVien.manv == manv).first()
    if db_item:
        db.delete(db_item)
        db.commit()
        return True
    return False
