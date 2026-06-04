import os
from dotenv import load_dotenv
load_dotenv()
print("ENV DATABASE_URL:", os.getenv("DATABASE_URL"))
