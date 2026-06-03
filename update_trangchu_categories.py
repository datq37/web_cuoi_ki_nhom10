with open('src/models/KhachHang/TrangChu/index.ts', 'r') as f:
    content = f.read()

content = content.replace("const { cart, addToCart, incCart, decCart, dishes } = useModel('KhachHang.ThucDon.index') as any;",
                          "const { cart, addToCart, incCart, decCart, dishes, categories } = useModel('KhachHang.ThucDon.index') as any;")

content = content.replace("getDishImage,", "getDishImage,\ncategories,")

with open('src/models/KhachHang/TrangChu/index.ts', 'w') as f:
    f.write(content)
