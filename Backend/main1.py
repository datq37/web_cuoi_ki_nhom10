from fastapi import FastAPI, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

# Import get_db từ file database.py bạn vừa tạo
from database import get_db 

app = FastAPI(title="Canteen Management API")

@app.get("/test-db")
def test_db_connection(db: Session = Depends(get_db)):
    """
    API dùng để kiểm tra kết nối tới PostgreSQL
    """
    try:
        # Chạy một câu lệnh SQL cực kỳ cơ bản
        db.execute(text("SELECT 1"))
        return {
            "status": "Thành công", 
            "message": "Backend đã kết nối trơn tru tới PostgreSQL!"
        }
    except Exception as e:
        return {
            "status": "Thất bại", 
            "message": f"Lỗi kết nối database: {str(e)}"
        }