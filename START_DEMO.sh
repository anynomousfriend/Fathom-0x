#!/bin/bash

echo "🚀 Starting Fathom-0x Protocol Demo..."
echo ""

# Kill any existing processes
killall -9 node 2>/dev/null
sleep 1

# Navigate to frontend
cd frontend

# Clear cache
echo "🧹 Clearing cache..."
rm -rf .next

# Start dev server
echo "🌊 Starting frontend..."
npm run dev

