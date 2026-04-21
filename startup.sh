#!/bin/bash

# DocIntel AI - Startup Script
# Run: ./startup.sh

# Fixed ports
BACKEND_PORT=8000
FRONTEND_PORT=5174

# Kill any existing instances on our fixed ports
lsof -ti:$BACKEND_PORT | xargs kill 2>/dev/null
lsof -ti:$FRONTEND_PORT | xargs kill 2>/dev/null
lsof -ti:5173 | xargs kill 2>/dev/null
lsof -ti:5175 | xargs kill 2>/dev/null

echo "Starting DocIntel AI..."

# Load Gemini API key from .env file
source /Users/ro/Desktop/DOCINTEL/.env
export GEMINI_API_KEY

# Unset conflicting key if present
unset GOOGLE_API_KEY

cd /Users/ro/Desktop/DOCINTEL

# Start backend on FIXED port 8000
echo "Starting backend on http://127.0.0.1:$BACKEND_PORT ..."
nohup python3 -m uvicorn backend.main:app --host 0.0.0.0 --port $BACKEND_PORT > /tmp/docintel-backend.log 2>&1 &

# Wait for backend to start
sleep 3

# Verify backend is running
if lsof -i:$BACKEND_PORT > /dev/null 2>&1; then
    echo "✓ Backend running on port $BACKEND_PORT"
else
    echo "✗ Backend failed to start on port $BACKEND_PORT"
    exit 1
fi

# Start frontend on FIXED port 5174
echo "Starting frontend on http://localhost:$FRONTEND_PORT ..."
cd /Users/ro/Desktop/DOCINTEL/frontend
nohup npm run dev -- --port $FRONTEND_PORT > /tmp/docintel-frontend.log 2>&1 &

sleep 4

# Verify frontend is running
if lsof -i:$FRONTEND_PORT > /dev/null 2>&1; then
    echo "✓ Frontend running on port $FRONTEND_PORT"
else
    echo "✗ Frontend failed to start on port $FRONTEND_PORT"
    exit 1
fi

# Test backend connection
echo "Testing backend connection..."
if curl -s http://127.0.0.1:$BACKEND_PORT/ > /dev/null 2>&1; then
    echo "✓ Backend responding"
else
    echo "✗ Backend not responding"
fi

echo ""
echo "=================================="
echo "  DocIntel AI is running!"
echo "=================================="
echo "  Frontend: http://localhost:$FRONTEND_PORT"
echo "  Backend:  http://127.0.0.1:$BACKEND_PORT"
echo "  API Docs: http://127.0.0.1:$BACKEND_PORT/docs"
echo "=================================="
echo ""
echo "Access: http://localhost:$FRONTEND_PORT"
echo ""
echo "To stop:"
echo "  lsof -ti:$BACKEND_PORT | xargs kill    # stop backend"
echo "  lsof -ti:$FRONTEND_PORT | xargs kill  # stop frontend"