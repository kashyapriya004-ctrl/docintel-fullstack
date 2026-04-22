import os
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text

try:
    from backend.database import engine, SessionLocal
    from backend import models
    from backend.schemas import UserCreate, UserLogin, QuestionRequest, UserResponse, UserUpdate
    from backend.auth import hash_password, verify_password, create_token
    from backend.answer_generator import generate_answer
except (ImportError, ValueError, ModuleNotFoundError):
    from database import engine, SessionLocal
    import models
    from schemas import UserCreate, UserLogin, QuestionRequest, UserResponse, UserUpdate
    from auth import hash_password, verify_password, create_token
    from answer_generator import generate_answer

app = FastAPI(title="DocIntel AI", description="The Ultimate Policy Intelligence System")

# Get port from Azure or default to 8000
port = int(os.getenv("PORT", 8000))

# Get allowed origins from environment variable or default to localhost
raw_origins = os.getenv("ALLOWED_ORIGINS", "").split(",")
allowed_origins = [o.strip().rstrip("/") for o in raw_origins if o.strip()]

# Add standard local origins if nothing is specified or as a safety net
default_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "https://doc_intel.vercel.app" # Placeholder example
]

for origin in default_origins:
    if origin not in allowed_origins:
        allowed_origins.append(origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    models.Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"[db] Warning: Database initialization failed: {e}")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def root():
    return {"message": "DocIntel AI Engine is Operational"}

@app.get("/health")
def health(db: Session = Depends(get_db)):
    db_status = "connected"
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"disconnected: {str(e)}"
    
    return {
        "status": "healthy",
        "database": db_status,
        "mode": "expert_knowledge"
    }

@app.post("/api/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = hash_password(user.password)
    new_user = models.User(
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name or "",
        role=user.role or "Student",
        institution=user.institution or ""
    )
    db.add(new_user)
    db.commit()
    return {"message": "User registered successfully", "user_id": new_user.id}

@app.post("/api/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user:
        return {"error": "User not found"}
    if not verify_password(user.password, db_user.hashed_password):
        return {"error": "Incorrect password"}
    token = create_token({"user_id": db_user.id})
    return {
        "access_token": token,
        "user": {
            "id": db_user.id,
            "email": db_user.email,
            "full_name": db_user.full_name,
            "role": db_user.role,
            "institution": db_user.institution,
            "is_verified": db_user.is_verified
        }
    }

@app.get("/api/user/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.put("/api/user/{user_id}")
def update_user(user_id: int, user_update: UserUpdate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user_update.full_name is not None:
        db_user.full_name = user_update.full_name
    if user_update.role is not None:
        db_user.role = user_update.role
    if user_update.institution is not None:
        db_user.institution = user_update.institution
    
    db.commit()
    return {"message": "Profile updated successfully", "user": {
        "id": db_user.id,
        "email": db_user.email,
        "full_name": db_user.full_name,
        "role": db_user.role,
        "institution": db_user.institution
    }}

@app.post("/api/ask")
def ask_question(request: QuestionRequest, db: Session = Depends(get_db)):
    query = request.question

    if not query or len(query.strip()) < 3:
        raise HTTPException(status_code=400, detail="Please enter a valid question.")

    try:
        final_answer = generate_answer(query, [])

        actual_sources = [
            "https://www.ugc.gov.in/guidelines",
            "https://www.education.gov.in/nep-2020",
            "https://www.aicte-india.org/policies"
        ]

        try:
            user_id = request.user_id
            if user_id:
                user_exists = db.query(models.User).filter(models.User.id == user_id).first()
                if user_exists:
                    new_entry = models.SearchHistory(
                        question=query,
                        answer=final_answer,
                        user_id=user_id
                    )
                    db.add(new_entry)
                    db.commit()
        except Exception:
            pass

        return {
            "question": query,
            "answer": final_answer,
            "sources": actual_sources
        }

    except Exception as e:
        print(f"Error in ask_question: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/history")
def get_history(user_id: int, db: Session = Depends(get_db)):
    history = db.query(models.SearchHistory)\
        .filter(models.SearchHistory.user_id == user_id)\
        .order_by(models.SearchHistory.timestamp.desc())\
        .limit(20)\
        .all()
    return history

@app.delete("/api/history/{history_id}")
def delete_history(history_id: int, user_id: int, db: Session = Depends(get_db)):
    history_item = db.query(models.SearchHistory).filter(
        models.SearchHistory.id == history_id,
        models.SearchHistory.user_id == user_id
    ).first()
    if not history_item:
        raise HTTPException(status_code=404, detail="History not found")
    db.delete(history_item)
    db.commit()
    return {"message": "Deleted successfully"}

if __name__ == "__main__":
    import uvicorn
    # Use the port variable defined at the top of the file
    uvicorn.run(app, host="0.0.0.0", port=port)