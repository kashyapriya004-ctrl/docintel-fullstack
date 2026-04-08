#!/bin/bash
set -e

echo "🚀 Starting DocIntel..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# Check if backend venv exists and activate it
if [ -d "venv/bin" ]; then
    echo -e "${YELLOW}Activating Python virtual environment...${NC}"
    source venv/bin/activate
    
    # Check if required packages are installed
    if ! python -c "import fastapi" 2>/dev/null; then
        echo -e "${YELLOW}Installing backend dependencies...${NC}"
        pip install -r requirements.txt -q
    fi
    
    echo -e "${GREEN}Starting FastAPI backend on http://localhost:8000${NC}"
    python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 &
    BACKEND_PID=$!
else
    echo -e "${YELLOW}Backend venv not found, skipping backend startup${NC}"
fi

# Start frontend
if [ -d "frontend" ]; then
    cd frontend
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}Installing frontend dependencies...${NC}"
        npm install -q
    fi
    
    echo -e "${GREEN}Starting React frontend on http://localhost:5173${NC}"
    npm run dev &
    FRONTEND_PID=$!
else
    echo -e "${YELLOW}Frontend directory not found${NC}"
fi

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  DocIntel is running!${NC}"
echo -e "${GREEN}  Frontend: http://localhost:5173${NC}"
echo -e "${GREEN}  Backend:  http://localhost:8000${NC}"
echo -e "${GREEN}  API Docs: http://localhost:8000/docs${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for any process to exit
wait
