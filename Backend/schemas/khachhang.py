from pydantic.alias_generators import to_camel
from pydantic import BaseModel, ConfigDict, Field


class KhachHangBase(BaseModel):
    """Schema cơ sở của Khách hàng."""

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    ten: str | None = None
    tuoi: int | None = None
    taikhoan: str | None = None
    lichsudathang: str | None = None
    vaitro: str | None = "Khách hàng"
    avatar: str | None = None
    phone: str | None = None
    email: str | None = None
    dept: str | None = None
    building: str | None = None
    floor: str | None = None
    desk: str | None = None
    points: int = 0
    total_spent: int = 0
    so_don: int = 0


class KhachHangCreate(BaseModel):
    """Schema tạo tài khoản khách hàng (Admin)."""

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    taikhoan: str = Field(..., min_length=3, max_length=100)
    matkhau: str = Field(..., min_length=6, max_length=128)
    ten: str | None = Field(default=None, min_length=1, max_length=255)
    tuoi: int | None = None
    vaitro: str = Field(default="Khách hàng")
    avatar: str | None = None
    phone: str | None = None
    email: str | None = None
    dept: str | None = None
    building: str | None = None
    floor: str | None = None
    desk: str | None = None
    points: int = Field(default=0, ge=0)
    total_spent: int = Field(default=0, ge=0)


class KhachHangRegister(BaseModel):
    """Schema đăng ký tài khoản mới của khách hàng."""

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    taikhoan: str = Field(..., min_length=3, max_length=100)
    matkhau: str = Field(..., min_length=6, max_length=128)
    ten: str | None = Field(default=None, min_length=1, max_length=255)
    tuoi: int | None = None
    avatar: str | None = None
    phone: str | None = None
    email: str | None = None
    dept: str | None = None
    building: str | None = None
    floor: str | None = None
    desk: str | None = None


class KhachHangUpdate(BaseModel):
    """Schema cập nhật thông tin khách hàng."""

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    ten: str | None = Field(default=None, min_length=1, max_length=255)
    tuoi: int | None = None
    taikhoan: str | None = None
    matkhau: str | None = Field(default=None, min_length=6, max_length=128)
    lichsudathang: str | None = None
    vaitro: str | None = None
    avatar: str | None = None
    phone: str | None = None
    email: str | None = None
    dept: str | None = None
    building: str | None = None
    floor: str | None = None
    desk: str | None = None
    points: int | None = Field(default=None, ge=0)
    total_spent: int | None = Field(default=None, ge=0)


class ProfileUpdate(BaseModel):
    """Schema cập nhật hồ sơ cá nhân của khách hàng."""

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    ten: str | None = Field(default=None, min_length=1, max_length=255)
    avatar: str | None = None
    phone: str | None = None
    email: str | None = None
    dept: str | None = None
    building: str | None = None
    floor: str | None = None
    desk: str | None = None
    current_password: str | None = Field(default=None, min_length=1)
    new_password: str | None = Field(default=None, min_length=6, max_length=128)


class KhachHangResponse(KhachHangBase):
    """Schema phản hồi thông tin khách hàng."""

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)

    makh: str


class KhachHangListResponse(BaseModel):
    """Schema danh sách khách hàng phân trang."""

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    items: list[KhachHangResponse]
    total: int
    page: int
    page_size: int
