import re

with open('src/services/KhachHang/Giỏ hàng/cartoption/index.ts', 'r') as f:
    content = f.read()

# Replace export const SEED_VOUCHERS = [...] with empty array
content = re.sub(r'export const SEED_VOUCHERS: Voucher\[\] = \[.*?\];', 'export const SEED_VOUCHERS: Voucher[] = [];', content, flags=re.DOTALL)

with open('src/services/KhachHang/Giỏ hàng/cartoption/index.ts', 'w') as f:
    f.write(content)
