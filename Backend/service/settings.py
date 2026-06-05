import json
from copy import deepcopy
from datetime import datetime
from pathlib import Path
from typing import Any

from sqlalchemy.orm import Session

from model.canteen_settings import CanteenSetting
from schemas.settings import OrderingStatus


SETTINGS_PATH = Path(__file__).resolve().parents[1] / "canteen_settings.json"
APP_SETTINGS_KEY = "app_settings"
BUSINESS_HOURS_KEY = "business_hours"

DEFAULT_SETTINGS: dict[str, Any] = {
    "thongTin": {
        "ten": "Căng tin Doanh nghiệp",
        "diaChi": "Tầng 1, Toà nhà A, KCN Tân Thuận, Q.7, TP.HCM",
        "sdt": "0283 555 1234",
        "email": "canteen@abc.com.vn",
        "logo": "/logo.webp",
    },
    "gioHD": [
        {"label": "Thứ Hai", "on": True, "mo": "07:00", "close": "18:00"},
        {"label": "Thứ Ba", "on": True, "mo": "07:00", "close": "18:00"},
        {"label": "Thứ Tư", "on": True, "mo": "07:00", "close": "18:00"},
        {"label": "Thứ Năm", "on": True, "mo": "07:00", "close": "18:00"},
        {"label": "Thứ Sáu", "on": True, "mo": "07:00", "close": "18:00"},
        {"label": "Thứ Bảy", "on": True, "mo": "08:00", "close": "13:00"},
        {"label": "Chủ Nhật", "on": False, "mo": "08:00", "close": "12:00"},
    ],
    "thanhToan": [{"id": "tien-mat", "on": True}, {"id": "chuyen-khoan", "on": True}],
    "thongBao": [],
    "baoMat": {"twoFA": True, "autoLogout": True},
}


def _merge_settings(raw: dict[str, Any] | None) -> dict[str, Any]:
    settings = deepcopy(DEFAULT_SETTINGS)
    if not isinstance(raw, dict):
        return settings
    for key, value in raw.items():
        if value is not None:
            settings[key] = value
    return settings


def _read_file_settings() -> dict[str, Any]:
    try:
        if not SETTINGS_PATH.exists():
            return deepcopy(DEFAULT_SETTINGS)
        with SETTINGS_PATH.open("r", encoding="utf-8") as file:
            return _merge_settings(json.load(file))
    except (OSError, json.JSONDecodeError):
        return deepcopy(DEFAULT_SETTINGS)


def _read_db_settings(db: Session) -> dict[str, Any] | None:
    app_row = db.get(CanteenSetting, APP_SETTINGS_KEY)
    if app_row and isinstance(app_row.value, dict):
        return _merge_settings(app_row.value)

    business_hours_row = db.get(CanteenSetting, BUSINESS_HOURS_KEY)
    if business_hours_row and isinstance(business_hours_row.value, list):
        return _merge_settings({"gioHD": business_hours_row.value})

    return None


def read_settings(db: Session | None = None) -> dict[str, Any]:
    if db is not None:
        db_settings = _read_db_settings(db)
        if db_settings is not None:
            return db_settings
    return _read_file_settings()


def _upsert_setting(db: Session, key: str, value: dict[str, Any] | list[dict[str, Any]]) -> None:
    row = db.get(CanteenSetting, key)
    if row:
        row.value = value
    else:
        row = CanteenSetting(key=key, value=value)
        db.add(row)


def write_settings(settings: dict[str, Any], db: Session | None = None) -> dict[str, Any]:
    normalized = _merge_settings(settings)
    if db is not None:
        _upsert_setting(db, APP_SETTINGS_KEY, normalized)
        _upsert_setting(db, BUSINESS_HOURS_KEY, normalized.get("gioHD", []))
        db.commit()
    else:
        SETTINGS_PATH.write_text(
            json.dumps(normalized, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
    return normalized


def _parse_minutes(value: str | None) -> int | None:
    if not value:
        return None
    try:
        hour, minute = str(value).split(":", 1)
        hour_num = int(hour)
        minute_num = int(minute)
        if not (0 <= hour_num <= 23 and 0 <= minute_num <= 59):
            return None
        return hour_num * 60 + minute_num
    except (TypeError, ValueError):
        return None


def get_ordering_status(db: Session | None = None, now: datetime | None = None) -> OrderingStatus:
    current = now or datetime.now()
    settings = read_settings(db)
    days = settings.get("gioHD") or DEFAULT_SETTINGS["gioHD"]
    day_index = current.weekday()
    day_config = days[day_index] if day_index < len(days) else None

    if not day_config or not day_config.get("on"):
        return OrderingStatus(
            open=False,
            message="Căng tin hôm nay không mở bán.",
            dayLabel=day_config.get("label") if day_config else None,
        )

    open_time = day_config.get("mo")
    close_time = day_config.get("close")
    open_min = _parse_minutes(open_time)
    close_min = _parse_minutes(close_time)

    if open_min is None or close_min is None:
        return OrderingStatus(
            open=False,
            message="Giờ mở bán chưa được cấu hình hợp lệ.",
            dayLabel=day_config.get("label"),
            openTime=open_time,
            closeTime=close_time,
        )

    current_min = current.hour * 60 + current.minute
    if close_min >= open_min:
        is_open = open_min <= current_min <= close_min
    else:
        is_open = current_min >= open_min or current_min <= close_min

    if is_open:
        message = f"Đang mở bán đến {close_time}."
    else:
        message = f"Căng tin chỉ mở bán từ {open_time} đến {close_time} hôm nay."

    return OrderingStatus(
        open=is_open,
        message=message,
        dayLabel=day_config.get("label"),
        openTime=open_time,
        closeTime=close_time,
    )
