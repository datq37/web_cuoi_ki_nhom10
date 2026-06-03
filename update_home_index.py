import re

with open('src/pages/KhachHang/TrangChu/index.tsx', 'r') as f:
    content = f.read()

content = content.replace("getDishImage,", "getDishImage,\n    categories,")
content = content.replace("getDishImage={getDishImage}", "getDishImage={getDishImage}\n            categories={categories}")

with open('src/pages/KhachHang/TrangChu/index.tsx', 'w') as f:
    f.write(content)
