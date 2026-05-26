from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from schemas.auth import LoginRequest, LogoutRequest, RefreshRequest, Token
from schemas.khachhang import KhachHangRegister, KhachHangResponse
from service import auth as auth_service
from service import khachhang as khachhang_service

router = APIRouter(prefix="/auth", tags=["Xác thực"])


@router.post("/register", response_model=KhachHangResponse, status_code=status.HTTP_201_CREATED)
def register(
    data: KhachHangRegister,
    db: Annotated[Session, Depends(get_db)],
):
    """Đăng ký tài khoản khách hàng mới."""
    return khachhang_service.register_khachhang(db, data)


@router.post("/login", response_model=Token)
def login(
    data: LoginRequest,
    db: Annotated[Session, Depends(get_db)],
):
    """Đăng nhập bằng tài khoản và mật khẩu, trả về access & refresh token."""
    khachhang = auth_service.authenticate_user(db, data.taikhoan, data.matkhau)
    if not khachhang:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Tài khoản hoặc mật khẩu không đúng")
    
    return auth_service.issue_token_pair(db, khachhang)


@router.post("/refresh", response_model=Token)
def refresh_token_endpoint(
    data: RefreshRequest,
    db: Annotated[Session, Depends(get_db)],
):
    """Làm mới access token bằng refresh token hợp lệ."""
    tokens = auth_service.refresh_access_token(db, data.refresh_token)
    if not tokens:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token không hợp lệ hoặc đã bị thu hồi")
    return tokens


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(
    data: LogoutRequest,
    db: Annotated[Session, Depends(get_db)],
):
    """Đăng xuất — thu hồi refresh token."""
    if not auth_service.logout(db, data.refresh_token):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Refresh token không hợp lệ")
