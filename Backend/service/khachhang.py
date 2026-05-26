from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from crud import khachhang as khachhang_crud
from model.khachhang import KhachHang
from schemas.khachhang import KhachHangCreate, KhachHangRegister, KhachHangUpdate, ProfileUpdate
from service.auth import get_password_hash, verify_password


def register_khachhang(db: Session, data: KhachHangRegister) -> KhachHang:
    """Đăng ký tài khoản khách hàng mới."""
    if khachhang_crud.get_khachhang_by_taikhoan(db, data.taikhoan):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Tài khoản đã được sử dụng")
    return khachhang_crud.create_khachhang_from_register(db, data, get_password_hash(data.matkhau))


def create_khachhang_admin(db: Session, data: KhachHangCreate) -> KhachHang:
    """Admin tạo tài khoản khách hàng mới."""
    if khachhang_crud.get_khachhang_by_taikhoan(db, data.taikhoan):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Tài khoản đã được sử dụng")
    return khachhang_crud.create_khachhang_from_schema(db, data, get_password_hash(data.matkhau))


def update_khachhang_admin(db: Session, makh: str, data: KhachHangUpdate) -> KhachHang:
    """Admin cập nhật thông tin khách hàng."""
    khachhang = khachhang_crud.get_khachhang_by_makh(db, makh)
    if not khachhang:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy khách hàng")

    if data.taikhoan and data.taikhoan != khachhang.taikhoan and khachhang_crud.get_khachhang_by_taikhoan(db, data.taikhoan):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Tài khoản đã được sử dụng")

    hashed = get_password_hash(data.matkhau) if data.matkhau else None
    return khachhang_crud.update_khachhang(db, khachhang, data, hashed)


def update_profile(db: Session, khachhang: KhachHang, data: ProfileUpdate) -> KhachHang:
    """Cập nhật thông tin cá nhân khách hàng."""
    hashed = None
    if data.new_password:
        if not data.current_password or not khachhang.matkhau or not verify_password(data.current_password, khachhang.matkhau):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Mật khẩu hiện tại không đúng")
        hashed = get_password_hash(data.new_password)
    return khachhang_crud.update_profile(db, khachhang, data, hashed)


def delete_khachhang_admin(db: Session, makh: str, current_admin: KhachHang) -> None:
    """Admin xóa tài khoản khách hàng."""
    if makh == current_admin.makh:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Không thể xóa tài khoản của chính mình")
    khachhang = khachhang_crud.get_khachhang_by_makh(db, makh)
    if not khachhang:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy khách hàng")
    khachhang_crud.delete_khachhang(db, khachhang)


def get_khachhang_or_404(db: Session, makh: str) -> KhachHang:
    """Lấy thông tin khách hàng hoặc trả về lỗi 404."""
    khachhang = khachhang_crud.get_khachhang_by_makh(db, makh)
    if not khachhang:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy khách hàng")
    return khachhang
