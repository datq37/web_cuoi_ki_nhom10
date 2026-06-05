from pydantic import BaseModel, ConfigDict


class DayConfig(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    label: str
    on: bool = True
    mo: str = "07:00"
    close: str = "18:00"


class AppSettings(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    thongTin: dict = {}
    gioHD: list[DayConfig]
    thanhToan: list[dict] = []
    thongBao: list[dict] = []
    baoMat: dict = {}


class OrderingStatus(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    open: bool
    message: str
    dayLabel: str | None = None
    openTime: str | None = None
    closeTime: str | None = None
