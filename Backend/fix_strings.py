import re

files = [
    'routes/orders.py',
    'service/orders.py',
    'crud/orders.py',
    'model/orders.py'
]

replacements = {
    '"Giỏ hàng"': 'OrderStatus.CART',
    '"Chờ xác nhận"': 'OrderStatus.PENDING_CONFIRMATION',
    '"Đã xác nhận"': 'OrderStatus.CONFIRMED',
    '"Đang xử lý"': 'OrderStatus.PROCESSING',
    '"Đã giao"': 'OrderStatus.DELIVERED',
    '"Đã hủy"': 'OrderStatus.CANCELLED',
    '"Tiền mặt"': 'PaymentMethod.CASH'
}

for filepath in files:
    with open(filepath, 'r') as f:
        content = f.read()

    # Need to add import
    if 'OrderStatus' not in content:
        content = 'from model.enums import OrderStatus, PaymentMethod\n' + content

    for k, v in replacements.items():
        # we don't replace in comments if possible, but actually replacing in docstrings is fine.
        # However, OrderStatus.CART in docstring looks weird. 
        # So we only replace if it's not a docstring.
        pass

    # Better to just use regex to replace when it's assigned or compared.
    # We can replace all exact matches
    for k, v in replacements.items():
        content = content.replace(k, v)
        
    with open(filepath, 'w') as f:
        f.write(content)

print("Strings replaced")
