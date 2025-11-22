#!/bin/bash

echo "[FATHOM] Starting Fathom Oracle Node..."
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "[ERROR] Virtual environment not found!"
    echo "   Please create it first: python3 -m venv venv"
    exit 1
fi

# Check if dependencies are installed
if ! ./venv/bin/pip show pysui > /dev/null 2>&1; then
    echo "[ERROR] Dependencies not installed!"
    echo "   Installing now..."
    ./venv/bin/pip install -r requirements.txt
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "[ERROR] .env file not found!"
    echo "   Please create it from .env.example"
    exit 1
fi

# Run the oracle node
echo "[OK] Starting oracle node..."
echo ""
./venv/bin/python oracle_node.py
