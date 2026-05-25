# Backend FastAPI — Quản lý Căng tin

## Cấu trúc thư mục

```
Backend/
├── database.py      # Engine, SessionLocal, Base, get_db()
├── config.py        # JWT và cấu hình API
├── main.py          # Entry point FastAPI
├── dependencies.py  # get_current_user, get_current_active_admin
├── model/           # SQLAlchemy models
├── schemas/         # Pydantic schemas
├── crud/            # Thao tác database
├── service/         # Logic nghiệp vụ (JWT, hash password)
└── routes/          # API endpoints
```

## Cài đặt

```bash
cd Backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

Sửa `DATABASE_URL` trong `.env` hoặc biến môi trường hệ thống.

## Chạy server

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Swagger: http://localhost:8000/docs

## Tạo Admin đầu tiên

```bash
python scripts/seed_admin.py
```

## API

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| POST | `/api/v1/auth/register` | Đăng ký |
| POST | `/api/v1/auth/login` | Đăng nhập |
| POST | `/api/v1/auth/refresh` | Làm mới token |
| POST | `/api/v1/auth/logout` | Đăng xuất |
| GET/PATCH | `/api/v1/users/me` | Hồ sơ cá nhân |
| CRUD | `/api/v1/users` | Admin quản lý tài khoản |

Header: `Authorization: Bearer <access_token>`

## Module Thực đơn (Menu)

| Method | Endpoint | Quyền |
|--------|----------|--------|
| GET | `/api/v1/categories` | User đăng nhập |
| POST/PATCH/DELETE | `/api/v1/categories` | Admin |
| GET | `/api/v1/menus/items` | User (lọc `category_id`, `is_available`) |
| POST/PATCH/DELETE | `/api/v1/menus/items` | Admin |
| POST | `/api/v1/menus/items/{id}/upload-image` | Admin |
| PATCH | `/api/v1/menus/items/{id}/toggle-status` | Admin |
| GET | `/api/v1/menus/daily?menu_date=YYYY-MM-DD` | User |
| POST/DELETE | `/api/v1/menus/daily` | Admin |

Ảnh upload lưu tại `Backend/uploads/`, truy cập qua `/uploads/<filename>`.
