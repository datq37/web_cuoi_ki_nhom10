from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from crud import khachhang as khachhang_crud
from database import get_db
from model.khachhang import KhachHang
from service.auth import get_token_data

security = HTTPBearer(auto_error=False)


async def get_current_user(
    db: Annotated[Session, Depends(get_db)],
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(security)],
) -> KhachHang:
    """Giải mã JWT access token và trả về khách hàng hiện tại."""
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Chưa xác thực",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token_data = get_token_data(credentials.credentials)
    if token_data is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token không hợp lệ hoặc đã hết hạn",
            headers={"WWW-Authenticate": "Bearer"},
        )

    khachhang = khachhang_crud.get_khachhang_by_makh(db, token_data.makh)
    if khachhang is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Tài khoản không tồn tại")
    
    return khachhang


async def get_current_active_admin(
    current_user: Annotated[KhachHang, Depends(get_current_user)],
) -> KhachHang:
    """Chỉ Admin mới được truy cập các route quản trị."""
    if current_user.vaitro != "Admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Bạn không có quyền thực hiện thao tác này")
    return current_user
