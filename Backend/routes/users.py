import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from crud import user as user_crud
from database import get_db
from dependencies import get_current_active_admin, get_current_user
from model.user import User, UserRole
from schemas.user import ProfileUpdate, UserCreate, UserListResponse, UserResponse, UserUpdate
from service import user as user_service

router = APIRouter(prefix="/users", tags=["Người dùng"])


@router.get("/me", response_model=UserResponse)
def get_me(current_user: Annotated[User, Depends(get_current_user)]):
    """Xem hồ sơ cá nhân."""
    return current_user


@router.patch("/me", response_model=UserResponse)
def update_me(
    data: ProfileUpdate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    """Cập nhật hồ sơ cá nhân."""
    return user_service.update_profile(db, current_user, data)


@router.get("", response_model=UserListResponse)
def list_users(
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[User, Depends(get_current_active_admin)],
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    role: UserRole | None = None,
    is_active: bool | None = None,
):
    """Admin: danh sách tài khoản."""
    skip = (page - 1) * page_size
    users, total = user_crud.get_users(db, skip=skip, limit=page_size, role=role, is_active=is_active)
    return UserListResponse(items=users, total=total, page=page, page_size=page_size)


@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: uuid.UUID,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[User, Depends(get_current_active_admin)],
):
    """Admin: chi tiết tài khoản."""
    return user_service.get_user_or_404(db, user_id)


@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(
    data: UserCreate,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[User, Depends(get_current_active_admin)],
):
    """Admin: tạo tài khoản."""
    return user_service.create_user_admin(db, data)


@router.patch("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: uuid.UUID,
    data: UserUpdate,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[User, Depends(get_current_active_admin)],
):
    """Admin: cập nhật tài khoản."""
    return user_service.update_user_admin(db, user_id, data)


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: uuid.UUID,
    db: Annotated[Session, Depends(get_db)],
    current_admin: Annotated[User, Depends(get_current_active_admin)],
):
    """Admin: xóa tài khoản."""
    user_service.delete_user_admin(db, user_id, current_admin)
