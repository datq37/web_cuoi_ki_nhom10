"""
Script kết nối ảnh từ thư mục assets sang thư mục uploads và cập nhật database.
Chạy từ thư mục Backend: python scripts/connect_images.py
"""
import sys
import shutil
from pathlib import Path

# Add parent directory to sys.path to import database and model
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from database import SessionLocal, engine
from model.thucdon import ThucDon
import config

def main() -> None:
    # 1. Đường dẫn thư mục assets và uploads
    backend_dir = Path(__file__).resolve().parent.parent
    assets_dir = backend_dir / "assets"
    uploads_dir = backend_dir / config.UPLOAD_DIR
    
    # Tạo thư mục uploads nếu chưa tồn tại
    uploads_dir.mkdir(parents=True, exist_ok=True)
    
    print("--- Bat dau sao chep anh ---")
    if not assets_dir.exists():
        print(f"Loi: Khong tim thay thu muc assets tai {assets_dir}")
        sys.exit(1)
        
    # Lấy danh sách tất cả file ảnh trong assets
    copied_count = 0
    for file_path in assets_dir.glob("anh*.jpg"):
        # Copy file gốc (.jpg) sang uploads
        dest_jpg = uploads_dir / file_path.name
        shutil.copy2(file_path, dest_jpg)
        
        # Đồng thời tạo file với đuôi .jnp (typo của người dùng) để đề phòng frontend gọi trực tiếp
        jnp_filename = file_path.name.replace(".jpg", ".jnp")
        dest_jnp = uploads_dir / jnp_filename
        shutil.copy2(file_path, dest_jnp)
        
        copied_count += 1
        
    print(f"Da copy xong {copied_count} file anh sang thu muc uploads.")
    
    # 2. Cập nhật cơ sở dữ liệu
    print("\n--- Bat dau cap nhat co so du lieu ---")
    db = SessionLocal()
    try:
        # Lấy tất cả món ăn trong thực đơn
        items = db.query(ThucDon).all()
        updated_count = 0
        
        for item in items:
            old_hinhanh = item.hinhanh
            if old_hinhanh:
                # Chuẩn hóa tên file: loại bỏ khoảng trắng, đổi đuôi .jnp hoặc các định dạng khác thành .jpg
                filename = old_hinhanh.strip()
                
                # Nếu là đường dẫn đầy đủ, lấy phần tên file
                if "/" in filename:
                    filename = filename.split("/")[-1]
                
                # Sửa typo .jnp thành .jpg
                filename_clean = filename.replace(".jnp", ".jpg")
                
                # Tạo đường dẫn mới đúng chuẩn: /uploads/anhX.jpg
                new_hinhanh = f"/{config.UPLOAD_DIR}/{filename_clean}"
                
                if old_hinhanh != new_hinhanh:
                    print(f"Cap nhat ma {item.mamon}: '{old_hinhanh}' -> '{new_hinhanh}'")
                    item.hinhanh = new_hinhanh
                    updated_count += 1
            else:
                # Nếu món ăn chưa có hình ảnh, hoặc có thể thử gán tự động dựa theo mã món hoặc tên món nếu cần thiết
                # Ở đây chúng ta chỉ cập nhật các bản ghi đã lưu sẵn anh1.jnp, anh2.jnp...
                pass
                
        if updated_count > 0:
            db.commit()
            print(f"Da cap nhat thanh cong {updated_count} mon an trong co so du lieu.")
        else:
            print("Khong co mon an nao can cap nhat.")
            
    except Exception as e:
        db.rollback()
        print(f"Đã xảy ra lỗi khi cập nhật database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    main()
