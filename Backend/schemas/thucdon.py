from pydantic import BaseModel, ConfigDict, Field
from schemas.danhmucmonan import DanhMucMonAnResponse


class ThucDonBase(BaseModel):
    """Schema cơ sở cho Món ăn."""
    ten: str | None = None
    gia: float | None = None
    soluong: int | None = None
    hinhanh: str | None = None
    mieuta: str | None = None
    soluongdaban: int | None = None
    hethang: bool | None = False
    tags: list[str] | None = None
    danhmucid: int | None = None


class ThucDonCreate(ThucDonBase):
    """Schema tạo món ăn mới."""
    mamon: str = Field(..., min_length=1, description="Mã món ăn")
    ten: str = Field(..., min_length=1, description="Tên món ăn")
    gia: float = Field(..., ge=0, description="Giá bán")


class ThucDonUpdate(BaseModel):
    """Schema cập nhật món ăn."""
    ten: str | None = None
    gia: float | None = Field(default=None, ge=0)
    soluong: int | None = Field(default=None, ge=0)
    hinhanh: str | None = None
    mieuta: str | None = None
    soluongdaban: int | None = Field(default=None, ge=0)
    hethang: bool | None = None
    tags: list[str] | None = None
    danhmucid: int | None = None


class ThucDonResponse(ThucDonBase):
    """Schema phản hồi thông tin món ăn."""
    model_config = ConfigDict(from_attributes=True)

    mamon: str
    danhmuc: DanhMucMonAnResponse | None = None


class ThucDonListResponse(BaseModel):
    """Schema danh sách món ăn phân trang."""
    items: list[ThucDonResponse]
    total: int
