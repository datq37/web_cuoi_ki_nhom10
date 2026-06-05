from typing import Annotated

from fastapi import APIRouter, Depends, File, Query, UploadFile

from dependencies import get_current_user
from model.khachhang import KhachHang
from service.upload import upload_image_to_cloudinary

router = APIRouter(prefix="/uploads", tags=["Upload"])


@router.post("/image")
async def upload_image(
    _: Annotated[KhachHang, Depends(get_current_user)],
    file: UploadFile = File(...),
    folder: str = Query("canteen/general"),
):
    """Upload ảnh dùng chung lên Cloudinary."""
    image_url = await upload_image_to_cloudinary(file, folder)
    return {"url": image_url}
