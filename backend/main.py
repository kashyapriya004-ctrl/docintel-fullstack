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
        # -------- USE CACHED POLICY TEXT (avoids live crawl timeout) --------
        combined_text = """
National Education Policy 2020 (NEP 2020):
The National Education Policy 2020 was approved by the Union Cabinet of India on 29 July 2020. It replaced the 34-year-old National Policy on Education 1986. NEP 2020 aims to transform India's education system by 2040. Key features include: 5+3+3+4 curricular structure replacing the 10+2 system, emphasis on multilingual education and mother tongue as medium of instruction till grade 5, introduction of coding from grade 6, vocational education from grade 6, holistic development focus, academic bank of credits for higher education, multidisciplinary approach, focus on critical thinking and creativity. NEP 2020 targets 100% Gross Enrollment Ratio in school education by 2030 and 50% GER in higher education by 2035. It emphasizes foundational literacy and numeracy, reduces curriculum content, promotes experiential learning, and integrates arts and sports. The policy introduces flexibility in subject choices at secondary level. For higher education, the policy proposes 4-year multidisciplinary undergraduate programs with multiple exit options (certificate after 1 year, diploma after 2 years, bachelor's degree after 3 years, bachelor's with research after 4 years). 

UGC (University Grants Commission) Guidelines:
The UGC is a statutory body established by the University Grants Commission Act, 1956. It provides grants to universities and colleges and coordinates, determines and maintains standards of university education in India. UGC guidelines cover: academic autonomy for universities, curriculum frameworks, assessment and examination reforms, online and distance education, academic collaboration, research and innovation promotion. UGC has issued guidelines for autonomous colleges, curriculum development, examination reforms, and online education. UGC regulations govern the minimum standards for appointments at universities. UGC recognizes universities and grants them the right to award degrees. UGC NET examination is conducted for determining eligibility for assistant professor posts and Junior Research Fellowship. UGC CARE list maintains approved journals for academic publications. Guidelines for autonomous colleges allow them to design their own curriculum and conduct examinations independently.

AICTE (All India Council for Technical Education) Approval Process:
AICTE is a statutory body under Ministry of Education that regulates technical education in India. AICTE approval is mandatory for running technical programs at diploma, undergraduate, postgraduate and doctoral levels. Approval process includes: submission of application through AICTE web portal, verification of land, building, faculty, equipment and other infrastructure, inspection by expert committee, grant of approval for specific intake capacity. AICTE sets norms for pay, faculty qualifications, curriculum, and facilities. AICTE promotes quality in technical education through accreditation via NBA (National Board of Accreditation). AICTE approves programs in engineering, technology, management, architecture, pharmacy, hotel management, applied arts and crafts. AICTE issues regulations on faculty qualifications, student-faculty ratio, and infrastructure requirements. AICTE model curriculum recommendations are provided for various technical disciplines. AICTE has initiatives like SMART India Hackathon, student internship schemes, and faculty development programs.

Ministry of Education (MOE) Policies:
The Ministry of Education (formerly HRD Ministry) oversees all aspects of education in India. Key schemes include: Samagra Shiksha (integrated scheme for school education), PM POSHAN (mid-day meal scheme), DIKSHA (digital infrastructure for knowledge sharing), NIPUN Bharat (foundational literacy and numeracy mission), National Curriculum Framework development, SWAYAM (online courses platform), SWAYAM PRABHA (educational TV channels), National Institutional Ranking Framework (NIRF), Institutions of Eminence scheme. The ministry implements NEP 2020 across all states. RTE Act 2009 mandates free and compulsory education for children aged 6-14. STARS project supports state-level reforms in school education with World Bank funding. PM e-VIDYA initiative was launched during COVID-19 for multi-mode digital education. National Assessment Centre PARAKH handles assessment reforms under NEP 2020.
        """

        chunks = chunk_text(combined_text)
        embeddings = create_embeddings(chunks)

        results = semantic_search(query, chunks, embeddings)
        final_answer = generate_answer(query, results)

        # -------- SAVE HISTORY --------
        new_entry = models.SearchHistory(
            question=query,
            answer=final_answer,
            user_id=1   # TEMP (we fix later with JWT)
        )

        db.add(new_entry)
        db.commit()

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