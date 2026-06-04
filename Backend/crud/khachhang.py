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
    avatar: str | None = None,
    phone: str | None = None,
    email: str | None = None,
    dept: str | None = None,
    building: str | None = None,
    floor: str | None = None,
    desk: str | None = None,
    points: int = 0,
    total_spent: int = 0,
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
        avatar=avatar,
        phone=phone,
        email=email,
        dept=dept,
        building=building,
        floor=floor,
        desk=desk,
        points=points,
        total_spent=total_spent,
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
        avatar=data.avatar,
        phone=data.phone,
        email=data.email,
        dept=data.dept,
        building=data.building,
        floor=data.floor,
        desk=data.desk,
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
        avatar=data.avatar,
        phone=data.phone,
        email=data.email,
        dept=data.dept,
        building=data.building,
        floor=data.floor,
        desk=data.desk,
        points=data.points,
        total_spent=data.total_spent,
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

    update_data = data.model_dump(
        exclude_unset=True,
        exclude={"current_password", "new_password"},
    )
    for field, value in update_data.items():
        setattr(khachhang, field, value)

    db.add(khachhang)
    db.commit()
    db.refresh(khachhang)
    return khachhang


def add_purchase_points(db: Session, khachhang: KhachHang, amount: int) -> KhachHang:
    """Cộng tổng chi tiêu và điểm thưởng cho khách hàng sau khi đặt đơn."""
    safe_amount = max(0, int(amount or 0))
    new_total_spent = int(khachhang.total_spent or 0) + safe_amount

    if new_total_spent >= 10_000_000:
        multiplier = 2.0
    elif new_total_spent >= 3_000_000:
        multiplier = 1.5
    elif new_total_spent >= 1_000_000:
        multiplier = 1.2
    else:
        multiplier = 1.0

    earned_points = int((safe_amount // 10_000) * multiplier)
    khachhang.total_spent = new_total_spent
    khachhang.points = int(khachhang.points or 0) + earned_points

    db.add(khachhang)
    db.commit()
    db.refresh(khachhang)
    return khachhang


def delete_khachhang(db: Session, khachhang: KhachHang) -> None:
    """Xóa khách hàng."""
    db.delete(khachhang)
    db.commit()
