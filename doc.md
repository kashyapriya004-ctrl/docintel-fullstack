# DocIntel AI - Complete Documentation

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Architecture](#2-architecture)
3. [How It Works](#3-how-it-works)
4. [What Each Component Does](#4-what-each-component-does)
5. [Why This Design](#5-why-this-design)
6. [Alternative Options](#6-alternative-options)
7. [Configuration Guide](#7-configuration-guide)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Project Overview

**DocIntel AI** is a Policy Intelligence System for Indian Education that allows users to ask questions about UGC, AICTE, Ministry of Education policies in plain English and get instant answers from official government sources.

### Core Features
- Ask questions about Indian education policies in plain English
- Real-time AI-powered answers using Google Gemini
- User accounts with authentication
- Search history tracking
- Guest mode (3 free queries)
- Clean, animated UI

### Tech Stack
| Component | Technology |
|----------|-----------|
| Frontend | React + TypeScript + Tailwind CSS + Vite |
| Backend | FastAPI (Python) |
| AI | Google Gemini API |
| Database | SQLite |
| Auth | JWT tokens |

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                        │
│                  http://localhost:5174                        │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Search   │  │    Login   │  │  Signup    │    │
│  │    Page   │  │    Page   │  │    Page   │    │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘    │
│        │                │                │              │
│        └────────────────┼────────────────┘              │
│                         ▼                             │
│              ┌──────────────────────┐                 │
│              │  AuthContext.tsx    │                 │
│              │  gemini.ts service  │                 │
│              └─────────┬──────────┘                 │
└────────────────────────┼────────────────────────────────┘
                         │ HTTP POST/GET
                         │ (fetch API)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      Backend (FastAPI)                      │
│                  http://localhost:8000                        │
│                                                              │
│  ┌─────────────────────────────────────────────────┐      │
│  │              API Endpoints                   │      │
│  │  POST /api/register    POST /api/login      │      │
│  │  POST /api/ask       GET  /api/history   │      │
│  └─────────────────────┬───────────────────┘      │
│                      │                                  │
│          ┌───────────┴───────────┐                   │
│          ▼                   ▼                   │
│  ┌──────────────┐    ┌──────────────┐              │
│  │  Auth API  │    │ Answer Gen │              │
│  │ (JWT/Pass)│    │ (Gemini)  │              │
│  └─────┬──────┘    └─────┬──────┘              │
│        │                   │                      │
│        └─────────┬─────────┘                      │
│                 ▼                               │
│         ┌──────────────┐                        │
│         │  SQLite   │                        │
│         │ Database  │                        │
│         └──────────┘                        │
└─────────────────────────────────────────────────┘
```

---

## 3. How It Works

### 3.1 User Registration Flow
```
1. User submits signup form → /api/register
2. Backend validates email format
3. Backend checks if email exists
4. Password hashed with PBKDF2 (100k iterations)
5. User record created in SQLite
6. Returns success + user_id
7. Frontend auto-login user
```

### 3.2 User Login Flow
```
1. User submits login form → /api/login
2. Backend finds user by email
3. Verifies password hash
4. Creates JWT token (60 min expiry)
5. Returns token + user profile
6. Frontend stores in localStorage
```

### 3.3 Ask Question Flow
```
1. User types question → /api/ask
2. Backend validates (min 3 chars)
3. Check if education-related (keyword list)
4. If NOT education → return redirect message
5. If YES → call Google Gemini API
6. Gemini generates answer
7. Save to SearchHistory (if logged in)
8. Return answer + sources
9. Frontend displays result
```

### 3.4 Guest Mode Flow
```
1. Anonymous user visits
2. Session tracks query count
3. Max 3 queries allowed
4. After 3 → show limit modal
5. Prompt to login for more
```

---

## 4. What Each Component Does

### Backend Files

| File | Purpose |
|------|--------|
| `main.py` | FastAPI app, all API endpoints, CORS config |
| `models.py` | SQLAlchemy User & SearchHistory tables |
| `database.py` | SQLite connection setup |
| `schemas.py` | Pydantic validation models |
| `auth.py` | Password hashing (PBKDF2), JWT tokens |
| `answer_generator.py` | Gemini AI integration |
| `policy_fetcher.py` | (Not actively used) |

### Frontend Files

| File | Purpose |
|------|--------|
| `App.tsx` | Main router + layout |
| `pages/Search.tsx` | Main search page |
| `pages/Login.tsx` | Login form |
| `pages/Signup.tsx` | Registration form |
| `pages/History.tsx` | User search history |
| `pages/Account.tsx` | Profile settings |
| `contexts/AuthContext.tsx` | Auth state management |
| `services/gemini.ts` | Backend API calls |
| `.env` | Backend URL config |

---

## 5. Why This Design

### 5.1 Why FastAPI?
- Fast (async by default)
- Auto docs at `/docs`
- Easy validation with Pydantic
- Native OpenAPI support

### 5.2 Why SQLite?
- No setup required
- File-based, easy to backup
- Good for single-user/small scale
- Works in production with proper config

### 5.3 Why Gemini AI?
- Google's latest model
- Good reasoning
- Cost-effective (flash model)
- 1000+ free requests/day

### 5.4 Why JWT Auth?
- Stateless
- No server session storage
- Scalable
- Standard industry practice

### 5.5 Why CORS?
- Required for browser to allow frontend → backend requests
- Without CORS → "CORS policy blocked" error
- Must list specific origins when using credentials

---

## 6. Alternative Options

### 6.1 Backend Framework Alternatives
| Option | Pros | Cons |
|--------|-----|-----|
| Django | Full-featured, ORM | Heavy, complex |
| Flask | Lightweight | More setup needed |
| Express.js | JS everywhere | Need different language |

### 6.2 Database Alternatives
| Option | Pros | Cons |
|--------|-----|-----|
| PostgreSQL | Production-grade | Setup required |
| MongoDB | Flexible schema | Different query syntax |
| Firebase | Serverless | Vendor lock-in |

### 6.3 AI Alternatives
| Option | Pros | Cons |
|--------|-----|-----|
| OpenAI GPT | Most capable | More expensive |
| Claude | Good reasoning | Less free tier |
| Ollama | Local, private | Needs powerful GPU |

### 6.4 Auth Alternatives
| Option | Pros | Cons |
|--------|-----|-----|
| OAuth (Google) | No password storage | More complex |
| NextAuth | Full-featured | React-specific |

---

## 7. Configuration Guide

### 7.1 Port Configuration

| Service | Default Port | Config File |
|---------|------------|-----------|
| Frontend | 5174 | `frontend/vite.config.ts` |
| Backend | 8000 | `backend/main.py` |
| Database | - | `backend/database.py` |

### 7.2 Environment Variables

| Variable | Where Set | Purpose |
|----------|----------|---------|
| `VITE_BACKEND_URL` | `frontend/.env` | Frontend → Backend URL |
| `GEMINI_API_KEY` | `.env` or system | Google AI API |
| `PORT` | system/env | Backend port |
| `DATABASE_URL` | system/env | Database connection |

### 7.3 Starting the Project

```bash
# Method 1: Manual
# Terminal 1 - Backend
cd backend
export GEMINI_API_KEY="your-key"
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000

# Terminal 2 - Frontend
cd frontend
npm run dev

# Method 2: Startup script
chmod +x startup.sh
./startup.sh
```

### 7.4 URLs

| Service | URL |
|--------|-----|
| Frontend | http://127.0.0.1:5174 |
| Backend API | http://127.0.0.1:8000 |
| API Docs | http://127.0.0.1:8000/docs |

---

## 8. Troubleshooting

### 8.1 Common Issues

| Issue | Cause | Solution |
|-------|-------|---------|
| "CORS blocked" | Backend CORS not configured | Add origin to CORS in main.py |
| "Cannot connect to server" | Wrong URL/port | Check VITE_BACKEND_URL |
| "Port in use" | Old process | Kill with `lsof -ti:PORT` |
| "API key error" | Wrong/missing key | Set GEMINI_API_KEY |

### 8.2 Port Fix Commands

```bash
# Kill process on port
lsof -ti:8000 | xargs kill
lsof -ti:5174 | xargs kill

# Find what's using port
lsof -i :8000
```

### 8.3 Log Locations

```bash
# Backend logs
tail -f /tmp/docintel-backend.log

# Frontend logs
tail -f /tmp/frontend.log

# System logs
tail -f /tmp/docintel-backend.log
tail -f /tmp/docintel-frontend.log
```

---

## 9. API Reference

### Endpoints

| Method | Endpoint | Description | Body |
|--------|----------|------------|------|
| POST | `/api/register` | Create account | `{email, password, full_name, role, institution}` |
| POST | `/api/login` | Login | `{email, password}` |
| POST | `/api/ask` | Ask question | `{question, user_id?}` |
| GET | `/api/history?user_id=N` | Get history | - |
| DELETE | `/api/history/{id}?user_id=N` | Delete history | - |
| GET | `/health` | Health check | - |

### Response Formats

#### Register
```json
{"message": "User registered successfully", "user_id": 1}
```

#### Login
```json
{"access_token": "eyJ...", "user": {"id": 1, "email": "...", "full_name": "..."}}
```

#### Ask
```json
{"question": "...", "answer": "...", "sources": ["https://..."]}
```

---

## 10. File Structure

```
DOCINTEL/
├── backend/
│   ├── main.py           # FastAPI app + routes
│   ├── models.py        # SQLAlchemy models
│   ├── database.py      # DB connection
│   ├── schemas.py      # Pydantic models
│   ├── auth.py        # Auth functions
│   ├── answer_generator.py  # Gemini AI
│   └── venv/          # Virtual env
├── frontend/
│   ├── src/
│   │   ├── pages/     # React pages
│   │   ├── components/ # UI components
│   │   ├── contexts/  # State management
│   │   ├── services/  # API calls
│   │   └── ...
│   ├── package.json
│   ├── vite.config.ts
│   └── .env
├── data/
│   └── policies/       # PDF policies
├── docintel.db       # SQLite database
├── requirements.txt
├── startup.sh       # Start script
└── README.md
```

---

*Last Updated: April 2026*