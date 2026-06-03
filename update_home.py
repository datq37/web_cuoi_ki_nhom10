import re

with open('src/pages/KhachHang/TrangChu/index.tsx', 'r') as f:
    content = f.read()

content = re.sub(r'import OffersAndCombos.*?\n', '', content)
content = re.sub(r'<OffersAndCombos.*?\n', '', content)

with open('src/pages/KhachHang/TrangChu/index.tsx', 'w') as f:
    f.write(content)
