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
