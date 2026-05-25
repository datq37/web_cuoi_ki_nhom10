import uuid
from datetime import datetime

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from model.user import RefreshToken, User, UserRole
from schemas.user import ProfileUpdate, UserCreate, UserRegister, UserUpdate


def get_user_by_id(db: Session, user_id: uuid.UUID) -> User | None:
    """Lấy user theo ID."""
    return db.get(User, user_id)


def get_user_by_email(db: Session, email: str) -> User | None:
    """Lấy user theo email (unique)."""
    stmt = select(User).where(User.email == email)
    return db.execute(stmt).scalar_one_or_none()


def get_users(
    db: Session,
    *,
    skip: int = 0,
    limit: int = 20,
    role: UserRole | None = None,
    is_active: bool | None = None,
) -> tuple[list[User], int]:
    """Danh sách user có phân trang và lọc."""
    stmt = select(User)
    count_stmt = select(func.count()).select_from(User)

    if role is not None:
        stmt = stmt.where(User.role == role)
        count_stmt = count_stmt.where(User.role == role)
    if is_active is not None:
        stmt = stmt.where(User.is_active == is_active)
        count_stmt = count_stmt.where(User.is_active == is_active)

    total = db.execute(count_stmt).scalar_one()
    users = (
        db.execute(stmt.order_by(User.created_at.desc()).offset(skip).limit(limit)).scalars().all()
    )
    return list(users), total


def create_user(
    db: Session,
    *,
    email: str,
    hashed_password: str,
    full_name: str,
    role: UserRole = UserRole.NHAN_VIEN,
    is_active: bool = True,
) -> User:
    """Thêm user mới vào DB."""
    user = User(
        email=email,
        hashed_password=hashed_password,
        full_name=full_name,
        role=role,
        is_active=is_active,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def create_user_from_schema(db: Session, data: UserCreate, hashed_password: str) -> User:
    return create_user(
        db,
        email=data.email,
        hashed_password=hashed_password,
        full_name=data.full_name,
        role=data.role,
    )


def create_user_from_register(db: Session, data: UserRegister, hashed_password: str) -> User:
    return create_user(
        db,
        email=data.email,
        hashed_password=hashed_password,
        full_name=data.full_name,
        role=data.role,
    )


def update_user(db: Session, user: User, data: UserUpdate, hashed_password: str | None = None) -> User:
    """Cập nhật user (Admin)."""
    update_data = data.model_dump(exclude_unset=True)
    if hashed_password:
        update_data["hashed_password"] = hashed_password
    update_data.pop("password", None)

    for field, value in update_data.items():
        setattr(user, field, value)

    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def update_profile(db: Session, user: User, data: ProfileUpdate, hashed_password: str | None = None) -> User:
    """Cập nhật hồ sơ cá nhân."""
    if hashed_password:
        user.hashed_password = hashed_password
    if data.full_name is not None:
        user.full_name = data.full_name

    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def delete_user(db: Session, user: User) -> None:
    db.delete(user)
    db.commit()


# --- Refresh token (phục vụ logout) ---


def save_refresh_token(
    db: Session,
    *,
    user_id: uuid.UUID,
    token_jti: str,
    expires_at: datetime,
) -> RefreshToken:
    record = RefreshToken(user_id=user_id, token_jti=token_jti, expires_at=expires_at)
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def get_refresh_token_by_jti(db: Session, token_jti: str) -> RefreshToken | None:
    stmt = select(RefreshToken).where(RefreshToken.token_jti == token_jti)
    return db.execute(stmt).scalar_one_or_none()


def revoke_refresh_token(db: Session, token: RefreshToken) -> None:
    token.revoked = True
    db.add(token)
    db.commit()
