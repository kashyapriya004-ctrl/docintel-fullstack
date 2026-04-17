#!/bin/bash

echo "=========================================="
echo "  DocIntel AI - Deploy to Public"
echo "=========================================="
echo ""
echo "Choose deployment option:"
echo ""
echo "1. Quick Deploy - Render (Backend) + Vercel (Frontend)"
echo "2. Temporary Link - ngrok (works now)"
echo "3. Exit"
echo ""

read -p "Enter choice (1/2/3): " choice

case $choice in
  1)
    echo ""
    echo "DEPLOYMENT STEPS:"
    echo ""
    echo "1. DEPLOY BACKEND TO RENDER:"
    echo "   → Go to: https://render.com"
    echo "   → Connect GitHub repo"
    echo "   → Create Web Service"
    echo "   → Set Build Command: pip install -r requirements.txt"
    echo "   → Set Start Command: uvicorn backend.main:app --host 0.0.0.0 --port \$PORT"
    echo "   → Add Environment Variable: GEMINI_API_KEY=your-key"
    echo "   → Copy the deployed URL (e.g., https://docintel.onrender.com)"
    echo ""
    echo "2. UPDATE BACKEND CORS (backend/main.py):"
    echo '   allow_origins=["https://your-vercel-url.vercel.app"]'
    echo ""
    echo "3. DEPLOY FRONTEND TO VERCEL:"
    echo "   → Go to: https://vercel.com"
    echo "   → Import GitHub repo"
    echo "   → Add env var: VITE_BACKEND_URL=https://docintel.onrender.com"
    echo "   → Deploy!"
    echo ""
    ;;
  2)
    echo ""
    echo "Starting ngrok for quick public access..."
    echo ""
    
    # Check if ngrok is installed
    if ! command -v ngrok &> /dev/null; then
        echo "ngrok not found. Installing..."
        brew install ngrok  # macOS
    fi
    
    # Start backend in background
    echo "Starting backend..."
    cd /Users/ro/Desktop/DOCINTEL
    export GEMINI_API_KEY="AIzaSyBBWw96iCm4WZYhz_DCfaDUDkFNqjjnhDk"
    unset GOOGLE_API_KEY
    nohup python3 -m uvicorn backend.main:app --host 0.0.0.0 --port 9000 > /tmp/docintel-backend.log 2>&1 &
    
    sleep 3
    
    echo "Starting ngrok..."
    ngrok http 9000
    
    echo ""
    echo "Copy the 'Forwarding' HTTPS URL"
    echo "Then update frontend .env with that URL"
    ;;
  3)
    echo "Exiting..."
    exit 0
    ;;
  *)
    echo "Invalid choice"
    exit 1
    ;;
esac
