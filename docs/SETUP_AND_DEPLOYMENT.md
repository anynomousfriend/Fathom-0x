# Fathom Protocol - Setup & Deployment Guide

**Complete installation, configuration, and deployment instructions.**

---

## Table of Contents
1. [Quick Start](#quick-start)
2. [Prerequisites](#prerequisites)
3. [Component Setup](#component-setup)
4. [Running the Demo](#running-the-demo)
5. [Deployment](#deployment)
6. [Troubleshooting](#troubleshooting)

---

# Quick Start

### One-Command Demo

```bash
# Clone repository
git clone https://github.com/yourusername/fathom-protocol.git
cd fathom-protocol

# Start frontend
./START_DEMO.sh
```

**Then in separate terminal**:
```bash
# Start oracle
cd oracle-node
source venv/bin/activate
python oracle_node.py
```

**Access**: http://localhost:3000

---

# Prerequisites

### System Requirements
- **OS**: Linux, macOS, or Windows with WSL2
- **RAM**: 4+ GB
- **Disk**: 10+ GB free
- **Node.js**: 18.0+
- **Python**: 3.10+

### Install Dependencies

**Sui CLI**:
```bash
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui

# Verify
sui --version
```

**Walrus CLI**:
```bash
# Linux
wget https://storage.googleapis.com/mysten-walrus-binaries/walrus-testnet-latest-ubuntu-x86_64.tar.gz
tar -xzf walrus-testnet-latest-ubuntu-x86_64.tar.gz
sudo mv walrus /usr/local/bin/

# macOS
wget https://storage.googleapis.com/mysten-walrus-binaries/walrus-testnet-latest-macos-x86_64.tar.gz
tar -xzf walrus-testnet-latest-macos-x86_64.tar.gz
sudo mv walrus /usr/local/bin/

# Verify
walrus --version
```

**Configure Sui Wallet**:
```bash
# Generate wallet
sui client new-address ed25519

# Switch to testnet
sui client switch --env testnet

# Get testnet SUI
# Visit: https://faucet.testnet.sui.io/
```

---

# Component Setup

## 1. Smart Contracts

**Build**:
```bash
cd contracts
sui move build
```

**Deploy**:
```bash
sui client publish --gas-budget 100000000
```

**Save addresses** (from deployment output):
```
PACKAGE_ID=0xabcdef...
CONFIG_OBJECT_ID=0x123456...
ADMIN_CAP_ID=0x789abc...
```

**Create `.env`** in `contracts/`:
```bash
SUI_NETWORK=testnet
PACKAGE_ID=0xabcdef...
CONFIG_OBJECT_ID=0x123456...
ADMIN_CAP_ID=0x789abc...
```

---

## 2. Frontend

**Install**:
```bash
cd frontend
npm install
```

**Configure `.env.local`**:
```bash
NEXT_PUBLIC_SUI_NETWORK=testnet
NEXT_PUBLIC_CONTRACT_PACKAGE_ID=0xabcdef...
NEXT_PUBLIC_CONFIG_OBJECT_ID=0x123456...
NEXT_PUBLIC_WALRUS_AGGREGATOR=https://aggregator.walrus-testnet.walrus.space
```

**Start**:
```bash
npm run dev
# Access: http://localhost:3000
```

---

## 3. Oracle Node

**Setup**:
```bash
cd oracle-node
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**Configure `.env`**:
```bash
# Blockchain
SUI_RPC_URL=https://fullnode.testnet.sui.io:443
ORACLE_PRIVATE_KEY=suiprivkey1q...
CONTRACT_PACKAGE_ID=0xabcdef...
CONFIG_OBJECT_ID=0x123456...

# Walrus
WALRUS_AGGREGATOR_URL=https://aggregator.walrus-testnet.walrus.space

# AI (Optional)
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=...

# Settings
POLL_INTERVAL=10
MOCK_MODE=false
```

**Start**:
```bash
python oracle_node.py
```

---

# Running the Demo

## Complete Demo Flow

**Terminal 1 - Frontend**:
```bash
cd frontend
npm run dev
```

**Terminal 2 - Oracle**:
```bash
cd oracle-node
source venv/bin/activate
python oracle_node.py
```

**Terminal 3 - Logs** (optional):
```bash
tail -f logs/oracle.log
```

---

## Step-by-Step Demo

### Step 1: Connect Wallet
1. Open http://localhost:3000
2. Click "Connect Wallet"
3. Select Sui wallet
4. Approve connection

### Step 2: Register Document
1. Click "Register New Document"
2. Select file: `_demo_files/demo-data/financial_report.txt`
3. Enter:
   - **Name**: "Q3 Financial Report"
   - **Description**: "Sensitive financial data"
4. Click "Encrypt & Upload"
5. Wait 5-10 seconds for:
   - File encryption
   - Walrus upload
   - Blockchain registration

**If Walrus HTTP fails**:
```bash
# Use CLI
cd _demo_files/demo-data
walrus store financial_report.txt --epochs 5
# Copy blob ID, enter manually in UI
```

### Step 3: Submit Query
1. Select document from list
2. Enter question: "What was the Q3 revenue?"
3. Click "Submit Query"
4. Approve transaction
5. Wait 10-20 seconds for oracle processing

### Step 4: View Results
- Answer displays with signature
- Verify on blockchain: https://suiexplorer.com/?network=testnet

---

## Sample Documents

Use files in `_demo_files/demo-data/`:

**financial_report.txt**
- Query: "What was the revenue growth?"

**patient_record.txt**
- Query: "What medications is the patient taking?"

**research_paper.txt**
- Query: "What are the key findings?"

---

# Deployment

## Frontend (Vercel)

**Build**:
```bash
cd frontend
npm run build
```

**Deploy**:
```bash
npm install -g vercel
vercel login
vercel --prod
```

**Environment Variables** (in Vercel dashboard):
```
NEXT_PUBLIC_SUI_NETWORK=mainnet
NEXT_PUBLIC_CONTRACT_PACKAGE_ID=0x...
NEXT_PUBLIC_CONFIG_OBJECT_ID=0x...
NEXT_PUBLIC_WALRUS_AGGREGATOR=https://aggregator.walrus.space
```

---

## Oracle (Docker)

**Build**:
```bash
cd oracle-node
docker build -t fathom-oracle .
```

**Run**:
```bash
docker run -d \
  --name fathom-oracle \
  --env-file .env \
  -p 5000:5000 \
  fathom-oracle
```

**Deploy to Cloud** (AWS ECS example):
```bash
# Tag image
docker tag fathom-oracle:latest YOUR_ECR_REPO/fathom-oracle:latest

# Push
docker push YOUR_ECR_REPO/fathom-oracle:latest

# Update service
aws ecs update-service \
  --cluster fathom-cluster \
  --service fathom-oracle \
  --force-new-deployment
```

---

## Smart Contracts (Mainnet)

**Switch network**:
```bash
sui client switch --env mainnet
```

**Ensure funded**:
```bash
sui client gas
```

**Deploy**:
```bash
cd contracts
sui client publish --gas-budget 200000000
```

**Update all `.env` files** with mainnet addresses.

---

# Troubleshooting

## Wallet Connection Fails

**Solution**:
```bash
# Check wallet on testnet
sui client active-env  # Should be: testnet

# Verify balance
sui client gas

# Get more SUI
# Visit: https://faucet.testnet.sui.io/
```

---

## Walrus Upload Fails

**Symptoms**: "HTTP 500" or timeout

**Solution 1 - CLI Upload**:
```bash
cd _demo_files/demo-data
walrus store file.txt --epochs 5
# Copy blob ID, enter in UI
```

**Solution 2 - Use Pre-uploaded**:
```bash
# Pre-upload before demo
walrus store financial_report.txt --epochs 5
# Save blob ID: bBlob123...

# In demo, use "Enter Blob ID manually"
```

---

## Oracle Not Processing

**Check oracle running**:
```bash
ps aux | grep oracle_node.py
```

**Check logs**:
```bash
tail -n 50 oracle-node/oracle.log
```

**Restart**:
```bash
pkill -f oracle_node.py
cd oracle-node
source venv/bin/activate
python oracle_node.py
```

**Use mock mode** (for demo):
```bash
export MOCK_MODE=true
python oracle_node.py
# Returns instant responses
```

---

## Frontend Crashes

**Hard refresh**:
```
Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
```

**Restart**:
```bash
cd frontend
pkill -f "next dev"
rm -rf .next
npm run dev
```

---

## Blockchain RPC Timeout

**Switch RPC**:
```bash
# Edit frontend/.env.local
NEXT_PUBLIC_SUI_RPC_URL=https://sui-testnet.nodeinfra.com

# Restart frontend
```

**Alternative RPCs**:
- https://rpc-testnet.suiscan.xyz
- https://testnet.sui.rpcpool.com
- https://fullnode.testnet.sui.io:443

---

## Emergency Scripts

All scripts in: `scripts/emergency/`

**Test everything**:
```bash
./scripts/emergency/test_all_services.sh
```

**Restart all**:
```bash
./scripts/emergency/restart_all.sh
```

**Enable mock mode**:
```bash
./scripts/emergency/enable_mock_mode.sh
```

**Switch RPC**:
```bash
./scripts/emergency/switch_to_backup_rpc.sh
```

---

## Environment Variables Reference

### Frontend `.env.local`
```bash
NEXT_PUBLIC_SUI_NETWORK=testnet
NEXT_PUBLIC_CONTRACT_PACKAGE_ID=0x...
NEXT_PUBLIC_CONFIG_OBJECT_ID=0x...
NEXT_PUBLIC_WALRUS_AGGREGATOR=https://aggregator.walrus-testnet.walrus.space
```

### Oracle `.env`
```bash
SUI_RPC_URL=https://fullnode.testnet.sui.io:443
ORACLE_PRIVATE_KEY=suiprivkey1q...
CONTRACT_PACKAGE_ID=0x...
CONFIG_OBJECT_ID=0x...
WALRUS_AGGREGATOR_URL=https://aggregator.walrus-testnet.walrus.space
OPENAI_API_KEY=sk-...
POLL_INTERVAL=10
MOCK_MODE=false
```

### Contracts `.env`
```bash
SUI_NETWORK=testnet
PACKAGE_ID=0x...
CONFIG_OBJECT_ID=0x...
ADMIN_CAP_ID=0x...
```

---

## Useful Commands

**Sui**:
```bash
sui client gas                    # Check balance
sui client active-address         # Get address
sui client object OBJECT_ID       # View object
sui client switch --env testnet   # Switch network
```

**Walrus**:
```bash
walrus store file.txt --epochs 5  # Upload
walrus info                       # Check status
```

**Docker**:
```bash
docker logs -f fathom-oracle      # View logs
docker stop fathom-oracle         # Stop
docker restart fathom-oracle      # Restart
```

**Process Management**:
```bash
lsof -i :3000                     # Check frontend
lsof -i :5000                     # Check RAG API
pkill -f "next dev"               # Kill frontend
pkill -f "oracle_node"            # Kill oracle
```

---

## Performance Metrics

| Metric | Value |
|--------|-------|
| Document Upload | 3-8 seconds |
| Query Submission | 1-2 seconds |
| Oracle Processing | 5-15 seconds |
| Total Query Time | 10-25 seconds |
| Cost per Query | $0.02-0.06 |

---

## Support

- **Documentation**: This guide + `docs/TECHNICAL_ARCHITECTURE.md`
- **Demo Guide**: `docs/DEMO_PRESENTATION.md`
- **Emergency Scripts**: `scripts/emergency/`
- **GitHub Issues**: [Your repo issues page]
- **Discord**: [Your Discord link]

---

**Setup complete! Ready to run the demo.** 🚀
