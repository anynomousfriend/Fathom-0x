#!/bin/bash

echo "🔍 RAG API Debug Test"
echo ""

# Test 1: Health check
echo "1️⃣ Testing health endpoint..."
curl -s http://localhost:5000/health | python3 -m json.tool
echo ""

# Test 2: Mock query (no document needed)
echo "2️⃣ Testing mock query endpoint..."
curl -s -X POST http://localhost:5000/query-mock \
  -H "Content-Type: application/json" \
  -d '{"question": "What is the main conclusion?"}' | python3 -m json.tool
echo ""

# Test 3: Real query with fake blob ID (will fail but show error)
echo "3️⃣ Testing real query endpoint (expected to fail)..."
curl -s -X POST http://localhost:5000/query \
  -H "Content-Type: application/json" \
  -d '{
    "blob_id": "test_blob_123",
    "encryption_key": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    "iv": "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    "question": "Test question"
  }' | python3 -m json.tool
echo ""

echo "[OK] Debug tests complete!"
echo ""
echo "[TIP] If mock works but real fails, the issue is:"
echo "   1. Missing encryption keys in localStorage"
echo "   2. Wrong blob ID"
echo "   3. Document not on Walrus"
