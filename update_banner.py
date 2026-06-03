import re

with open('src/pages/KhachHang/TrangChu/Components/Banner/index.tsx', 'r') as f:
    content = f.read()

# Remove the specific StatCards
content = re.sub(r'<StatCard icon=\{<Soup.*?\n', '', content)
content = re.sub(r'<StatCard icon=\{<TicketPercent.*?\n', '', content)

with open('src/pages/KhachHang/TrangChu/Components/Banner/index.tsx', 'w') as f:
    f.write(content)
