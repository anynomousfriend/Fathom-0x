#!/bin/bash

echo "🔧 Installing Python dependencies for RAG API..."
echo ""

# Install pip and venv if not available
echo "📦 Installing pip and venv..."
sudo apt update
sudo apt install -y python3-pip python3-venv python3-full

echo ""
echo "✅ System packages installed!"
echo ""
echo "🚀 Now run: ./START_RAG_API.sh"
