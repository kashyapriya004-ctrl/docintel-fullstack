# backend/database.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,      # Test connection before using — reconnects if dropped
    pool_recycle=300,        # Recycle connections every 5 min (Neon times out at ~5min idle)
)

SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()