import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).with_name(".env"))

# Cấu hình JWT — đọc từ biến môi trường, có giá trị mặc định cho môi trường dev
SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret-key-thay-doi-khi-deploy")
ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
REFRESH_TOKEN_EXPIRE_DAYS: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))
API_V1_PREFIX: str = os.getenv("API_V1_PREFIX", "/api/v1")

# Thư mục lưu ảnh món ăn (tương đối thư mục Backend)
UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "uploads")
MAX_UPLOAD_SIZE_MB: int = int(os.getenv("MAX_UPLOAD_SIZE_MB", "5"))
ALLOWED_IMAGE_EXTENSIONS: set[str] = {".jpg", ".jpeg", ".png", ".webp"}

# Cloudinary — dùng để lưu ảnh món ăn, Supabase chỉ lưu URL ảnh
CLOUDINARY_CLOUD_NAME: str | None = os.getenv("CLOUDINARY_CLOUD_NAME")
CLOUDINARY_API_KEY: str | None = os.getenv("CLOUDINARY_API_KEY")
CLOUDINARY_API_SECRET: str | None = os.getenv("CLOUDINARY_API_SECRET")
CLOUDINARY_FOLDER: str = os.getenv("CLOUDINARY_FOLDER", "canteen/menu-items")
