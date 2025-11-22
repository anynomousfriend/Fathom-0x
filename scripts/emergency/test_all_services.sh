#!/bin/bash
# Test All Services - Run 1 hour before demo

echo "[TEST] PRE-DEMO SERVICE TESTS"
echo "========================="
echo ""
date
echo ""

FAILED=0

# Test 1: Walrus HTTP Upload
echo "1️⃣  Testing Walrus HTTP upload..."
echo "   Creating test file..."
echo "Test content $(date)" > /tmp/test_walrus.txt

if curl -X PUT https://aggregator.walrus-testnet.walrus.space/v1/store \
    --data-binary @/tmp/test_walrus.txt \
    -H "Content-Type: application/octet-stream" \
    -s -o /tmp/walrus_response.json -w "%{http_code}" | grep -q "200"; then
    echo "   [OK] Walrus HTTP OK"
else
    echo "   [ERROR] Walrus HTTP FAILED"
    FAILED=$((FAILED + 1))
fi
echo ""

# Test 2: Walrus CLI
echo "2️⃣  Testing Walrus CLI..."
if command -v walrus &> /dev/null; then
    if walrus store /tmp/test_walrus.txt --epochs 1 > /tmp/walrus_cli.log 2>&1; then
        echo "   [OK] Walrus CLI OK"
    else
        echo "   [ERROR] Walrus CLI FAILED"
        echo "   Check: cat /tmp/walrus_cli.log"
        FAILED=$((FAILED + 1))
    fi
else
    echo "   [ERROR] Walrus CLI NOT INSTALLED"
    FAILED=$((FAILED + 1))
fi
echo ""

# Test 3: Sui RPC
echo "3️⃣  Testing Sui RPC..."
if curl -s https://fullnode.testnet.sui.io:443 -I | grep -q "200"; then
    echo "   [OK] Sui RPC OK"
else
    echo "   [ERROR] Sui RPC FAILED"
    FAILED=$((FAILED + 1))
fi
echo ""

# Test 4: Oracle Process
echo "4️⃣  Testing Oracle..."
if ps aux | grep -v grep | grep -q "oracle_node.py"; then
    ORACLE_PID=$(ps aux | grep -v grep | grep "oracle_node.py" | awk '{print $2}' | head -1)
    echo "   [OK] Oracle running (PID: $ORACLE_PID)"
else
    echo "   [ERROR] Oracle NOT running"
    echo "   Start with: cd oracle-node && python oracle_node.py &"
    FAILED=$((FAILED + 1))
fi
echo ""

# Test 5: Frontend
echo "5️⃣  Testing Frontend..."
if curl -s http://localhost:3000 -I | grep -q "200"; then
    echo "   [OK] Frontend OK (http://localhost:3000)"
else
    echo "   [ERROR] Frontend NOT accessible"
    echo "   Start with: cd frontend && npm run dev &"
    FAILED=$((FAILED + 1))
fi
echo ""

# Test 6: Wallet Balance
echo "6️⃣  Testing Wallet (Sui CLI)..."
if command -v sui &> /dev/null; then
    BALANCE=$(sui client gas --json 2>/dev/null | grep -o '"balance":[0-9]*' | head -1 | cut -d':' -f2)
    if [ -n "$BALANCE" ] && [ "$BALANCE" -gt 0 ]; then
        BALANCE_SUI=$(echo "scale=4; $BALANCE / 1000000000" | bc)
        echo "   [OK] Wallet OK (~$BALANCE_SUI SUI)"
    else
        echo "   [WARNING]  Low/No balance - get testnet SUI from faucet"
        FAILED=$((FAILED + 1))
    fi
else
    echo "   [ERROR] Sui CLI NOT INSTALLED"
    FAILED=$((FAILED + 1))
fi
echo ""

# Test 7: Required Files
echo "7️⃣  Testing Demo Files..."
DEMO_FILES=(
    "_demo_files/demo-data/financial_report.txt"
    "_demo_files/demo-data/patient_record.txt"
    "_demo_files/demo-data/research_paper.txt"
    "_demo_files/demo-data/test_document.txt"
)

for file in "${DEMO_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "   [OK] $file"
    else
        echo "   [ERROR] Missing: $file"
        FAILED=$((FAILED + 1))
    fi
done
echo ""

# Summary
echo "================================"
echo "[TARGET] TEST SUMMARY"
echo "================================"
echo ""

if [ $FAILED -eq 0 ]; then
    echo "[OK] ALL TESTS PASSED!"
    echo ""
    echo "[START] You're ready for the demo!"
    echo ""
    echo "[INFO] Pre-Demo Checklist:"
    echo "   1. Pre-upload documents to Walrus (save blob IDs)"
    echo "   2. Create mock_responses.json"
    echo "   3. Record backup demo video"
    echo "   4. Print DEMO_DAY_CHECKLIST.md"
    echo ""
else
    echo "[ERROR] $FAILED TEST(S) FAILED"
    echo ""
    echo "[INSTALL] Check these issues before demo:"
    echo "   - Review failed tests above"
    echo "   - See docs/DEMO_BACKUP_PLANS.md for solutions"
    echo "   - Have backup plans ready"
    echo ""
fi

# Cleanup
rm -f /tmp/test_walrus.txt /tmp/walrus_response.json /tmp/walrus_cli.log

exit $FAILED
