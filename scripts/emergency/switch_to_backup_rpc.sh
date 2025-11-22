#!/bin/bash
# Switch to Backup RPC Endpoint

echo "🔄 SWITCHING TO BACKUP RPC..."
echo ""

# Check current RPC
if [ -f "frontend/.env.local" ]; then
    echo "[INFO] Current configuration:"
    grep "RPC_URL" frontend/.env.local 2>/dev/null || echo "   No RPC_URL found"
    echo ""
fi

# Backup RPC endpoints
BACKUP_RPCS=(
    "https://sui-testnet.nodeinfra.com"
    "https://rpc-testnet.suiscan.xyz"
    "https://testnet.sui.rpcpool.com"
    "https://fullnode.testnet.sui.io:443"
)

echo "[SERVER] Available backup RPCs:"
for i in "${!BACKUP_RPCS[@]}"; do
    echo "   $((i+1)). ${BACKUP_RPCS[$i]}"
done
echo ""

# Test which RPC is responsive
echo "[TEST] Testing RPC endpoints..."
WORKING_RPC=""
for rpc in "${BACKUP_RPCS[@]}"; do
    echo -n "   Testing $rpc... "
    if curl -s -m 3 "$rpc" -I > /dev/null 2>&1; then
        echo "[OK] Working"
        WORKING_RPC="$rpc"
        break
    else
        echo "[ERROR] Failed"
    fi
done

if [ -z "$WORKING_RPC" ]; then
    echo ""
    echo "[WARNING]  WARNING: No responsive RPC found!"
    echo "   Using default: ${BACKUP_RPCS[0]}"
    WORKING_RPC="${BACKUP_RPCS[0]}"
fi

echo ""
echo "[TARGET] Selected RPC: $WORKING_RPC"
echo ""

# Get current env values
PACKAGE_ID=$(grep "PACKAGE_ID" frontend/.env.local 2>/dev/null | cut -d'=' -f2)
CONFIG_ID=$(grep "CONFIG_OBJECT_ID" frontend/.env.local 2>/dev/null | cut -d'=' -f2)
WALRUS_AGG=$(grep "WALRUS_AGGREGATOR" frontend/.env.local 2>/dev/null | cut -d'=' -f2)

# Update .env.local
echo "[NOTE] Updating frontend/.env.local..."
cat > frontend/.env.local << EOF
# Updated by emergency script at $(date)

NEXT_PUBLIC_SUI_NETWORK=testnet
NEXT_PUBLIC_SUI_RPC_URL=$WORKING_RPC
NEXT_PUBLIC_CONTRACT_PACKAGE_ID=${PACKAGE_ID:-YOUR_PACKAGE_ID}
NEXT_PUBLIC_CONFIG_OBJECT_ID=${CONFIG_ID:-YOUR_CONFIG_ID}
NEXT_PUBLIC_WALRUS_AGGREGATOR=${WALRUS_AGG:-https://aggregator.walrus-testnet.walrus.space}
EOF

echo "   [OK] Configuration updated"
echo ""

# Restart frontend
echo "🔄 Restarting frontend..."
pkill -f "next dev" 2>/dev/null
sleep 2

cd frontend
npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!

echo "   [OK] Frontend restarted (PID: $FRONTEND_PID)"
echo ""
echo "[STATUS] New Configuration:"
echo "   RPC: $WORKING_RPC"
echo "   Frontend: http://localhost:3000"
echo ""
echo "⏰ Wait 10 seconds for frontend to build..."
