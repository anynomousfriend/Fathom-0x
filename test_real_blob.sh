#!/bin/bash

echo "🔍 Testing Real Walrus Blob"
echo ""

# Replace with your actual blob ID
BLOB_ID="xGl2XwFCnCgFCuuhqT_u9bO_C90IIWjOr-hT5r9mxT4"

echo "Blob ID: $BLOB_ID"
echo ""

# Test 1: Can we download from Walrus?
echo "1️⃣ Testing Walrus download..."
HTTP_CODE=$(curl -s -o /tmp/blob_test.enc -w "%{http_code}" "https://aggregator.walrus-testnet.walrus.space/v1/$BLOB_ID")

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Download successful!"
    SIZE=$(wc -c < /tmp/blob_test.enc)
    echo "   File size: $SIZE bytes"
    echo "   First 50 bytes (hex):"
    hexdump -C /tmp/blob_test.enc | head -3
else
    echo "❌ Download failed with HTTP $HTTP_CODE"
    echo "   This blob doesn't exist on Walrus!"
fi

echo ""
echo "💡 To fix:"
echo "   1. Upload encrypted file via Walrus CLI"
echo "   2. Get the REAL blob ID from the output"
echo "   3. Use that blob ID in the frontend"
