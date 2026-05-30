import re

files = [
    'crud/payment.py',
    'service/payment.py',
    'model/payment.py'
]

replacements = {
    '"PENDING"': 'PaymentStatus.PENDING',
    '"PAID"': 'PaymentStatus.PAID',
    '"CANCELLED"': 'OrderStatus.CANCELLED', # wait, CANCELLED could be from OrderStatus or PaymentStatus
    '"CASH"': 'PaymentMethod.CASH',
    '"BANKING"': 'PaymentMethod.BANKING',
}

for filepath in files:
    with open(filepath, 'r') as f:
        content = f.read()

    # Need to add import
    if 'PaymentStatus' not in content:
        content = 'from model.enums import PaymentStatus, PaymentMethod\n' + content

    for k, v in replacements.items():
        if k == '"CANCELLED"':
            if 'payment' in filepath:
                content = content.replace(k, 'PaymentStatus.CANCELLED')
        else:
            content = content.replace(k, v)
        
    with open(filepath, 'w') as f:
        f.write(content)

print("Payment Strings replaced")
