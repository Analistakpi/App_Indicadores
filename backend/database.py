from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL no está definida en las variables de entorno.")

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping   = True,
    pool_size       = 5,
    max_overflow    = 10,
    pool_recycle    = 1800,
    hide_parameters = True,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()