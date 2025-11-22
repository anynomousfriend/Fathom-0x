#!/bin/bash
# Quick test script to verify all demo components work

echo "[TEST] Testing Fathom-0x Demo Components"
echo "======================================"
echo ""

# Test 1: TEE Demo
echo "1️⃣ Testing TEE Visual Demo..."
if ./START_TEE_DEMO.sh > /dev/null 2>&1; then
    echo "   [OK] TEE demo works!"
else
    echo "   [ERROR] TEE demo failed"
fi

echo ""

# Test 2: Check if frontend dependencies exist
echo "2️⃣ Checking Frontend..."
if [ -d "frontend/node_modules" ]; then
    echo "   [OK] Frontend dependencies installed"
else
    echo "   [WARNING]  Frontend dependencies not installed (run: cd frontend && npm install)"
fi

echo ""

# Test 3: Check backend files
echo "3️⃣ Checking Backend..."
if [ -f "oracle-node/simple_rag_api.py" ]; then
    echo "   [OK] RAG API exists"
else
    echo "   [ERROR] RAG API not found"
fi

if [ -f "oracle-node/mock_oracle.py" ]; then
    echo "   [OK] Mock oracle exists"
else
    echo "   [ERROR] Mock oracle not found"
fi

echo ""

# Test 4: Check Python dependencies
echo "4️⃣ Checking Python Environment..."
if command -v python3 &> /dev/null; then
    echo "   [OK] Python 3 installed"
    python3 --version
else
    echo "   [ERROR] Python 3 not found"
fi

echo ""

# Test 5: Documentation
echo "5️⃣ Checking Documentation..."
docs=("docs/TEE_DEMO_GUIDE.md" "docs/TEE_QUICK_START.md" "TEE_DEMO_README.md")
for doc in "${docs[@]}"; do
    if [ -f "$doc" ]; then
        echo "   [OK] $doc"
    else
        echo "   [ERROR] $doc missing"
    fi
done

echo ""
echo "======================================"
echo "[TARGET] Quick Start Commands:"
echo ""
echo "  Visual Demo:    ./START_TEE_DEMO.sh"
echo "  Interactive:    ./START_TEE_DEMO.sh --live"
echo "  Full Stack:     See TEE_DEMO_README.md"
echo ""
echo "======================================"
