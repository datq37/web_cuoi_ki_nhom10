import uuid
from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

import config
from crud import user as user_crud
from model.user import User
from schemas.auth import Token, TokenData, TokenPayload

# Bcrypt hash mật khẩu
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """So sánh mật khẩu plain với hash trong DB."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Mã hóa mật khẩu trước khi lưu."""
    return pwd_context.hash(password)


def _create_jwt(
    *,
    subject: uuid.UUID,
    role: str,
    token_type: str,
    expires_delta: timedelta,
    jti: str | None = None,
) -> str:
    now = datetime.now(timezone.utc)
    payload: dict = {
        "sub": str(subject),
        "role": role,
        "type": token_type,
        "exp": now + expires_delta,
        "iat": now,
    }
    if jti:
        payload["jti"] = jti
    return jwt.encode(payload, config.SECRET_KEY, algorithm=config.ALGORITHM)


def create_access_token(user: User) -> str:
    """Access token — thời hạn ngắn."""
    return _create_jwt(
        subject=user.id,
        role=user.role.value,
        token_type="access",
        expires_delta=timedelta(minutes=config.ACCESS_TOKEN_EXPIRE_MINUTES),
    )


def create_refresh_token(user: User, jti: str) -> str:
    """Refresh token — thời hạn dài, có jti để thu hồi khi logout."""
    return _create_jwt(
        subject=user.id,
        role=user.role.value,
        token_type="refresh",
        expires_delta=timedelta(days=config.REFRESH_TOKEN_EXPIRE_DAYS),
        jti=jti,
    )


def decode_token(token: str) -> TokenPayload | None:
    try:
        payload = jwt.decode(token, config.SECRET_KEY, algorithms=[config.ALGORITHM])
        return TokenPayload(
            sub=uuid.UUID(payload["sub"]),
            role=payload["role"],
            type=payload["type"],
            jti=payload.get("jti"),
        )
    except (JWTError, ValueError, KeyError):
        return None


def authenticate_user(db: Session, email: str, password: str) -> User | None:
    user = user_crud.get_user_by_email(db, email)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user


def issue_token_pair(db: Session, user: User) -> Token:
    """Cấp cặp token và lưu refresh token vào DB."""
    jti = uuid.uuid4().hex
    expires_at = datetime.now(timezone.utc) + timedelta(days=config.REFRESH_TOKEN_EXPIRE_DAYS)
    user_crud.save_refresh_token(db, user_id=user.id, token_jti=jti, expires_at=expires_at)
    return Token(
        access_token=create_access_token(user),
        refresh_token=create_refresh_token(user, jti),
    )


def refresh_access_token(db: Session, refresh_token: str) -> Token | None:
    """Rotation: thu hồi refresh cũ, cấp cặp mới."""
    payload = decode_token(refresh_token)
    if not payload or payload.type != "refresh" or not payload.jti:
        return None

    stored = user_crud.get_refresh_token_by_jti(db, payload.jti)
    if not stored or stored.revoked or stored.expires_at < datetime.now(timezone.utc):
        return None

    user = user_crud.get_user_by_id(db, payload.sub)
    if not user or not user.is_active:
        return None

    user_crud.revoke_refresh_token(db, stored)
    return issue_token_pair(db, user)


def logout(db: Session, refresh_token: str) -> bool:
    """Thu hồi refresh token — client xóa token lưu local."""
    payload = decode_token(refresh_token)
    if not payload or payload.type != "refresh" or not payload.jti:
        return False

    stored = user_crud.get_refresh_token_by_jti(db, payload.jti)
    if not stored or stored.revoked:
        return False

    user_crud.revoke_refresh_token(db, stored)
    return True


def get_token_data(access_token: str) -> TokenData | None:
    payload = decode_token(access_token)
    if not payload or payload.type != "access":
        return None
    return TokenData(user_id=payload.sub, role=payload.role)
