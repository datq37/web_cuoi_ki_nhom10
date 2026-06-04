from fastapi import APIRouter

from . import report, admin_orders, auth, categories, menus, khachhang, orders, payments, notification, inventory, khuyenmai, nhanvien, cosovatchat, combo

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(khachhang.router)
api_router.include_router(categories.router)
api_router.include_router(menus.router)
api_router.include_router(orders.router)
api_router.include_router(payments.router)
api_router.include_router(admin_orders.router)
api_router.include_router(report.router)
api_router.include_router(notification.router)
api_router.include_router(inventory.router)
api_router.include_router(khuyenmai.router)
api_router.include_router(nhanvien.router)
api_router.include_router(cosovatchat.router)
api_router.include_router(combo.router)
