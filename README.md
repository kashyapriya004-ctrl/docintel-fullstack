# DocIntel AI

Policy Intelligence System for Indian Education - Search and get answers from UGC, AICTE, and Ministry of Education policies.

## Quick Start

### 1. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Set your Gemini API key
export GEMINI_API_KEY="your-api-key-here"  # On Windows: set GEMINI_API_KEY=your-api-key

# Start backend
python -m uvicorn backend.main:app --reload --port 8000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 3. Open in Browser

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## Or Use the Startup Script

```bash
chmod +x startup.sh
./startup.sh
```

## Features

- Ask questions about education policies in plain English
- Real-time answers from official government sources
- UGC, AICTE, and Ministry of Education data
- Guest mode (3 free queries)
- User accounts with search history
- Beautiful animated UI

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS + Vite
- **Backend**: FastAPI + Python
- **AI**: Google Gemini
- **Data**: Live policy scraping from government websites
