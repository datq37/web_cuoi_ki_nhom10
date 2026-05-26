from pydantic import BaseModel, ConfigDict, Field


class DanhMucMonAnBase(BaseModel):
    name: str | None = Field(default=None, max_length=100)


class DanhMucMonAnCreate(DanhMucMonAnBase):
    name: str = Field(..., min_length=1, max_length=100)


class DanhMucMonAnUpdate(BaseModel):
    name: str | None = Field(default=None, max_length=100)


class DanhMucMonAnResponse(DanhMucMonAnBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
