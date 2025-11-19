# 🌊 Fathom Protocol

**Verifiable RAG for Private Data on Walrus**

> Enabling AI to reason over encrypted documents with cryptographic proof of integrity.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Sui Network](https://img.shields.io/badge/Sui-Testnet-blue)](https://suiscan.xyz)
[![Walrus](https://img.shields.io/badge/Walrus-Storage-green)](https://walrus.site)

---

## 🏆 Track: AI x Data

Fathom combines **Walrus decentralized storage**, **Sui smart contracts**, and **Nautilus Chain's verifiable computation** to create a system where AI can answer questions about private documents without ever exposing the raw data.

---

## 🎯 The Problem

Current RAG (Retrieval-Augmented Generation) systems require:
- ❌ Uploading sensitive documents to centralized servers
- ❌ Trusting AI providers with your private data
- ❌ No proof that answers came from the correct source

---

## 💡 The Solution

**Fathom** creates a verifiable pipeline:

1. **Store**: Documents encrypted on Walrus (decentralized blob storage)
2. **Query**: Users ask questions through Sui smart contract
3. **Compute**: Oracle retrieves document, generates answer in TEE-like environment
4. **Verify**: Cryptographic signature proves answer authenticity
5. **Deliver**: Answer returned on-chain with verification proof

---

## 🏗 Architecture

```
┌─────────────┐
│    User     │
│  (Browser)  │
└──────┬──────┘
       │
       │ 1. Ask Question
       ▼
┌─────────────────┐
│  Sui Contract   │◄──── 4. Submit Answer + Signature
│   (Fathom)      │
└────────┬────────┘
         │
         │ 2. Emit Event
         ▼
┌──────────────────┐
│  Oracle Node     │
│  (Python/TEE)    │
└────────┬─────────┘
         │
         │ 3. Fetch Document
         ▼
┌──────────────────┐
│     Walrus       │
│  Blob Storage    │
└──────────────────┘
```

---

## 🔧 Technology Stack

### Walrus Storage
- **Purpose**: Decentralized storage for encrypted document blobs
- **Integration**: Documents uploaded to Walrus Testnet, Blob IDs stored on-chain
- **Why**: Ensures data availability without centralized storage risks

### Sui Network
- **Purpose**: Smart contract for query requests and answer verification
- **Integration**: On-chain registry of documents, query submission, signature verification
- **Why**: Transparent, auditable query/answer pipeline

### Nautilus Chain (Mock TEE)
- **Purpose**: Verifiable computation environment for AI inference
- **Integration**: Oracle node with cryptographic signing to prove computation integrity
- **Why**: Demonstrates path to full TEE (Trusted Execution Environment) integration

---

## 📦 Repository Structure

```
fathom/
├── contracts/          # Sui Move smart contracts
│   ├── sources/
│   │   └── fathom.move
│   └── Move.toml
├── oracle-node/        # Python oracle service
│   ├── oracle_node.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/           # Next.js web interface
│   ├── src/
│   ├── public/
│   └── package.json
├── scripts/            # Deployment and utility scripts
│   ├── deploy.ts
│   └── upload_blob.js
├── assets/             # Logos, diagrams, screenshots
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Python 3.9+
- Sui CLI (`cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui`)
- Walrus CLI

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/fathom.git
cd fathom
```

### 2. Deploy Smart Contract

```bash
cd contracts
sui move build
sui client publish --gas-budget 50000000
# Save the Package ID, AdminCap ID, and FathomConfig ID
```

### 3. Upload Document to Walrus

```bash
cd ../scripts
node upload_blob.js path/to/document.pdf
# Save the returned Blob ID
```

### 4. Configure Oracle

```bash
cd ../oracle-node
cp .env.example .env
# Edit .env with your:
# - SUI_RPC_URL
# - ORACLE_PRIVATE_KEY
# - WALRUS_BLOB_ID
# - CONTRACT_PACKAGE_ID

pip install -r requirements.txt
python3 oracle_node.py
```

### 5. Launch Frontend

```bash
cd ../frontend
npm install
npm run dev
# Open http://localhost:3000
```

---

## 🎬 Demo Walkthrough

### Step 1: Connect Wallet
- Click "Connect Wallet" and authorize with Sui Wallet

### Step 2: Ask a Question
- Enter: "What is the main conclusion of the research paper?"
- Click "Submit Query"

### Step 3: Watch the Pipeline
- **Frontend**: Query submitted to Sui contract
- **Contract**: Event emitted with query details
- **Oracle**: Listens for event, fetches document from Walrus
- **Oracle**: Processes query using AI (simulated TEE)
- **Oracle**: Signs answer and submits back to contract

### Step 4: View Verified Answer
- Answer appears with ✅ "Verified Signature" badge
- Transaction link shows on-chain proof

---

## 🔐 Security Model

1. **Data Privacy**: Documents never leave Walrus encrypted storage
2. **Answer Integrity**: Cryptographic signatures prove oracle authenticity
3. **On-Chain Audit Trail**: All queries and answers recorded on Sui
4. **Future TEE Integration**: Path to full hardware-based trusted execution

---

## 🛠 Development

### Run Tests

```bash
# Smart Contract Tests
cd contracts
sui move test

# Oracle Tests
cd oracle-node
pytest

# Frontend Tests
cd frontend
npm test
```

### Build for Production

```bash
# Contract (already done during deployment)
sui move build

# Frontend
cd frontend
npm run build
```

---

## 📸 Screenshots

![Fathom Interface](assets/demo-screenshot.png)

---

## 🎥 Demo Video

[Watch the 5-minute demo](https://youtu.be/YOUR_VIDEO_ID)

---

## 🗺 Roadmap

- [ ] Full TEE integration with Nautilus Chain
- [ ] Multi-document knowledge bases
- [ ] Advanced RAG with vector embeddings
- [ ] On-chain governance for oracle network
- [ ] Mobile app interface

---

## 👥 Team

- **Your Name** - Full Stack Developer

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Built for the **DeepSurge Hackathon**
- Sui Foundation
- Walrus Protocol
- Nautilus Chain

---

## 📞 Contact

- GitHub: [@yourusername](https://github.com/yourusername)
- Twitter: [@yourhandle](https://twitter.com/yourhandle)
- Email: your.email@example.com

---

**Made with 🌊 by the Fathom team**
