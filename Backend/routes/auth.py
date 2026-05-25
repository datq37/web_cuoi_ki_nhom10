from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from schemas.auth import LoginRequest, LogoutRequest, RefreshRequest, Token
from schemas.user import UserRegister, UserResponse
from service import auth as auth_service
from service import user as user_service

router = APIRouter(prefix="/auth", tags=["Xác thực"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(
    data: UserRegister,
    db: Annotated[Session, Depends(get_db)],
):
    """Đăng ký — mặc định role Nhân viên (có thể gửi role khác nếu cần)."""
    return user_service.register_user(db, data)


@router.post("/login", response_model=Token)
def login(
    data: LoginRequest,
    db: Annotated[Session, Depends(get_db)],
):
    """Đăng nhập email + mật khẩu, trả về access & refresh token."""
    user = auth_service.authenticate_user(db, data.email, data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Email hoặc mật khẩu không đúng")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Tài khoản đã bị vô hiệu hóa")
    return auth_service.issue_token_pair(db, user)


@router.post("/refresh", response_model=Token)
def refresh_token_endpoint(
    data: RefreshRequest,
    db: Annotated[Session, Depends(get_db)],
):
    """Làm mới access token."""
    tokens = auth_service.refresh_access_token(db, data.refresh_token)
    if not tokens:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token không hợp lệ")
    return tokens


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(
    data: LogoutRequest,
    db: Annotated[Session, Depends(get_db)],
):
    """Đăng xuất — thu hồi refresh token trên server."""
    if not auth_service.logout(db, data.refresh_token):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Refresh token không hợp lệ")
