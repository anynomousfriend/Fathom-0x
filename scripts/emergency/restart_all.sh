#!/bin/bash
# Emergency Restart Script - Use if everything is stuck

echo "🚨 EMERGENCY RESTART: Killing all processes..."
echo ""

# Kill all related processes
echo "Stopping frontend..."
pkill -f "next dev" 2>/dev/null
pkill -f "node.*next" 2>/dev/null

echo "Stopping oracle..."
pkill -f "oracle_node.py" 2>/dev/null
pkill -f "simple_rag_api.py" 2>/dev/null

echo "Stopping Python processes..."
pkill -f "python.*oracle" 2>/dev/null

echo ""
echo "⏳ Waiting 3 seconds for cleanup..."
sleep 3

echo ""
echo "🚀 Starting services..."
echo ""

# Start frontend
echo "📱 Starting frontend..."
cd frontend
rm -rf .next 2>/dev/null
npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "   Frontend PID: $FRONTEND_PID"
sleep 5

# Start oracle
echo "🤖 Starting oracle..."
cd ../oracle-node
source venv/bin/activate 2>/dev/null || source venv/Scripts/activate 2>/dev/null
python oracle_node.py > ../logs/oracle.log 2>&1 &
ORACLE_PID=$!
echo "   Oracle PID: $ORACLE_PID"
sleep 3

echo ""
echo "✅ All services restarted!"
echo ""
echo "📊 Status:"
echo "   Frontend: http://localhost:3000 (PID: $FRONTEND_PID)"
echo "   Oracle: Running (PID: $ORACLE_PID)"
echo ""
echo "📝 Logs:"
echo "   Frontend: tail -f logs/frontend.log"
echo "   Oracle: tail -f logs/oracle.log"
echo ""
echo "⏰ Wait 10 seconds before testing..."
