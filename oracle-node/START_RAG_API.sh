#!/bin/bash

echo "[START] Starting Fathom RAG API..."
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
    if [ $? -ne 0 ]; then
        echo "[ERROR] Failed to create venv. Installing python3-venv..."
        sudo apt install -y python3-venv python3-full
        python3 -m venv venv
    fi
fi

# Activate virtual environment
echo "[INSTALL] Activating virtual environment..."
source venv/bin/activate

# Install dependencies if not already installed
if [ ! -f "venv/.installed" ]; then
    echo "📥 Installing dependencies..."
    pip install --upgrade pip
    pip install -r requirements-simple.txt
    touch venv/.installed
    echo "[OK] Dependencies installed!"
else
    echo "[OK] Dependencies already installed"
fi

# Check for .env file
if [ ! -f ".env" ]; then
    echo "[WARNING]  No .env file found!"
    echo "[NOTE] Creating .env from template..."
    cp .env.simple .env
    echo ""
    echo "[KEY] Please edit .env and add your API keys:"
    echo "   - Gemini (Free): https://makersuite.google.com/app/apikey"
    echo "   - OpenAI (Optional): https://platform.openai.com/api-keys"
    echo ""
    echo "After adding keys, run this script again."
    exit 1
fi

# Start the API server
echo "[SERVER] Starting RAG API server on port 5000..."
python3 simple_rag_api.py
