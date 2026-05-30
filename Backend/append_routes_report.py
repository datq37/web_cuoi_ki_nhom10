with open('routes/__init__.py', 'r') as f:
    content = f.read()

if 'from . import ' in content and 'report' not in content:
    content = content.replace('from . import ', 'from . import report, ')
    content += "api_router.include_router(report.router)\n"
    with open('routes/__init__.py', 'w') as f:
        f.write(content)
