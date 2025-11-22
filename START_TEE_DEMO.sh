#!/bin/bash

# Fathom-0x Protocol - TEE Demo Launcher
# ======================================
# 
# This script launches a visual demonstration of TEE processing
# Perfect for presentations and demos

echo "[SECURE] Fathom-0x Protocol - TEE Demo"
echo "=================================="
echo ""
echo "Starting TEE simulation..."
echo ""

cd oracle-node

# Make sure script is executable
chmod +x demo_tee_simulation.py

# Run the demo
python3 demo_tee_simulation.py "$@"

echo ""
echo "[OK] TEE Demo Complete!"
echo ""
echo "[TIP] For live demo mode: ./START_TEE_DEMO.sh --live"
