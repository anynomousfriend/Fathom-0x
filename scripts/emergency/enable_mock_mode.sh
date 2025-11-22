#!/bin/bash
# Enable Mock Mode - Instant oracle responses

echo "🎭 ENABLING MOCK MODE..."
echo ""

# Kill current oracle
echo "Stopping current oracle..."
pkill -f "oracle_node.py" 2>/dev/null
sleep 2

# Check if mock responses file exists
if [ ! -f "oracle-node/mock_responses.json" ]; then
    echo "[NOTE] Creating mock_responses.json..."
    cat > oracle-node/mock_responses.json << 'EOF'
{
  "What was the Q3 revenue?": {
    "answer": "Based on the Q3 financial report, the revenue was $1.2 million, representing a 15% increase from Q2. Expenses totaled $800K, resulting in a net profit of $400K.",
    "processing_time": 2.5
  },
  "What medications is the patient taking?": {
    "answer": "According to the patient record, the patient is currently taking: 1) Lisinopril 10mg daily for hypertension, 2) Metformin 500mg twice daily for diabetes management, and 3) Atorvastatin 20mg daily for cholesterol control.",
    "processing_time": 3.0
  },
  "What are the key findings?": {
    "answer": "The research paper presents three key findings: 1) The proposed method achieves 95% accuracy on benchmark datasets, 2) Processing time is reduced by 40% compared to baseline approaches, and 3) The technique is scalable to large datasets with minimal performance degradation.",
    "processing_time": 2.8
  },
  "Summarize the document": {
    "answer": "This document provides a comprehensive overview of the subject matter, presenting key data points, analysis, and conclusions. The main findings demonstrate significant progress and validate the proposed approach.",
    "processing_time": 2.0
  }
}
EOF
fi

# Start oracle with mock mode
echo "[ORACLE] Starting oracle in MOCK MODE..."
cd oracle-node
source venv/bin/activate 2>/dev/null || source venv/Scripts/activate 2>/dev/null

export MOCK_MODE=true
export MOCK_RESPONSE_FILE=./mock_responses.json

python oracle_node.py > ../logs/oracle_mock.log 2>&1 &
ORACLE_PID=$!

echo ""
echo "[OK] Mock mode enabled!"
echo ""
echo "[STATUS] Status:"
echo "   Oracle PID: $ORACLE_PID"
echo "   Mode: MOCK (instant responses)"
echo ""
echo "[NOTE] Mock responses available for:"
echo "   - What was the Q3 revenue?"
echo "   - What medications is the patient taking?"
echo "   - What are the key findings?"
echo "   - Summarize the document"
echo ""
echo "[NOTE] Logs: tail -f logs/oracle_mock.log"
echo ""
echo "⚡ Queries will now return INSTANT responses!"
