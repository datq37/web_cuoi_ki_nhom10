import uuid
from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

import config
from crud import khachhang as khachhang_crud
from model.khachhang import KhachHang
from schemas.auth import Token, TokenData, TokenPayload

import bcrypt

# Danh sách token jti đã thu hồi (logout) dạng stateless trong bộ nhớ
REVOKED_JTIS = set()

# Trực tiếp dùng thư viện bcrypt thay cho passlib để tránh lỗi không tương thích phiên bản trên python 3.12+
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """So sánh mật khẩu plain với hash trong DB (hỗ trợ plain text cũ)."""
    # Nếu password trong DB có định dạng của Bcrypt (bắt đầu bằng $2b$, $2a$, $2y$)
    if hashed_password.startswith(("$2b$", "$2a$", "$2y$")):
        try:
            return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
        except Exception:
            return False
    else:
        # Nếu chưa được mã hóa (dữ liệu cũ dạng plain text)
        return plain_password == hashed_password


def get_password_hash(password: str) -> str:
    """Mã hóa mật khẩu trước khi lưu."""
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def _create_jwt(
    *,
    subject: str,
    role: str,
    token_type: str,
    expires_delta: timedelta,
    jti: str | None = None,
) -> str:
    now = datetime.now(timezone.utc)
    payload: dict = {
        "sub": subject,
        "role": role,
        "type": token_type,
        "exp": now + expires_delta,
        "iat": now,
    }
    if jti:
        payload["jti"] = jti
    return jwt.encode(payload, config.SECRET_KEY, algorithm=config.ALGORITHM)


def create_access_token(khachhang: KhachHang) -> str:
    """Access token — thời hạn ngắn."""
    # Mặc định vai trò là 'Khách hàng' nếu chưa được chỉ định
    role = khachhang.vaitro or "Khách hàng"
    return _create_jwt(
        subject=khachhang.makh,
        role=role,
        token_type="access",
        expires_delta=timedelta(minutes=config.ACCESS_TOKEN_EXPIRE_MINUTES),
    )


def create_refresh_token(khachhang: KhachHang, jti: str) -> str:
    """Refresh token — thời hạn dài, có jti để thu hồi khi logout."""
    role = khachhang.vaitro or "Khách hàng"
    return _create_jwt(
        subject=khachhang.makh,
        role=role,
        token_type="refresh",
        expires_delta=timedelta(days=config.REFRESH_TOKEN_EXPIRE_DAYS),
        jti=jti,
    )


def decode_token(token: str) -> TokenPayload | None:
    try:
        payload = jwt.decode(token, config.SECRET_KEY, algorithms=[config.ALGORITHM])
        return TokenPayload(
            sub=payload["sub"],
            role=payload["role"],
            type=payload["type"],
            jti=payload.get("jti"),
        )
    except (JWTError, ValueError, KeyError):
        return None


def authenticate_user(db: Session, taikhoan: str, matkhau: str) -> KhachHang | None:
    """Xác thực người dùng qua taikhoan và matkhau."""
    khachhang = khachhang_crud.get_khachhang_by_taikhoan(db, taikhoan)
    if not khachhang or not khachhang.matkhau or not verify_password(matkhau, khachhang.matkhau):
        return None
    return khachhang

def authenticate_social_user(db: Session, email: str, name: str, avatar: str | None = None) -> KhachHang:
    """Xác thực hoặc tạo mới khách hàng qua Social Login."""
    from sqlalchemy import select
    stmt = select(KhachHang).where(KhachHang.email == email)
    khachhang = db.execute(stmt).scalar_one_or_none()

    if not khachhang:
        taikhoan = email.split("@")[0] + "_" + uuid.uuid4().hex[:4]
        khachhang = khachhang_crud.create_khachhang(
            db,
            taikhoan=taikhoan,
            matkhau="", # Đăng nhập social không dùng password
            ten=name,
            email=email,
            avatar=avatar,
            vaitro="Khách hàng"
        )
    else:
        if avatar and not khachhang.avatar:
            khachhang.avatar = avatar
            db.add(khachhang)
            db.commit()
            db.refresh(khachhang)

    return khachhang


def issue_token_pair(db: Session, khachhang: KhachHang) -> Token:
    """Cấp cặp token (Access và Refresh token)."""
    jti = uuid.uuid4().hex
    return Token(
        access_token=create_access_token(khachhang),
        refresh_token=create_refresh_token(khachhang, jti),
    )


def refresh_access_token(db: Session, refresh_token: str) -> Token | None:
    """Làm mới Access Token sử dụng Refresh Token hợp lệ."""
    payload = decode_token(refresh_token)
    if not payload or payload.type != "refresh" or not payload.jti:
        return None

    # Kiểm tra xem token này đã bị thu hồi (logout) chưa
    if payload.jti in REVOKED_JTIS:
        return None

    khachhang = khachhang_crud.get_khachhang_by_makh(db, payload.sub)
    if not khachhang:
        return None

    # Sau khi xác minh, cấp cặp token mới (rotation)
    REVOKED_JTIS.add(payload.jti)
    return issue_token_pair(db, khachhang)


def logout(db: Session, refresh_token: str) -> bool:
    """Thu hồi refresh token bằng cách thêm jti vào danh sách đen trong bộ nhớ."""
    payload = decode_token(refresh_token)
    if not payload or payload.type != "refresh" or not payload.jti:
        return False

    REVOKED_JTIS.add(payload.jti)
    return True


def get_token_data(access_token: str) -> TokenData | None:
    payload = decode_token(access_token)
    if not payload or payload.type != "access":
        return None
    return TokenData(makh=payload.sub, role=payload.role)
