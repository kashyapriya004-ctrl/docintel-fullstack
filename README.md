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

## Azure Deployment

### Backend Deployment

1. Create Azure App Service (Python)
2. Add App Settings:
   - `GEMINI_API_KEY` = your Gemini API key
   - `PORT` = `8000`
3. Connect GitHub repo in Deployment Center
4. Code pushes to main will auto-deploy

### Frontend Deployment

1. Build the frontend: `cd frontend && npm run build`
2. Deploy the `dist/` folder to Azure Static Web Apps or Vercel
3. Update `VITE_BACKEND_URL` in `.env` to point to your Azure backend URL

## Features

- Ask questions about education policies in plain English
- Real-time answers from official government sources
- UGC, AICTE, and Ministry of Education data
- Guest mode (3 free queries)
- User accounts with search history
- Beautiful animated UI
- Account management with profile settings

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS + Vite
- **Backend**: FastAPI + Python
- **AI**: Google Gemini
- **Data**: Expert knowledge mode (no scraping)