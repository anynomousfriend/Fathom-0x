# ⚡ Quick Start Guide

Get Fathom Protocol running in under 30 minutes!

## Prerequisites Check

```bash
# Check all tools
node --version    # Need 18+
python3 --version # Need 3.9+
sui --version     # Need latest

# If missing, see NEXT_STEPS.md for installation
```

## 🚀 5-Step Setup

### Step 1: Deploy Contract (5 min)

```bash
cd contracts
sui move build
sui client publish --gas-budget 50000000

# Copy the Package ID and Config Object ID!
```

### Step 2: Upload to Walrus (3 min)

```bash
cd ../scripts
node upload_blob.js ../assets/sample_document.txt

# Copy the Blob ID!
```

### Step 3: Configure Oracle (5 min)

```bash
cd ../oracle-node
cp .env.example .env
nano .env  # Fill in Package ID, Config ID from Step 1

# Install and run
pip install -r requirements.txt
python3 oracle_node.py  # Keep running in terminal 1
```

### Step 4: Configure Frontend (5 min)

```bash
cd ../frontend
cp .env.example .env.local
nano .env.local  # Fill in Package ID, Config ID from Step 1

# Install and run
npm install
npm run dev  # Keep running in terminal 2
```

### Step 5: Test! (5 min)

1. Open http://localhost:3000
2. Connect wallet
3. Click "Register Document"
   - Name: "Research Paper"
   - Blob ID: [from Step 2]
4. Select document
5. Ask: "What is this document about?"
6. Wait 20 seconds
7. See verified answer! ✅

## 📁 Project Structure

```
fathom/
├── contracts/           ← Sui Move smart contract
│   └── sources/
│       └── fathom.move
├── oracle-node/         ← Python oracle service
│   ├── oracle_node.py
│   └── .env            ← Configure this!
├── frontend/           ← Next.js web app
│   ├── src/
│   └── .env.local      ← Configure this!
├── scripts/            ← Deployment helpers
│   ├── deploy.ts
│   └── upload_blob.js
└── assets/             ← Sample documents
```

## 🎯 What Each Component Does

### Smart Contract (`contracts/`)
- **Stores**: Document registry (links to Walrus)
- **Manages**: Query submission and tracking
- **Verifies**: Oracle signatures on answers
- **Emits**: Events for oracle to listen

### Oracle Node (`oracle-node/`)
- **Listens**: For QuerySubmitted events
- **Fetches**: Documents from Walrus
- **Processes**: Questions with AI (simulated)
- **Signs**: Answers cryptographically
- **Submits**: Back to blockchain

### Frontend (`frontend/`)
- **Connects**: Sui wallet (Sui Wallet, Ethos, Suiet)
- **Registers**: New documents
- **Submits**: User queries
- **Displays**: Verified answers

## 🔧 Configuration Files

### `.env` (Oracle)
```env
SUI_RPC_URL=https://fullnode.testnet.sui.io:443
ORACLE_PRIVATE_KEY=suiprivkey1q...  # Get from: sui keytool export
CONTRACT_PACKAGE_ID=0x...           # From deployment
CONFIG_OBJECT_ID=0x...              # From deployment
```

### `.env.local` (Frontend)
```env
NEXT_PUBLIC_PACKAGE_ID=0x...        # Same as above
NEXT_PUBLIC_CONFIG_OBJECT_ID=0x...  # Same as above
```

## 💰 Costs (Testnet)

All costs are in testnet SUI (free from faucet):
- Deploy contract: ~0.02 SUI (one-time)
- Register document: ~0.001 SUI
- Submit query: ~0.0008 SUI
- Oracle answer: ~0.001 SUI (oracle pays)

## 🐛 Common Issues

### "Module not found" error
```bash
# Frontend
cd frontend && npm install

# Oracle
cd oracle-node && pip install -r requirements.txt
```

### "Insufficient gas"
```bash
# Increase gas budget
sui client publish --gas-budget 100000000
```

### "Oracle not processing"
```bash
# Check .env values match deployed contract
cat oracle-node/.env

# Check oracle is running
ps aux | grep oracle_node.py
```

### "Can't connect wallet"
- Install Sui Wallet extension
- Switch to testnet in wallet settings
- Refresh browser

## 📺 Demo Flow

Perfect for your video:

```
1. Terminal 1 (Oracle)
   Show: python3 oracle_node.py
   Status: "Listening for queries..."

2. Browser (Frontend)  
   Show: Connect wallet → Register doc → Submit query

3. Terminal 1 (Oracle)
   Show: "Processing query..." → "Answer submitted"

4. Browser (Frontend)
   Show: Verified answer appears with ✅

Time: ~90 seconds for full flow
```

## 🎥 Screen Recording Tips

```bash
# Use OBS Studio (free)
# Layout: 
# ┌─────────────┬─────────────┐
# │   Terminal  │   Browser   │
# │   (Oracle)  │ (Frontend)  │
# └─────────────┴─────────────┘

# Show both simultaneously
# Narrate what's happening
# Keep under 5 minutes
```

## ✅ Testing Checklist

Before submitting:
- [ ] Contract compiles: `sui move build`
- [ ] Oracle starts: `python3 oracle_node.py`
- [ ] Frontend loads: `npm run dev`
- [ ] Can connect wallet
- [ ] Can register document
- [ ] Can submit query
- [ ] Answer appears (<30 seconds)
- [ ] Signature is shown

## 🆘 Need Help?

### Documentation
- Full guide: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- Architecture: [ARCHITECTURE.md](ARCHITECTURE.md)
- FAQ: [FAQ.md](FAQ.md)

### Support
- Sui Discord: https://discord.gg/sui
- Walrus Docs: https://docs.walrus.site
- GitHub Issues: Open an issue in your repo

## 🏆 Hackathon Tips

1. **Test early**: Don't wait until submission day
2. **Record multiple takes**: Video is crucial
3. **Show enthusiasm**: Passion matters
4. **Explain clearly**: Judges may not be crypto experts
5. **Have fun**: You built something awesome! 🌊

## 📚 Next Steps

After quick start:
1. Read [NEXT_STEPS.md](NEXT_STEPS.md) for submission
2. Check [HACKATHON_CHECKLIST.md](HACKATHON_CHECKLIST.md) for completeness
3. Review [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) for pitch ideas

---

**Ready to dive deeper?** → [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

**Ready to submit?** → [NEXT_STEPS.md](NEXT_STEPS.md)

**Questions?** → [FAQ.md](FAQ.md)

---

🌊 **Good luck with your submission!** 🚀
