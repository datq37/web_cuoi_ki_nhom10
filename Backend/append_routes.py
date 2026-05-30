with open('routes/__init__.py', 'r') as f:
    content = f.read()

if 'admin_orders' not in content:
    content = content.replace('from . import auth', 'from . import admin_orders, auth')
    content += "api_router.include_router(admin_orders.router)\n"
    with open('routes/__init__.py', 'w') as f:
        f.write(content)
