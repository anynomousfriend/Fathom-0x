#!/bin/bash

clear

cat << 'BANNER'
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║              [FATHOM] FATHOM PROTOCOL - FULL SYSTEM [FATHOM]              ║
║                                                               ║
║         Privacy-Preserving RAG on Sui + Walrus               ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝

BANNER

echo ""
echo "[START] Starting Fathom Protocol Full Stack..."
echo ""
echo "This will start all components:"
echo "  1. [OK] RAG API (Backend)"
echo "  2. [OK] Oracle Node (Blockchain listener)"
echo "  3. [OK] Frontend (Next.js)"
echo ""
read -p "Press Enter to continue or Ctrl+C to cancel..."
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down all services..."
    pkill -f simple_rag_api.py 2>/dev/null
    pkill -f oracle_node.py 2>/dev/null
    pkill -f "next dev" 2>/dev/null
    pkill -f "node.*next-server" 2>/dev/null
    echo "[OK] All services stopped"
    exit 0
}

trap cleanup SIGINT SIGTERM

# Kill any existing processes
echo "🧹 Cleaning up any running processes..."
pkill -f simple_rag_api.py 2>/dev/null
pkill -f oracle_node.py 2>/dev/null
pkill -f "next dev" 2>/dev/null
pkill -f "node.*next-server" 2>/dev/null
sleep 2

# Start RAG API
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1️⃣ Starting RAG API Backend..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cd oracle-node
./venv/bin/python simple_rag_api.py > ../logs/rag_api.log 2>&1 &
RAG_PID=$!
cd ..
sleep 3

# Check if RAG API started successfully
if curl -s http://localhost:5000/health > /dev/null 2>&1; then
    echo "[OK] RAG API running on http://localhost:5000 (PID: $RAG_PID)"
else
    echo "[ERROR] Failed to start RAG API"
    cat logs/rag_api.log
    exit 1
fi

# Start Oracle Node (optional - comment out if not needed)
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2️⃣ Starting Oracle Node..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cd oracle-node
./venv/bin/python oracle_node.py > ../logs/oracle.log 2>&1 &
ORACLE_PID=$!
cd ..
sleep 2
echo "[OK] Oracle Node running (PID: $ORACLE_PID)"

# Start Frontend
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3️⃣ Starting Frontend..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Clear Next.js cache
rm -rf .next

# Start Next.js dev server
npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo ""
echo "⏳ Waiting for frontend to start..."
sleep 8

# Check if frontend started
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "[OK] Frontend running on http://localhost:3000 (PID: $FRONTEND_PID)"
else
    echo "[WARNING]  Frontend may still be starting..."
fi

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                    [SUCCESS] SYSTEM READY! [SUCCESS]                        ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
echo " Service URLs:"
echo "   • Frontend:  http://localhost:3000"
echo "   • RAG API:   http://localhost:5000"
echo "   • Oracle:    Background process"
echo ""
echo "[STATUS] Process IDs:"
echo "   • RAG API:   $RAG_PID"
echo "   • Oracle:    $ORACLE_PID"
echo "   • Frontend:  $FRONTEND_PID"
echo ""
echo "[NOTE] Logs:"
echo "   • RAG API:   logs/rag_api.log"
echo "   • Oracle:    logs/oracle.log"
echo "   • Frontend:  logs/frontend.log"
echo ""
echo "🛑 To stop all services: Press Ctrl+C"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Keep script running
echo "[TIP] System is running. Monitor logs with:"
echo "   tail -f logs/rag_api.log"
echo "   tail -f logs/oracle.log"
echo "   tail -f logs/frontend.log"
echo ""

# Wait indefinitely
while true; do
    sleep 10
    # Check if services are still running
    if ! ps -p $RAG_PID > /dev/null 2>&1; then
        echo "[WARNING]  RAG API stopped unexpectedly!"
    fi
    if ! ps -p $FRONTEND_PID > /dev/null 2>&1; then
        echo "[WARNING]  Frontend stopped unexpectedly!"
    fi
done
