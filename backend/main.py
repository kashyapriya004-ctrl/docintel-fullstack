from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

# Database
from backend.database import engine, SessionLocal
from backend import models

# Schemas
from backend.schemas import UserCreate, UserLogin, QuestionRequest

# Auth
from backend.auth import hash_password, verify_password, create_token

# Your existing RAG imports (KEEP THESE SAME)
from backend.policy_fetcher import fetch_all_policies
from backend.chunker import chunk_text
from backend.embeddings import create_embeddings, semantic_search
from backend.answer_generator import generate_answer

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables in DB
models.Base.metadata.create_all(bind=engine)


# -------------------- DATABASE DEPENDENCY --------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# -------------------- REGISTER --------------------
@app.post("/api/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    hashed_password = hash_password(user.password)

    new_user = models.User(
        email=user.email,
        hashed_password=hashed_password
    )

    db.add(new_user)
    db.commit()

    return {"message": "User registered successfully 🌸"}


# -------------------- LOGIN --------------------
@app.post("/api/login")
def login(user: UserLogin, db: Session = Depends(get_db)):

    db_user = db.query(models.User).filter(models.User.email == user.email).first()

    if not db_user:
        return {"error": "User not found"}

    if not verify_password(user.password, db_user.hashed_password):
        return {"error": "Incorrect password"}

    token = create_token({"user_id": db_user.id})

    return {"access_token": token}


# -------------------- ASK (RAG + SAVE HISTORY) --------------------
@app.post("/api/ask")
def ask_question(request: QuestionRequest, db: Session = Depends(get_db)):
    from fastapi import HTTPException

    query = request.question

    try:
        # -------- LIVE SCRAPE (parallel fetch, ~8-10 sec) --------
        all_data = fetch_all_policies()
        combined_text = "\n\n".join(all_data.values())

        chunks = chunk_text(combined_text)
        embeddings = create_embeddings(chunks)

        results = semantic_search(query, chunks, embeddings)
        final_answer = generate_answer(query, results)

        # -------- SAVE HISTORY (separate try — never fail the answer) --------
        try:
            # Only save if user actually exists in DB
            user_id = request.user_id
            user_exists = db.query(models.User).filter(models.User.id == user_id).first()

            if user_exists:
                new_entry = models.SearchHistory(
                    question=query,
                    answer=final_answer,
                    user_id=user_id
                )
                db.add(new_entry)
                db.commit()
                print(f"[history] Saved for user_id={user_id}")
            else:
                print(f"[history] Skipped — user_id={user_id} not in DB (guest or invalid)")

        except Exception as db_err:
            print(f"[history] DB save failed (non-fatal): {db_err}")
            db.rollback()

        # Always return the answer regardless of history save result
        return {
            "question": query,
            "answer": final_answer
        }

    except Exception as e:
        print(f"Error in ask_question: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Backend processing error: {str(e)}")



# -------------------- GET LAST 10 HISTORY --------------------
@app.get("/api/history")
def get_history(user_id: int, db: Session = Depends(get_db)):

    history = db.query(models.SearchHistory)\
        .filter(models.SearchHistory.user_id == user_id)\
        .order_by(models.SearchHistory.timestamp.desc())\
        .limit(10)\
        .all()

    return history

# -------------------- DELETE HISTORY --------------------
@app.delete("/api/history/{history_id}")
def delete_history(history_id: int, user_id: int, db: Session = Depends(get_db)):
    history_item = db.query(models.SearchHistory).filter(
        models.SearchHistory.id == history_id,
        models.SearchHistory.user_id == user_id
    ).first()
    
    if not history_item:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="History not found or unauthorized")
        
    db.delete(history_item)
    db.commit()
    
    return {"message": "History deleted successfully"}