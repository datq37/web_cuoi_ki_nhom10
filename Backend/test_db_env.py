from database import engine
from sqlalchemy import text
import sys
try:
    with engine.connect() as conn:
        print("OK")
except Exception as e:
    print("ERROR", str(e))
