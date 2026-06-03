with open('src/models/KhachHang/TrangChu/index.ts', 'r') as f:
    content = f.read()

import re

# Remove SEED_MENU and SEED_VOUCHERS imports
content = re.sub(r'import \{ SEED_MENU \} from .*?;\n', '', content)
content = re.sub(r'import \{ SEED_VOUCHERS \} from .*?;\n', '', content)

# Get dishes from ThucDon.index
content = content.replace("const { cart, addToCart, incCart, decCart } = useModel('KhachHang.ThucDon.index') as any;",
                          "const { cart, addToCart, incCart, decCart, dishes } = useModel('KhachHang.ThucDon.index') as any;")

# Update bestSellingDishes to use dishes instead of SEED_MENU
content = content.replace("() => [...SEED_MENU].sort((a, b) => b.sold - a.sold).slice(0, 3),",
                          "() => [...(dishes || [])].sort((a, b) => b.sold - a.sold).slice(0, 3),")
content = content.replace("[],", "[dishes],")

# Update todayDishCount and activeOfferCount
content = content.replace("todayDishCount: SEED_MENU.length,", "todayDishCount: dishes?.length || 0,")
content = content.replace("activeOfferCount: SEED_VOUCHERS.length,", "activeOfferCount: 0,")

with open('src/models/KhachHang/TrangChu/index.ts', 'w') as f:
    f.write(content)
