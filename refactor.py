import os
import subprocess
import glob

# Paths to process
ROOT_DIR = "d:/laptrinhwweb/cuoiki/web_cuoi_ki_nhom10_admin"
SRC_DIR = os.path.join(ROOT_DIR, "src")
CONFIG_DIR = os.path.join(ROOT_DIR, "config")

# Mappings of old to new names
RENAME_MAP = {
    "Khách Hàng": "KhachHang",
    "Khách hàng": "KhachHang",
    "Quản Trị": "QuanTri",
    "Trang Chủ": "TrangChu",
    "Thực đơn": "ThucDon",
    "Tiện ích": "TienIch",
}

def rename_dirs():
    for root, dirs, files in os.walk(SRC_DIR, topdown=False):
        for dir_name in dirs:
            for old, new in RENAME_MAP.items():
                if dir_name == old:
                    old_path = os.path.join(root, old)
                    new_path = os.path.join(root, new)
                    subprocess.run(["git", "mv", old_path, new_path], cwd=ROOT_DIR)

def replace_in_files():
    # Extensions to check
    exts = ["*.ts", "*.tsx", "*.js", "*.jsx", "*.less"]
    files_to_process = []
    
    # Get all files in src
    for root, _, files in os.walk(SRC_DIR):
        for file in files:
            if any(file.endswith(ext.replace("*", "")) for ext in exts):
                files_to_process.append(os.path.join(root, file))
                
    # Also add config/routes.ts
    files_to_process.append(os.path.join(CONFIG_DIR, "routes.ts"))

    for filepath in files_to_process:
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
            
            new_content = content
            for old, new in RENAME_MAP.items():
                new_content = new_content.replace(old, new)
                # Also replace URI encoded versions just in case
                import urllib.parse
                new_content = new_content.replace(urllib.parse.quote(old), urllib.parse.quote(new))

            if content != new_content:
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(new_content)
        except Exception as e:
            print(f"Failed to process {filepath}: {e}")

if __name__ == "__main__":
    # 1. Rename directories
    rename_dirs()
    # 2. Replace strings in files
    replace_in_files()
    print("Refactoring complete.")
