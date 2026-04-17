#!/bin/bash

# DocIntel AI - Startup Script
# Run: ./startup.sh

# Kill any existing instances
lsof -ti:9000 | xargs kill 2>/dev/null
lsof -ti:5173 | xargs kill 2>/dev/null
lsof -ti:5174 | xargs kill 2>/dev/null

echo "Starting DocIntel AI..."

# Set your Gemini API key here (or export GEMINI_API_KEY before running)
export GEMINI_API_KEY="AIzaSyBBWw96iCm4WZYhz_DCfaDUDkFNqjjnhDk"

# Unset conflicting key if present
unset GOOGLE_API_KEY

cd /Users/ro/Desktop/DOCINTEL

# Start backend
echo "Starting backend on http://127.0.0.1:9000 ..."
nohup python3 -m uvicorn backend.main:app --host 127.0.0.1 --port 9000 > /tmp/docintel-backend.log 2>&1 &

# Wait for backend to start
sleep 3

# Start frontend
echo "Starting frontend on http://localhost:5173 ..."
cd /Users/ro/Desktop/DOCINTEL/frontend
nohup npm run dev > /tmp/docintel-frontend.log 2>&1 &

sleep 3

echo ""
echo "=================================="
echo "  DocIntel AI is running!"
echo "=================================="
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://127.0.0.1:9000"
echo "  API Docs: http://127.0.0.1:9000/docs"
echo "=================================="
echo ""
echo "Press Ctrl+C to stop all services"
echo "Or run: lsof -ti:9000 | xargs kill  # to stop backend"
echo "     : lsof -ti:5173 | xargs kill    # to stop frontend"
