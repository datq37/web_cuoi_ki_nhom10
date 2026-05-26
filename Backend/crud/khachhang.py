import uuid
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from model.khachhang import KhachHang
from schemas.khachhang import KhachHangCreate, KhachHangRegister, KhachHangUpdate, ProfileUpdate


def get_khachhang_by_makh(db: Session, makh: str) -> KhachHang | None:
    """Lấy khách hàng theo mã khách hàng (makh)."""
    return db.get(KhachHang, makh)


def get_khachhang_by_taikhoan(db: Session, taikhoan: str) -> KhachHang | None:
    """Lấy khách hàng theo tài khoản (unique)."""
    stmt = select(KhachHang).where(KhachHang.taikhoan == taikhoan)
    return db.execute(stmt).scalar_one_or_none()


def get_khachhangs(
    db: Session,
    *,
    skip: int = 0,
    limit: int = 20,
    vaitro: str | None = None,
) -> tuple[list[KhachHang], int]:
    """Danh sách khách hàng có phân trang và lọc theo vai trò."""
    stmt = select(KhachHang)
    count_stmt = select(func.count()).select_from(KhachHang)

    if vaitro is not None:
        stmt = stmt.where(KhachHang.vaitro == vaitro)
        count_stmt = count_stmt.where(KhachHang.vaitro == vaitro)

    total = db.execute(count_stmt).scalar_one()
    # Sắp xếp mặc định theo mã khách hàng
    khachhangs = (
        db.execute(stmt.order_by(KhachHang.makh.asc()).offset(skip).limit(limit)).scalars().all()
    )
    return list(khachhangs), total


def create_khachhang(
    db: Session,
    *,
    taikhoan: str,
    matkhau: str,
    ten: str | None = None,
    tuoi: int | None = None,
    vaitro: str = "Khách hàng",
) -> KhachHang:
    """Tạo khách hàng mới trong database."""
    # Tự động sinh mã khách hàng nếu chưa có
    makh = f"KH-{uuid.uuid4().hex[:8].upper()}"
    
    khachhang = KhachHang(
        makh=makh,
        taikhoan=taikhoan,
        matkhau=matkhau,
        ten=ten,
        tuoi=tuoi,
        vaitro=vaitro,
    )
    db.add(khachhang)
    db.commit()
    db.refresh(khachhang)
    return khachhang


def create_khachhang_from_register(db: Session, data: KhachHangRegister, matkhau_hash: str) -> KhachHang:
    """Tạo khách hàng khi đăng ký tự do."""
    return create_khachhang(
        db,
        taikhoan=data.taikhoan,
        matkhau=matkhau_hash,
        ten=data.ten,
        tuoi=data.tuoi,
        vaitro="Khách hàng",
    )


def create_khachhang_from_schema(db: Session, data: KhachHangCreate, matkhau_hash: str) -> KhachHang:
    """Tạo khách hàng từ schema của Admin."""
    return create_khachhang(
        db,
        taikhoan=data.taikhoan,
        matkhau=matkhau_hash,
        ten=data.ten,
        tuoi=data.tuoi,
        vaitro=data.vaitro,
    )


def update_khachhang(db: Session, khachhang: KhachHang, data: KhachHangUpdate, matkhau_hash: str | None = None) -> KhachHang:
    """Cập nhật thông tin khách hàng bởi Admin."""
    update_data = data.model_dump(exclude_unset=True)
    if matkhau_hash:
        update_data["matkhau"] = matkhau_hash
    update_data.pop("matkhau", None)

    for field, value in update_data.items():
        setattr(khachhang, field, value)

    db.add(khachhang)
    db.commit()
    db.refresh(khachhang)
    return khachhang


def update_profile(db: Session, khachhang: KhachHang, data: ProfileUpdate, matkhau_hash: str | None = None) -> KhachHang:
    """Cập nhật hồ sơ cá nhân của khách hàng."""
    if matkhau_hash:
        khachhang.matkhau = matkhau_hash
    if data.ten is not None:
        khachhang.ten = data.ten

    db.add(khachhang)
    db.commit()
    db.refresh(khachhang)
    return khachhang


def delete_khachhang(db: Session, khachhang: KhachHang) -> None:
    """Xóa khách hàng."""
    db.delete(khachhang)
    db.commit()
