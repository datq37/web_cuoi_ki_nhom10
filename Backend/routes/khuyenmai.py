from typing import Annotated
from fastapi import APIRouter, Depends, Query, status, HTTPException
from sqlalchemy.orm import Session

from crud import khuyenmai as khuyenmai_crud
from database import get_db
from dependencies import get_current_active_admin, get_current_user
from model.khachhang import KhachHang
from schemas.khuyenmai import KhuyenMaiCreate, KhuyenMaiResponse, KhuyenMaiUpdate, KhuyenMaiListResponse

router = APIRouter(prefix="/promotions", tags=["Khuyến mãi"])

@router.get("", response_model=KhuyenMaiListResponse)
def list_promotions(
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[KhachHang, Depends(get_current_active_admin)],
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
):
    """Admin: Xem danh sách khuyến mãi."""
    items, total = khuyenmai_crud.get_items(db, skip=skip, limit=limit)
    return {"items": items, "total": total}

@router.post("", response_model=KhuyenMaiResponse, status_code=status.HTTP_201_CREATED)
def create_promotion(
    data: KhuyenMaiCreate,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[KhachHang, Depends(get_current_active_admin)],
):
    """Admin: Thêm khuyến mãi."""
    if khuyenmai_crud.get_item_by_ma(db, ma=data.ma):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mã khuyến mãi đã tồn tại."
        )
    return khuyenmai_crud.create_item(db, item=data)

@router.patch("/{promo_id}", response_model=KhuyenMaiResponse)
def update_promotion(
    promo_id: int,
    data: KhuyenMaiUpdate,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[KhachHang, Depends(get_current_active_admin)],
):
    """Admin: Cập nhật khuyến mãi."""
    db_item = khuyenmai_crud.update_item(db, promo_id=promo_id, item=data)
    if not db_item:
        raise HTTPException(status_code=404, detail="Không tìm thấy khuyến mãi.")
    return db_item

@router.delete("/{promo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_promotion(
    promo_id: int,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[KhachHang, Depends(get_current_active_admin)],
):
    """Admin: Xóa khuyến mãi."""
    success = khuyenmai_crud.delete_item(db, promo_id=promo_id)
    if not success:
        raise HTTPException(status_code=404, detail="Không tìm thấy khuyến mãi.")
