from datetime import date

from pydantic import BaseModel, ConfigDict


class KhuyenMaiBase(BaseModel):
    ten: str | None = None
    hansudung: date | None = None


class KhuyenMaiCreate(KhuyenMaiBase):
    pass


class KhuyenMaiUpdate(BaseModel):
    ten: str | None = None
    hansudung: date | None = None


class KhuyenMaiResponse(KhuyenMaiBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
