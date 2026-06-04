from fastapi import HTTPException, status
from sqlalchemy.orm import Session, selectinload

from model.combo import Combo, ComboMonAn
from model.thucdon import ThucDon
from schemas.combo import ComboCreate, ComboUpdate


def _normalize_hoatdong(value):
    if isinstance(value, bool):
        return 1 if value else 0
    return value


def _validate_menu_items(db: Session, mon_an_ids: list[str]):
    unique_ids = list(dict.fromkeys(mon_an_ids))
    found = {
        item.mamon
        for item in db.query(ThucDon.mamon).filter(ThucDon.mamon.in_(unique_ids)).all()
    }
    missing = [mamon for mamon in unique_ids if mamon not in found]
    if missing:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Món ăn không tồn tại: {', '.join(missing)}",
        )
    return unique_ids


def _to_response(item: Combo):
    return {
        "id": item.id,
        "ten": item.ten,
        "mota": item.mota,
        "loai_gia": item.loai_gia,
        "gia_tri_giam": item.gia_tri_giam,
        "hansudung": item.hansudung,
        "trangthai": item.trangthai,
        "hoatdong": bool(item.hoatdong),
        "mon_an_ids": [detail.mamon for detail in item.mon_an],
    }


def get_items(db: Session, skip: int = 0, limit: int = 100):
    query = db.query(Combo).options(selectinload(Combo.mon_an))
    total = query.count()
    items = query.order_by(Combo.id.desc()).offset(skip).limit(limit).all()
    return [_to_response(item) for item in items], total


def get_item(db: Session, combo_id: int):
    item = (
        db.query(Combo)
        .options(selectinload(Combo.mon_an))
        .filter(Combo.id == combo_id)
        .first()
    )
    return _to_response(item) if item else None


def create_item(db: Session, item: ComboCreate):
    mon_an_ids = _validate_menu_items(db, item.mon_an_ids)
    dump_data = item.model_dump(exclude={"mon_an_ids"})
    dump_data["hoatdong"] = _normalize_hoatdong(dump_data.get("hoatdong"))

    db_item = Combo(**dump_data)
    db_item.mon_an = [ComboMonAn(mamon=mamon, soluong=1) for mamon in mon_an_ids]
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return get_item(db, db_item.id)


def update_item(db: Session, combo_id: int, item: ComboUpdate):
    db_item = (
        db.query(Combo)
        .options(selectinload(Combo.mon_an))
        .filter(Combo.id == combo_id)
        .first()
    )
    if not db_item:
        return None

    update_data = item.model_dump(exclude_unset=True)
    mon_an_ids = update_data.pop("mon_an_ids", None)
    if "hoatdong" in update_data:
        update_data["hoatdong"] = _normalize_hoatdong(update_data["hoatdong"])

    for key, value in update_data.items():
        setattr(db_item, key, value)

    if mon_an_ids is not None:
        valid_ids = _validate_menu_items(db, mon_an_ids)
        db_item.mon_an = [ComboMonAn(mamon=mamon, soluong=1) for mamon in valid_ids]

    db.commit()
    db.refresh(db_item)
    return get_item(db, db_item.id)


def delete_item(db: Session, combo_id: int):
    db_item = db.query(Combo).filter(Combo.id == combo_id).first()
    if not db_item:
        return False
    db.delete(db_item)
    db.commit()
    return True
