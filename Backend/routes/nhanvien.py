from typing import Annotated
from fastapi import APIRouter, Depends, Query, status, HTTPException
from sqlalchemy.orm import Session

from crud import nhanvien as nhanvien_crud
from database import get_db
from dependencies import get_current_active_admin
from model.khachhang import KhachHang
from schemas.nhanvien import NhanVienCreate, NhanVienResponse, NhanVienUpdate, NhanVienListResponse

router = APIRouter(prefix="/employees", tags=["Nhân viên"])

@router.get("", response_model=NhanVienListResponse)
def list_employees(
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[KhachHang, Depends(get_current_active_admin)],
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
):
    """Admin: Xem danh sách nhân viên."""
    items, total = nhanvien_crud.get_items(db, skip=skip, limit=limit)
    return {"items": items, "total": total}

@router.post("", response_model=NhanVienResponse, status_code=status.HTTP_201_CREATED)
def create_employee(
    data: NhanVienCreate,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[KhachHang, Depends(get_current_active_admin)],
):
    """Admin: Thêm nhân viên."""
    if nhanvien_crud.get_item(db, manv=data.manv):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mã nhân viên đã tồn tại."
        )
    return nhanvien_crud.create_item(db, item=data)

@router.patch("/{manv}", response_model=NhanVienResponse)
def update_employee(
    manv: str,
    data: NhanVienUpdate,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[KhachHang, Depends(get_current_active_admin)],
):
    """Admin: Cập nhật nhân viên."""
    db_item = nhanvien_crud.update_item(db, manv=manv, item=data)
    if not db_item:
        raise HTTPException(status_code=404, detail="Không tìm thấy nhân viên.")
    return db_item

@router.delete("/{manv}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(
    manv: str,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[KhachHang, Depends(get_current_active_admin)],
):
    """Admin: Xóa nhân viên."""
    success = nhanvien_crud.delete_item(db, manv=manv)
    if not success:
        raise HTTPException(status_code=404, detail="Không tìm thấy nhân viên.")
