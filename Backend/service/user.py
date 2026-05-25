import uuid

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from crud import user as user_crud
from model.user import User
from schemas.user import ProfileUpdate, UserCreate, UserRegister, UserUpdate
from service.auth import get_password_hash, verify_password


def register_user(db: Session, data: UserRegister) -> User:
    if user_crud.get_user_by_email(db, data.email):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email đã được sử dụng")
    return user_crud.create_user_from_register(db, data, get_password_hash(data.password))


def create_user_admin(db: Session, data: UserCreate) -> User:
    if user_crud.get_user_by_email(db, data.email):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email đã được sử dụng")
    return user_crud.create_user_from_schema(db, data, get_password_hash(data.password))


def update_user_admin(db: Session, user_id: uuid.UUID, data: UserUpdate) -> User:
    user = user_crud.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy người dùng")

    if data.email and data.email != user.email and user_crud.get_user_by_email(db, data.email):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email đã được sử dụng")

    hashed = get_password_hash(data.password) if data.password else None
    return user_crud.update_user(db, user, data, hashed)


def update_profile(db: Session, user: User, data: ProfileUpdate) -> User:
    hashed = None
    if data.new_password:
        if not data.current_password or not verify_password(data.current_password, user.hashed_password):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Mật khẩu hiện tại không đúng")
        hashed = get_password_hash(data.new_password)
    return user_crud.update_profile(db, user, data, hashed)


def delete_user_admin(db: Session, user_id: uuid.UUID, current_user: User) -> None:
    if user_id == current_user.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Không thể xóa tài khoản của chính mình")
    user = user_crud.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy người dùng")
    user_crud.delete_user(db, user)


def get_user_or_404(db: Session, user_id: uuid.UUID) -> User:
    user = user_crud.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy người dùng")
    return user
