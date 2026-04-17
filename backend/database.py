from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./docintel.db")

if DATABASE_URL.startswith("sqlite"):
    # Use absolute path relative to project root
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    db_path = os.path.join(BASE_DIR, "docintel.db")
    engine = create_engine(
        f"sqlite:///{db_path}",
        connect_args={"check_same_thread": False}
    )
else:
    from sqlalchemy.pool import NullPool
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
        pool_recycle=300,
        poolclass=NullPool
    )

SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()
