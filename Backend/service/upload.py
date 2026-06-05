import uuid
from io import BytesIO
from pathlib import Path

import cloudinary
import cloudinary.uploader
from fastapi import HTTPException, UploadFile, status

import config


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


async def upload_image_to_cloudinary(file: UploadFile, folder: str | None = None) -> str:
    """
    Upload ảnh món ăn lên Cloudinary.
    Trả về secure_url để lưu vào database.
    """
    _validate_image(file)
    content = await file.read()
    max_bytes = config.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if len(content) > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Kích thước file tối đa {config.MAX_UPLOAD_SIZE_MB}MB",
        )

    if not all([config.CLOUDINARY_CLOUD_NAME, config.CLOUDINARY_API_KEY, config.CLOUDINARY_API_SECRET]):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Cloudinary chưa được cấu hình.",
        )

    cloudinary.config(
        cloud_name=config.CLOUDINARY_CLOUD_NAME,
        api_key=config.CLOUDINARY_API_KEY,
        api_secret=config.CLOUDINARY_API_SECRET,
        secure=True,
    )

    try:
        result = cloudinary.uploader.upload(
            BytesIO(content),
            folder=folder or config.CLOUDINARY_FOLDER,
            public_id=uuid.uuid4().hex,
            resource_type="image",
            overwrite=True,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Không upload được ảnh lên Cloudinary.",
        ) from exc

    image_url = result.get("secure_url")
    if not image_url:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Cloudinary không trả về link ảnh.",
        )
    return image_url


async def save_menu_item_image(file: UploadFile) -> str:
    """Upload ảnh món ăn lên Cloudinary và trả về URL."""
    return await upload_image_to_cloudinary(file, config.CLOUDINARY_FOLDER)
