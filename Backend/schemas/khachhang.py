from pydantic import BaseModel, ConfigDict, Field


class KhachHangBase(BaseModel):
    """Schema cơ sở của Khách hàng."""
    ten: str | None = None
    tuoi: int | None = None
    taikhoan: str | None = None
    lichsudathang: str | None = None
    vaitro: str | None = "Khách hàng"


class KhachHangCreate(BaseModel):
    """Schema tạo tài khoản khách hàng (Admin)."""
    taikhoan: str = Field(..., min_length=3, max_length=100)
    matkhau: str = Field(..., min_length=6, max_length=128)
    ten: str | None = Field(default=None, min_length=1, max_length=255)
    tuoi: int | None = None
    vaitro: str = Field(default="Khách hàng")


class KhachHangRegister(BaseModel):
    """Schema đăng ký tài khoản mới của khách hàng."""
    taikhoan: str = Field(..., min_length=3, max_length=100)
    matkhau: str = Field(..., min_length=6, max_length=128)
    ten: str | None = Field(default=None, min_length=1, max_length=255)
    tuoi: int | None = None


class KhachHangUpdate(BaseModel):
    """Schema cập nhật thông tin khách hàng."""
    ten: str | None = Field(default=None, min_length=1, max_length=255)
    tuoi: int | None = None
    taikhoan: str | None = None
    matkhau: str | None = Field(default=None, min_length=6, max_length=128)
    lichsudathang: str | None = None
    vaitro: str | None = None


class ProfileUpdate(BaseModel):
    """Schema cập nhật hồ sơ cá nhân của khách hàng."""
    ten: str | None = Field(default=None, min_length=1, max_length=255)
    current_password: str | None = Field(default=None, min_length=1)
    new_password: str | None = Field(default=None, min_length=6, max_length=128)


class KhachHangResponse(KhachHangBase):
    """Schema phản hồi thông tin khách hàng."""
    model_config = ConfigDict(from_attributes=True)

    makh: str


class KhachHangListResponse(BaseModel):
    """Schema danh sách khách hàng phân trang."""
    items: list[KhachHangResponse]
    total: int
    page: int
    page_size: int
