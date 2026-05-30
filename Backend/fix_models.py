import re

with open('model/orders.py', 'r') as f:
    orders_content = f.read()

orders_content = orders_content.replace('default="Giỏ hàng"', 'default="cart"')
with open('model/orders.py', 'w') as f:
    f.write(orders_content)

with open('model/payment.py', 'r') as f:
    payment_content = f.read()

payment_content = payment_content.replace('default="PENDING"', 'default="pending"')
with open('model/payment.py', 'w') as f:
    f.write(payment_content)
