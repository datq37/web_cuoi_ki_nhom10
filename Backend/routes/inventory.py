from typing import Annotated
from fastapi import APIRouter, Depends, Query, status, HTTPException
from sqlalchemy.orm import Session

from crud import khohang as khohang_crud
from database import get_db
from dependencies import get_current_active_admin
from model.khachhang import KhachHang
from schemas.khohang import KhoHangCreate, KhoHangResponse, KhoHangUpdate, KhoHangListResponse

router = APIRouter(prefix="/inventory", tags=["Kho nguyên liệu"])

@router.get("", response_model=KhoHangListResponse)
def list_inventory(
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[KhachHang, Depends(get_current_active_admin)],
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
):
    """Admin: Xem danh sách nguyên liệu."""
    items, total = khohang_crud.get_items(db, skip=skip, limit=limit)
    return {"items": items, "total": total}

@router.post("", response_model=KhoHangResponse, status_code=status.HTTP_201_CREATED)
def create_inventory(
    data: KhoHangCreate,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[KhachHang, Depends(get_current_active_admin)],
):
    """Admin: Thêm nguyên liệu."""
    # Check if mahang exists
    if khohang_crud.get_item(db, mahang=data.mahang):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mã hàng đã tồn tại."
        )
    return khohang_crud.create_item(db, item=data)

@router.patch("/{mahang}", response_model=KhoHangResponse)
def update_inventory(
    mahang: str,
    data: KhoHangUpdate,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[KhachHang, Depends(get_current_active_admin)],
):
    """Admin: Cập nhật nguyên liệu."""
    db_item = khohang_crud.update_item(db, mahang=mahang, item=data)
    if not db_item:
        raise HTTPException(status_code=404, detail="Không tìm thấy nguyên liệu.")
    return db_item

@router.delete("/{mahang}", status_code=status.HTTP_204_NO_CONTENT)
def delete_inventory(
    mahang: str,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[KhachHang, Depends(get_current_active_admin)],
):
    """Admin: Xóa nguyên liệu."""
    success = khohang_crud.delete_item(db, mahang=mahang)
    if not success:
        raise HTTPException(status_code=404, detail="Không tìm thấy nguyên liệu.")
