from pydantic.alias_generators import to_camel
from pydantic import ConfigDict, BaseModel, Field


class Token(BaseModel):
    """Cặp JWT trả về sau đăng nhập."""

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)

    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Payload đã giải mã từ access token — dùng trong dependency."""

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)

    makh: str
    role: str


class TokenPayload(BaseModel):
    """Nội dung JWT đầy đủ (dùng nội bộ service)."""

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)

    sub: str
    role: str
    type: str
    jti: str | None = None


class LoginRequest(BaseModel):
    """Yêu cầu đăng nhập."""

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    taikhoan: str = Field(..., min_length=1)
    matkhau: str = Field(..., min_length=1)


class RefreshRequest(BaseModel):

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    refresh_token: str


class LogoutRequest(BaseModel):

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    refresh_token: str
