import uuid

from pydantic import BaseModel, EmailStr, Field


class Token(BaseModel):
    """Cặp JWT trả về sau đăng nhập."""

    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Payload đã giải mã từ access token — dùng trong dependency."""

    user_id: uuid.UUID
    role: str


class TokenPayload(BaseModel):
    """Nội dung JWT đầy đủ (dùng nội bộ service)."""

    sub: uuid.UUID
    role: str
    type: str
    jti: str | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1)


class RefreshRequest(BaseModel):
    refresh_token: str


class LogoutRequest(BaseModel):
    refresh_token: str
