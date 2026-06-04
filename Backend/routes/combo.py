from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from crud import combo as combo_crud
from database import get_db
from dependencies import get_current_active_admin, get_current_user
from model.khachhang import KhachHang
from schemas.combo import ComboCreate, ComboListResponse, ComboResponse, ComboUpdate

router = APIRouter(prefix="/combos", tags=["Combo"])


@router.get("", response_model=ComboListResponse)
def list_combos(
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[KhachHang, Depends(get_current_user)],
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
):
    items, total = combo_crud.get_items(db, skip=skip, limit=limit)
    return {"items": items, "total": total}


@router.post("", response_model=ComboResponse, status_code=status.HTTP_201_CREATED)
def create_combo(
    data: ComboCreate,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[KhachHang, Depends(get_current_active_admin)],
):
    return combo_crud.create_item(db, data)


@router.patch("/{combo_id}", response_model=ComboResponse)
def update_combo(
    combo_id: int,
    data: ComboUpdate,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[KhachHang, Depends(get_current_active_admin)],
):
    db_item = combo_crud.update_item(db, combo_id, data)
    if not db_item:
        raise HTTPException(status_code=404, detail="Không tìm thấy combo.")
    return db_item


@router.delete("/{combo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_combo(
    combo_id: int,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[KhachHang, Depends(get_current_active_admin)],
):
    success = combo_crud.delete_item(db, combo_id)
    if not success:
        raise HTTPException(status_code=404, detail="Không tìm thấy combo.")
