# 🚀 Fathom Deployment Guide

Complete step-by-step guide to deploy and run Fathom Protocol for the DeepSurge Hackathon.

## Prerequisites

Before you begin, ensure you have:

- [ ] Node.js 18+ installed
- [ ] Python 3.9+ installed
- [ ] Sui CLI installed (`cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui`)
- [ ] Walrus CLI installed (from https://docs.walrus.site)
- [ ] Git installed

## Phase 1: Initial Setup ✅

### 1.1 Clone and Setup Repository

```bash
# Clone the repository
git clone https://github.com/yourusername/fathom.git
cd fathom

# Verify structure
ls -la
```

### 1.2 Configure Sui Wallet

```bash
# Create/import Sui wallet
sui client

# Switch to testnet
sui client switch --env testnet

# Get your address
sui client active-address

# Fund your wallet (get testnet SUI)
# Visit: https://discord.gg/sui (use #testnet-faucet channel)
```

## Phase 2: Deploy Smart Contract 📝

### 2.1 Build Contract

```bash
cd contracts
sui move build
```

Expected output: `Build Successful`

### 2.2 Deploy to Testnet

```bash
sui client publish --gas-budget 50000000
```

**Save these values:**
- Package ID: `0x...`
- AdminCap Object ID: `0x...`
- FathomConfig Object ID: `0x...`

### 2.3 Verify on Explorer

Visit: `https://suiscan.xyz/testnet/object/[YOUR_PACKAGE_ID]`

## Phase 3: Upload Document to Walrus 🌊

### 3.1 Prepare Sample Document

```bash
cd ../assets
# Create a sample document
echo "This is a sample research paper about AI security..." > sample_doc.txt
```

### 3.2 Upload to Walrus

```bash
cd ../scripts
node upload_blob.js ../assets/sample_doc.txt
```

**Save the Blob ID:** `blob_xxx...`

## Phase 4: Configure Oracle Node 🤖

### 4.1 Setup Python Environment

```bash
cd ../oracle-node

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 4.2 Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env file
nano .env
```

Fill in:
```env
SUI_RPC_URL=https://fullnode.testnet.sui.io:443
ORACLE_PRIVATE_KEY=your_sui_private_key
WALRUS_AGGREGATOR_URL=https://aggregator.walrus-testnet.walrus.space
CONTRACT_PACKAGE_ID=0x...  # From deployment
CONFIG_OBJECT_ID=0x...     # From deployment
POLL_INTERVAL=10
```

### 4.3 Test Oracle

```bash
python3 oracle_node.py
```

Expected: `🌊 Initializing Fathom Oracle Node...` then `👂 Starting to listen for queries...`

## Phase 5: Setup Frontend 🖥️

### 5.1 Install Dependencies

```bash
cd ../frontend
npm install
```

### 5.2 Configure Environment

```bash
# Copy example env
cp .env.example .env.local

# Edit .env.local
nano .env.local
```

Fill in:
```env
NEXT_PUBLIC_SUI_NETWORK=testnet
NEXT_PUBLIC_SUI_RPC_URL=https://fullnode.testnet.sui.io:443
NEXT_PUBLIC_PACKAGE_ID=0x...      # From deployment
NEXT_PUBLIC_CONFIG_OBJECT_ID=0x... # From deployment
NEXT_PUBLIC_WALRUS_AGGREGATOR_URL=https://aggregator.walrus-testnet.walrus.space
```

### 5.3 Run Development Server

```bash
npm run dev
```

Visit: `http://localhost:3000`

## Phase 6: End-to-End Test 🧪

### 6.1 Connect Wallet

1. Open http://localhost:3000
2. Click "Connect Wallet"
3. Approve connection in Sui Wallet

### 6.2 Register Document

1. Click "Register New Document"
2. Fill in:
   - Name: "Sample Research Paper"
   - Description: "AI Security Research"
   - Blob ID: [Your Walrus Blob ID]
3. Click "Register"
4. Approve transaction in wallet

### 6.3 Submit Query

1. Select your document
2. Enter question: "What is this document about?"
3. Click "Submit Query"
4. Wait for oracle to process (10-30 seconds)

### 6.4 Verify Answer

Expected result:
- ✅ Answer displayed with green "Verified" badge
- ✅ Signature shown
- ✅ Timestamp displayed

## Phase 7: Create Demo Video 🎥

### 7.1 Prepare Script

```
1. Introduction (30s)
   - "Hi, I'm presenting Fathom Protocol"
   - "Verifiable RAG for Private Data"
   
2. Problem Statement (30s)
   - Current issues with data privacy in AI
   
3. Solution Demo (3min)
   - Show architecture diagram
   - Walk through live demo
   - Connect wallet → Register document → Query → View answer
   
4. Technology Stack (30s)
   - Walrus for storage
   - Sui for smart contracts
   - Nautilus-inspired oracle architecture
   
5. Conclusion (30s)
   - Future plans
   - Thank you
```

### 7.2 Record Demo

Tools:
- OBS Studio (free, cross-platform)
- Loom (easy, web-based)
- QuickTime (Mac)

Requirements:
- Max 5 minutes
- 1080p resolution
- Clear audio
- Show both terminal (oracle) and browser (UI)

### 7.3 Upload Video

1. Upload to YouTube (unlisted)
2. Or upload to Vimeo
3. Copy the link

## Phase 8: Submission 📤

### 8.1 Update README

```bash
cd ..
nano README.md
```

Update:
- [ ] Add your actual Package ID
- [ ] Add demo video link
- [ ] Add screenshots to assets/
- [ ] Update team information
- [ ] Update contact information

### 8.2 Commit and Push

```bash
git add .
git commit -m "Complete Fathom Protocol for DeepSurge Hackathon"
git push origin main
```

### 8.3 Submit on DeepSurge

1. Visit: https://deepsurge.devfolio.co (or relevant platform)
2. Login/Register
3. Click "Submit Project"
4. Fill form:
   - **Name:** Fathom Protocol
   - **Tagline:** Verifiable RAG for Private Data on Walrus
   - **Track:** AI x Data
   - **Description:** [Use README intro]
   - **GitHub:** [Your repo URL]
   - **Demo:** [YouTube/Vimeo link]
   - **Screenshots:** Upload 3-5 images
5. Click "Submit"

## Verification Checklist ✅

Before submitting, verify:

- [ ] Contract deployed and verified on Sui Explorer
- [ ] Oracle node runs without errors
- [ ] Frontend loads and connects to wallet
- [ ] Can submit queries and receive answers
- [ ] Demo video uploaded and accessible
- [ ] README has all information
- [ ] GitHub repo is public
- [ ] All links in submission work in incognito mode
- [ ] Screenshots are clear and representative
- [ ] Team information is accurate

## Troubleshooting 🔧

### Contract deployment fails
- Check gas budget (increase to 100000000)
- Verify wallet has sufficient SUI
- Check Move.toml dependencies

### Oracle can't connect
- Verify .env file has correct values
- Check RPC URL is accessible
- Ensure private key is valid

### Frontend won't build
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Next.js cache: `rm -rf .next`
- Verify environment variables in .env.local

### Queries not getting answers
- Check oracle is running
- Verify contract addresses match in oracle .env
- Check oracle logs for errors
- Ensure Walrus blob is accessible

## Support

For issues:
1. Check logs carefully
2. Review error messages
3. Test each component independently
4. Join Sui Discord for help
5. Check Walrus documentation

## Good Luck! 🎉

You're ready to submit Fathom to DeepSurge!

Remember:
- Test everything before submitting
- Make your demo video engaging
- Highlight the innovative aspects
- Explain the technology clearly
- Show enthusiasm for the project

**The judges are looking for:**
- ✅ Working demo
- ✅ Clear use case
- ✅ Good technical implementation
- ✅ Innovative approach
- ✅ Professional presentation
