import re

with open('src/services/KhachHang/Đơn Hàng/index.ts', 'r') as f:
    content = f.read()

content = re.sub(r'export const SEED_ORDERS.*', '', content, flags=re.DOTALL)

with open('src/services/KhachHang/Đơn Hàng/index.ts', 'w') as f:
    f.write(content)

