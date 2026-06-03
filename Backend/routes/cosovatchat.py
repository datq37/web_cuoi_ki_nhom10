from typing import Annotated
from fastapi import APIRouter, Depends, Query, status, HTTPException
from sqlalchemy.orm import Session

from crud import cosovatchat as cosovatchat_crud
from database import get_db
from dependencies import get_current_active_admin
from model.khachhang import KhachHang
from schemas.cosovatchat import (
    CoSoVatChatCreate, 
    CoSoVatChatResponse, 
    CoSoVatChatUpdate, 
    CoSoVatChatListResponse
)

router = APIRouter(prefix="/facilities/equipments", tags=["Cơ sở vật chất"])

@router.get("", response_model=CoSoVatChatListResponse)
def list_equipments(
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[KhachHang, Depends(get_current_active_admin)],
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
):
    """Admin: Xem danh sách vật dụng & thiết bị."""
    items, total = cosovatchat_crud.get_items(db, skip=skip, limit=limit)
    return {"items": items, "total": total}

@router.post("", response_model=CoSoVatChatResponse, status_code=status.HTTP_201_CREATED)
def create_equipment(
    data: CoSoVatChatCreate,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[KhachHang, Depends(get_current_active_admin)],
):
    """Admin: Thêm vật dụng."""
    if cosovatchat_crud.get_item(db, id=data.id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mã vật dụng đã tồn tại."
        )
    return cosovatchat_crud.create_item(db, item=data)

@router.patch("/{id}", response_model=CoSoVatChatResponse)
def update_equipment(
    id: str,
    data: CoSoVatChatUpdate,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[KhachHang, Depends(get_current_active_admin)],
):
    """Admin: Cập nhật vật dụng."""
    db_item = cosovatchat_crud.update_item(db, id=id, item=data)
    if not db_item:
        raise HTTPException(status_code=404, detail="Không tìm thấy vật dụng.")
    return db_item

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_equipment(
    id: str,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[KhachHang, Depends(get_current_active_admin)],
):
    """Admin: Xóa vật dụng."""
    success = cosovatchat_crud.delete_item(db, id=id)
    if not success:
        raise HTTPException(status_code=404, detail="Không tìm thấy vật dụng.")
