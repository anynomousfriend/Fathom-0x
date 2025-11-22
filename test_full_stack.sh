#!/bin/bash

echo "[TEST] Full Stack System Test"
echo "=========================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test results
PASS=0
FAIL=0

test_pass() {
    echo -e "${GREEN}[OK] $1${NC}"
    ((PASS++))
}

test_fail() {
    echo -e "${RED}[ERROR] $1${NC}"
    ((FAIL++))
}

test_warn() {
    echo -e "${YELLOW}[WARNING]  $1${NC}"
}

# Test 1: Python Environment
echo "1️⃣ Testing Python Environment..."
if cd oracle-node && ./venv/bin/python -c "import pysui; print('pysui version:', pysui.__version__)" 2>/dev/null; then
    test_pass "Python environment configured"
else
    test_fail "Python environment missing dependencies"
fi
cd .. 2>/dev/null

echo ""

# Test 2: RAG API Import
echo "2️⃣ Testing RAG API..."
if cd oracle-node && ./venv/bin/python -c "from simple_rag_api import app; print('RAG API ready')" 2>/dev/null; then
    test_pass "RAG API imports successfully"
else
    test_fail "RAG API has import errors"
fi
cd .. 2>/dev/null

echo ""

# Test 3: Oracle Node
echo "3️⃣ Testing Oracle Node..."
if cd oracle-node && ./venv/bin/python -c "from oracle_node import FathomOracle; print('Oracle ready')" 2>/dev/null; then
    test_pass "Oracle Node imports successfully"
else
    test_fail "Oracle Node has import errors"
fi
cd .. 2>/dev/null

echo ""

# Test 4: Frontend Dependencies
echo "4️⃣ Testing Frontend..."
if [ -d "frontend/node_modules" ]; then
    test_pass "Frontend dependencies installed"
    if cd frontend && npm run build > /dev/null 2>&1; then
        test_pass "Frontend builds successfully"
    else
        test_fail "Frontend build fails"
    fi
    cd .. 2>/dev/null
else
    test_fail "Frontend dependencies not installed"
fi

echo ""

# Test 5: Smart Contract Deployment
echo "5️⃣ Testing Smart Contract Configuration..."
if [ -f "deployed_addresses.json" ]; then
    test_pass "Contract deployment info found"
    PACKAGE_ID=$(grep -o '"packageId": *"[^"]*"' deployed_addresses.json | cut -d'"' -f4)
    if [ ! -z "$PACKAGE_ID" ]; then
        test_pass "Package ID: ${PACKAGE_ID:0:20}..."
    fi
else
    test_fail "Deployment info missing"
fi

echo ""

# Test 6: Environment Configuration
echo "6️⃣ Testing Environment Configuration..."
if [ -f "oracle-node/.env" ]; then
    test_pass ".env file exists"
    if grep -q "CONTRACT_PACKAGE_ID=0x" oracle-node/.env; then
        test_pass "Contract addresses configured"
    else
        test_warn "Contract addresses may not be configured"
    fi
    if grep -q "ORACLE_PRIVATE_KEY=suiprivkey" oracle-node/.env; then
        test_pass "Oracle private key configured"
    else
        test_warn "Oracle private key not configured"
    fi
else
    test_fail ".env file missing"
fi

echo ""

# Test 7: Startup Script
echo "7️⃣ Testing Startup Script..."
if [ -f "START_FULL_SYSTEM.sh" ] && [ -x "START_FULL_SYSTEM.sh" ]; then
    test_pass "Startup script ready"
else
    test_fail "Startup script missing or not executable"
fi

echo ""

# Test 8: Documentation
echo "8️⃣ Testing Documentation..."
if [ -f "DEMO_DAY_PRESENTATION.md" ]; then
    test_pass "Demo presentation guide created"
else
    test_warn "Demo presentation guide missing"
fi

if [ -f "QUICK_START.md" ]; then
    test_pass "Quick start guide created"
else
    test_warn "Quick start guide missing"
fi

echo ""
echo "=========================="
echo "[STATUS] Test Results"
echo "=========================="
echo -e "${GREEN}Passed: $PASS${NC}"
echo -e "${RED}Failed: $FAIL${NC}"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}[SUCCESS] All tests passed! System ready for demo!${NC}"
    echo ""
    echo "[START] To start the system:"
    echo "   ./START_FULL_SYSTEM.sh"
    echo ""
    echo "📚 Documentation:"
    echo "   DEMO_DAY_PRESENTATION.md - Complete presentation guide"
    echo "   QUICK_START.md - Quick reference"
    exit 0
else
    echo -e "${RED}[WARNING]  Some tests failed. Please fix issues before demo.${NC}"
    exit 1
fi
