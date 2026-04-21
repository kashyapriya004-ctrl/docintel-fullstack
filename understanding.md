# DocIntel AI - Project Understanding Guide

## Table of Contents
1. [Quick Start](#quick-start)
2. [Project Overview](#project-overview)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [How It Works](#how-it-works)
6. [AI & Scope Detection](#ai--scope-detection)
7. [API Endpoints](#api-endpoints)
8. [Running the Project](#running-the-project)
9. [Troubleshooting](#troubleshooting)
10. [Deploy Publicly](#deploy-publicly)

---

## Quick Start

### One-Command Run
```bash
cd /Users/ro/Desktop/DOCINTEL
chmod +x startup.sh
./startup.sh
```

### Manual Start
```bash
# Terminal 1 - Backend
cd /Users/ro/Desktop/DOCINTEL
export GEMINI_API_KEY="your-api-key"
unset GOOGLE_API_KEY
python3 -m uvicorn backend.main:app --host 127.0.0.1 --port 9000

# Terminal 2 - Frontend
cd /Users/ro/Desktop/DOCINTEL/frontend
npm run dev
```

### Access Points
- **Frontend**: http://localhost:5173 (or 5174 if 5173 is busy)
- **Backend API**: http://127.0.0.1:8000
- **API Documentation**: http://127.0.0.1:8000/docs

---

## Project Overview

**DocIntel AI** is a ChatGPT-like intelligent assistant that specializes exclusively in **Indian Education Policies and Guidelines**.

### What It Does
- Answers questions about UGC, AICTE, NEP 2020, Ministry of Education policies
- Uses Google's Gemini AI for accurate, knowledgeable responses
- Filters out off-topic questions (politely redirects)
- Clean, readable output without markdown clutter

### What It Doesn't Do
- Does NOT scrape government websites (they're often down)
- Does NOT answer non-education questions
- Does NOT use pre-cached data

---

## Tech Stack

### Frontend
```
React 18 + TypeScript + Vite
├── Tailwind CSS (styling)
├── React Router (navigation)
├── Lucide React (icons)
└── Custom CSS animations
```

**Why these choices?**
- **React**: Component-based, fast updates
- **TypeScript**: Type safety, fewer bugs
- **Vite**: Lightning-fast dev server
- **Tailwind**: Rapid UI development

### Backend
```
Python 3.14 + FastAPI
├── Google Gemini AI (intelligence)
├── SQLAlchemy (database)
├── SQLite (local storage)
└── Pydantic (validation)
```

**Why these choices?**
- **FastAPI**: Fast, async, auto-generated docs
- **Gemini AI**: Knowledgeable about Indian education
- **SQLite**: Zero-config, works locally
- **Pydantic**: Automatic request/response validation

---

## Project Structure

```
DOCINTEL/
├── frontend/                    # React Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.tsx     # Navigation bar
│   │   │   ├── Button.tsx     # Custom button
│   │   │   ├── Textarea.tsx   # Custom textarea
│   │   │   └── DeleteConfirmModal.tsx
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx # Authentication state
│   │   ├── pages/
│   │   │   ├── Landing.tsx     # Homepage
│   │   │   ├── Search.tsx      # Main Q&A page
│   │   │   ├── Login.tsx       # Login page
│   │   │   ├── Signup.tsx      # Signup page
│   │   │   └── History.tsx     # Search history
│   │   ├── services/
│   │   │   └── gemini.ts       # API calls to backend
│   │   ├── index.css           # All animations & styles
│   │   ├── App.tsx             # Main app component
│   │   └── main.tsx            # Entry point
│   ├── .env                     # Environment variables
│   ├── package.json             # Dependencies
│   └── vite.config.ts           # Vite configuration
│
├── backend/                    # Python Backend
│   ├── main.py                 # FastAPI app, all routes
│   ├── answer_generator.py      # AI logic & scope detection
│   ├── database.py              # SQLite database setup
│   ├── models.py                # SQLAlchemy models
│   ├── schemas.py               # Pydantic schemas
│   ├── auth.py                  # Password hashing & tokens
│   ├── policy_fetcher.py        # (Unused now - kept for reference)
│   ├── chunker.py               # (Unused now - kept for reference)
│   ├── embeddings.py            # (Unused now - kept for reference)
│   └── docintel.db              # SQLite database file
│
├── startup.sh                   # Quick start script
├── README.md                    # Basic instructions
├── requirements.txt             # Python dependencies
└── venv/                       # Python virtual environment
```

---

## How It Works

### Architecture Flow
```
User Question
     ↓
Frontend (React)
     ↓
API Call to Backend
     ↓
FastAPI Route (/api/ask)
     ↓
Scope Detection (Is it education-related?)
     ↓
┌────────────────────────────────────┐
│  YES → Gemini AI → Clean Output    │
│  NO  → Polite Redirect Message      │
└────────────────────────────────────┘
     ↓
Response to Frontend
     ↓
Display to User
```

### Step-by-Step Flow

1. **User types question** in the Search page textarea
2. **Frontend sends POST** to `http://127.0.0.1:8000/api/ask` with `{question, user_id}`
3. **Backend receives** the request in `main.py`
4. **Scope Detection** checks if question contains education keywords
5. **If NOT education**: Returns polite "I can only help with..." message
6. **If education**: Sends question to Gemini AI
7. **Gemini returns** answer in markdown format
8. **Backend cleans** the markdown (removes **, ##, - etc.)
9. **Clean text** returned to frontend
10. **Frontend displays** the answer in a beautiful card

---

## AI & Scope Detection

### Scope Detection (answer_generator.py)

The AI only answers questions related to Indian Education. This is how it decides:

```python
EDUCATION_SCOPES = [
    # Core education terms
    "education", "university", "college", "school", "policy",
    
    # Regulatory bodies
    "ugc", "aicte", "ministry of education", "moe",
    
    # Specific policies
    "nep", "nep2020", "nep 2020", "national education policy",
    
    # Academic terms
    "phd", "postgraduate", "undergraduate", "degree", "diploma",
    
    # Exams & eligibility
    "ugc net", "ugc-net", "NET", "SET", "JRF", "SRF",
    
    # Institutions
    "IIT", "IIM", "NIT", "NAAC", "NBA", "NIRF",
    
    # And 60+ more keywords...
]
```

**How it works:**
1. User asks: "How to make pizza?"
2. System checks: Is "pizza" in EDUCATION_SCOPES? → NO
3. Response: "I can only help with Indian Education Policies..."

### Answer Generation

If question IS education-related:

```python
prompt = f"""You are DocIntel AI, an expert in Indian Education Policies.

IMPORTANT FORMATTING RULES:
1. Do NOT use markdown (**bold**, ## headers, etc.)
2. Use simple bullet points (•)
3. Write in clean paragraphs
4. Include specific details

USER QUESTION: {query}

Provide a clean response:"""
```

Then sends to Gemini AI and cleans the output.

### Output Cleaning

Removes all markdown formatting:
- `**bold**` → `bold`
- `## Headers` → `Headers`
- `- bullets` → `• bullets`
- `*italic*` → `italic`

---

## API Endpoints

### Health Check
```
GET http://127.0.0.1:8000/health

Response: {"status": "healthy"}
```

### Ask a Question
```
POST http://127.0.0.1:8000/api/ask
Content-Type: application/json

{
  "question": "What is NEP 2020?",
  "user_id": 1
}

Response: {
  "question": "What is NEP 2020?",
  "answer": "The National Education Policy 2020..."
}
```

### Register User
```
POST http://127.0.0.1:8000/api/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: {"message": "Registration successful!"}
```

### Login User
```
POST http://127.0.0.1:8000/api/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: {"access_token": "eyJhbGc..."}
```

### Get History
```
GET http://127.0.0.1:8000/api/history?user_id=1

Response: [
  {
    "id": 1,
    "question": "What is NEP 2020?",
    "answer": "The National...",
    "timestamp": "2024-01-15T10:30:00"
  }
]
```

### Delete History Item
```
DELETE http://127.0.0.1:8000/api/history/1?user_id=1

Response: {"message": "Deleted successfully"}
```

---

## Running the Project

### Prerequisites
1. **Python 3.10+** (Tested with 3.14)
2. **Node.js 18+** (for frontend)
3. **Gemini API Key** (from Google AI Studio)

### Get Gemini API Key
1. Go to https://aistudio.google.com
2. Sign in with Google account
3. Click "Get API Key" in sidebar
4. Create new API key
5. Copy the key

### Setup Steps

#### 1. Clone/Download Project
```bash
cd /Users/ro/Desktop/DOCINTEL
```

#### 2. Set API Key
```bash
export GEMINI_API_KEY="AIzaSy..."
```

#### 3. Start Backend
```bash
cd /Users/ro/Desktop/DOCINTEL
unset GOOGLE_API_KEY  # Important if you have conflicting keys
python3 -m uvicorn backend.main:app --host 127.0.0.1 --port 9000
```

#### 4. Start Frontend (New Terminal)
```bash
cd /Users/ro/Desktop/DOCINTEL/frontend
npm install  # Only first time
npm run dev
```

#### 5. Open Browser
```
http://localhost:5173
```

---

## Troubleshooting

### Backend Won't Start
```bash
# Check if port is in use
lsof -i :9000

# Kill existing process
kill <PID>

# Or use different port
python3 -m uvicorn backend.main:app --port 9001
```

### API Key Not Working
```bash
# Make sure it's set
echo $GEMINI_API_KEY

# Unset conflicting keys
unset GOOGLE_API_KEY

# Restart backend
```

### Frontend Can't Connect to Backend
```bash
# Check backend is running
curl http://127.0.0.1:8000/health

# Update .env file
echo "VITE_BACKEND_URL=\"http://127.0.0.1:8000\"" > frontend/.env

# Restart frontend
```

### Gemini API Quota Exceeded
```bash
# Wait 50 seconds (rate limit cooldown)

# Or use different model (configured in answer_generator.py)
models_to_try = ['gemini-2.5-flash', 'gemini-2.0-flash', ...]
```

### Database Errors
```bash
# SQLite database is created automatically
# Location: /Users/ro/Desktop/DOCINTEL/docintel.db

# To reset database
rm /Users/ro/Desktop/DOCINTEL/docintel.db
# Restart backend - will create new empty database
```

---

## Environment Variables

### Frontend (.env)
```bash
VITE_BACKEND_URL="http://127.0.0.1:8000"
```

### Backend (export commands)
```bash
GEMINI_API_KEY="your-api-key-here"     # Required - Gemini AI
GOOGLE_API_KEY=""                       # Unset this
DATABASE_URL=""                        # Optional - uses SQLite if empty
```

---

## File Descriptions

### Frontend Files

| File | Purpose |
|------|---------|
| `Landing.tsx` | Homepage with hero, features, testimonials |
| `Search.tsx` | Main Q&A interface |
| `Login.tsx` | User login page |
| `Signup.tsx` | User registration |
| `History.tsx` | Past questions & answers |
| `Navbar.tsx` | Top navigation bar |
| `AuthContext.tsx` | User authentication state |
| `gemini.ts` | API communication layer |
| `index.css` | All CSS animations & styles |

### Backend Files

| File | Purpose |
|------|---------|
| `main.py` | FastAPI app, all routes |
| `answer_generator.py` | AI logic, scope detection, output cleaning |
| `database.py` | SQLite database connection |
| `models.py` | SQLAlchemy table definitions |
| `schemas.py` | Request/response validation |
| `auth.py` | Password hashing, JWT tokens |

---

## Supported Topics

DocIntel AI can answer questions about:

### Policies & Guidelines
- National Education Policy (NEP) 2020
- UGC regulations & guidelines
- AICTE approval processes
- Ministry of Education policies

### Academic Topics
- University admission criteria
- Examination systems
- Credit frameworks
- Research fellowships

### Exams & Tests
- UGC NET / UGC-NET
- CSIR NET / JRF
- SET / SLET
- JEE, NEET, CAT

### Institutions
- IITs, IIMs, NITs
- State & Central Universities
- Deemed Universities
- Private Colleges

### Schemes
- SWAYAM, DIKSHA
- PM e-Vidya
- National Scholarship Portal
- RUSA

---

## Future Improvements

- [ ] Deploy to cloud (Vercel + Railway/Render)
- [ ] Add user accounts with real database
- [ ] Add PDF export of answers
- [ ] Add share functionality
- [ ] Add feedback mechanism
- [ ] Cache common questions
- [ ] Add more education topics

---

## Deploy Publicly

### Option 1: Deploy to Render (Backend) + Vercel (Frontend)

#### Step 1: Deploy Backend to Render
1. Go to https://render.com
2. Sign up / Login with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repo
5. Configure:
   - **Name**: `docintel-backend`
   - **Region**: Singapore (closest to India)
   - **Branch**: `main`
   - **Root Directory**: (leave empty)
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
6. Add Environment Variable:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: Your Gemini API key
7. Click "Create Web Service"
8. Wait for deployment → Copy URL (e.g., `https://docintel-backend.onrender.com`)

#### Step 2: Deploy Frontend to Vercel
1. Go to https://vercel.com
2. Sign up / Login with GitHub
3. Click "Add New..." → "Project"
4. Import your GitHub repo
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add Environment Variable:
   - **Key**: `VITE_BACKEND_URL`
   - **Value**: Your Render backend URL (e.g., `https://docintel-backend.onrender.com`)
7. Click "Deploy"
8. Wait for deployment → Get your public URL (e.g., `https://docintel.vercel.app`)

#### Step 3: Update Backend CORS
In `backend/main.py`, update CORS for your Vercel domain:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://docintel.vercel.app"],  # Your Vercel URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

### Option 2: Quick Public Link (ngrok)

For temporary public access:

```bash
# 1. Start backend
cd /Users/ro/Desktop/DOCINTEL
GEMINI_API_KEY="..." python3 -m uvicorn backend.main:app --host 0.0.0.0 --port 9000

# 2. Download ngrok from https://ngrok.com/download

# 3. Start ngrok (in new terminal)
ngrok http 9000

# 4. Copy the https URL shown (e.g., https://abc123.ngrok.io)

# 5. Update frontend .env
echo "VITE_BACKEND_URL=\"https://abc123.ngrok.io\"" > frontend/.env

# 6. Start frontend
cd frontend && npm run dev

# 7. Share the localhost URL - anyone can access!
```

---

### Option 3: LocalTunnel (Free, No Signup)

```bash
# Install
npx localtunnel --port 9000

# Share the URL it gives you
```

---

## Free Tier Limits

| Service | Free Tier |
|---------|-----------|
| Vercel | 100GB bandwidth/month |
| Render | 750 hours/month (spins down after 15min inactivity) |
| Railway | $5 free credits/month |
| ngrok | 1 tunnel, 4 hour session |

---

## Contact & Support

For issues or questions:
1. Check this document first
2. Check API docs: http://127.0.0.1:8000/docs
3. Check backend logs: `cat /tmp/docintel-backend.log`
4. Check frontend logs: `cat /tmp/docintel-frontend.log`

---

*Last Updated: April 2026*
