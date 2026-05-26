from fastapi import APIRouter

from . import auth, categories, menus, khachhang, orders

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(khachhang.router)
api_router.include_router(categories.router)
api_router.include_router(menus.router)
api_router.include_router(orders.router)
