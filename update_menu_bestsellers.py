import re

with open('src/pages/KhachHang/TrangChu/Components/Danh mục và Bán chạy/index.tsx', 'r') as f:
    content = f.read()

# Update MenuAndBestSellersProps in typing.ts or just inline it?
# The typing is in src/services/KhachHang/TrangChu/typing.ts. I can just add `categories?: any[];` to the component props directly for now to avoid dealing with typing.ts if it's too complex.

content = content.replace("MenuAndBestSellersProps> = ({", "MenuAndBestSellersProps & { categories?: {id: string, label: string}[] }> = ({")
content = content.replace("getDishImage,", "getDishImage,\n  categories,")

# Replace hardcoded CategoryCard elements
category_grid_pattern = r'<div className="category-grid">.*?</div>'
replacement = """<div className="category-grid">
        {(categories || []).filter(c => c.id !== 'all').map((c, idx) => (
          <CategoryCard key={c.id} img={[comPhan, bunPho, doUong, anNhe, chaySalad][idx % 5]} title={c.label} />
        ))}
      </div>"""

content = re.sub(category_grid_pattern, replacement, content, flags=re.DOTALL)

with open('src/pages/KhachHang/TrangChu/Components/Danh mục và Bán chạy/index.tsx', 'w') as f:
    f.write(content)
