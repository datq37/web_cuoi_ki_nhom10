import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from model.user import UserRole


class UserCreate(BaseModel):
    """Schema tạo tài khoản (Admin)."""

    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128)
    full_name: str = Field(..., min_length=1, max_length=255)
    role: UserRole = UserRole.NHAN_VIEN


class UserRegister(BaseModel):
    """Schema đăng ký — role mặc định Nhân viên, có thể chọn nếu cần."""

    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128)
    full_name: str = Field(..., min_length=1, max_length=255)
    role: UserRole = UserRole.NHAN_VIEN


class UserUpdate(BaseModel):
    """Schema cập nhật tài khoản (Admin) — các trường đều tùy chọn."""

    email: EmailStr | None = None
    full_name: str | None = Field(default=None, min_length=1, max_length=255)
    role: UserRole | None = None
    is_active: bool | None = None
    password: str | None = Field(default=None, min_length=6, max_length=128)


class ProfileUpdate(BaseModel):
    """Schema cập nhật hồ sơ cá nhân."""

    full_name: str | None = Field(default=None, min_length=1, max_length=255)
    current_password: str | None = Field(default=None, min_length=1)
    new_password: str | None = Field(default=None, min_length=6, max_length=128)


class UserResponse(BaseModel):
    """Schema trả về — tương thích ORM SQLAlchemy."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    email: EmailStr
    full_name: str
    role: UserRole
    is_active: bool
    created_at: datetime
    updated_at: datetime


class UserListResponse(BaseModel):
    """Danh sách user có phân trang."""

    items: list[UserResponse]
    total: int
    page: int
    page_size: int
