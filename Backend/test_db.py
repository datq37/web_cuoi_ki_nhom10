import sys
import logging
from sqlalchemy import text
from database import engine

logging.basicConfig()
logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)

try:
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        print("KẾT NỐI DATABASE THÀNH CÔNG! ✅")
        print("Kết quả:", result.scalar())
except Exception as e:
    print("KẾT NỐI DATABASE THẤT BẠI ❌")
    print(e)
