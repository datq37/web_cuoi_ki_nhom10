import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile, status

import config

# Đảm bảo thư mục uploads tồn tại khi import module
UPLOAD_PATH = Path(config.UPLOAD_DIR)
UPLOAD_PATH.mkdir(parents=True, exist_ok=True)


def _validate_image(file: UploadFile) -> str:
    """Kiểm tra định dạng file ảnh, trả về extension hợp lệ."""
    if not file.filename:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Tên file không hợp lệ")

    ext = Path(file.filename).suffix.lower()
    if ext not in config.ALLOWED_IMAGE_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Chỉ chấp nhận ảnh: {', '.join(config.ALLOWED_IMAGE_EXTENSIONS)}",
        )
    return ext


async def save_menu_item_image(file: UploadFile) -> str:
    """
    Lưu file ảnh vào thư mục uploads với tên unique (uuid).
    Trả về đường dẫn public: /uploads/<filename>
    """
    ext = _validate_image(file)
    content = await file.read()
    max_bytes = config.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if len(content) > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Kích thước file tối đa {config.MAX_UPLOAD_SIZE_MB}MB",
        )

    filename = f"{uuid.uuid4().hex}{ext}"
    file_path = UPLOAD_PATH / filename
    file_path.write_bytes(content)

    return f"/{config.UPLOAD_DIR}/{filename}"
