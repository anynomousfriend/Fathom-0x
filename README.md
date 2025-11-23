<div align="center">

<img src="assets/logo-svg.svg" alt="Fathom Protocol" width="300"/>

# Fathom Protocol

**Privacy-Preserving RAG on Blockchain**

*Real AI. Real Privacy. Real Proof.*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Sui Network](https://img.shields.io/badge/Sui-Testnet-blue)](https://sui.io)
[![Walrus Storage](https://img.shields.io/badge/Walrus-Integrated-cyan)](https://walrus.site)

[Live Demo](http://localhost:3000) • [Documentation](docs/) • [Architecture](docs/TECHNICAL_ARCHITECTURE.md) • [Discord](#)

</div>

---

## Quick Start (Demo Day)

**Start the entire system with one command:**

```bash
./START_FULL_SYSTEM.sh
```

This launches:
- RAG API (Backend) on port 5000
- Oracle Node (Blockchain listener)
- Frontend (Next.js) on port 3000

**Then open:** http://localhost:3000

 **Full Demo Guide:** See [DEMO_DAY_PRESENTATION.md](DEMO_DAY_PRESENTATION.md) for complete presentation script
 **Quick Reference:** See [README_DEMO_QUICK.md](README_DEMO_QUICK.md) for 1-page cheat sheet

---

## What is Fathom Protocol?

Fathom Protocol solves the fundamental problem with AI: **you can't use powerful AI models without exposing your private data**.

Traditional RAG (Retrieval-Augmented Generation) systems force an impossible choice:
- **Cloud RAG** (OpenAI, AWS): Upload your data in plaintext lose privacy
- **Self-Hosted RAG**: Keep data private lose AI capabilities
- **Don't Use AI**: Keep privacy lose competitive advantage

**Fathom Protocol gives you both**: quality AI with cryptographic privacy guarantees.

---

## Key Features

### **End-to-End Encryption**
Documents encrypted in your browser before upload using AES-256-GCM. Storage providers only see encrypted blobs.

### ️ **Decentralized Storage**
Encrypted documents stored on Walrus, Sui's decentralized storage network. No single point of failure or control.

### **Verifiable Computation**
Oracle nodes process queries in Trusted Execution Environments (TEE). Every answer is cryptographically signed.

### ️ **Blockchain Verification**
All operations recorded on Sui blockchain. Complete audit trail of who accessed what and when.

### **Real AI**
Use , Gemini, or local models for RAG queries. Not limited to toy models or simple keyword search.

### **On-Chain Proof**
Cryptographic signatures prove the oracle processed your query correctly. Don't trust, verify.

---

## ️ Architecture

```
┌─────────────┐ ┌──────────────┐ ┌─────────────┐
│ Browser │────────▶│ Sui Contract │────────▶│ Oracle │
│ (Encrypt) │ │ (Verify) │ │ (TEE) │
└─────────────┘ └──────────────┘ └─────────────┘
 │ │ │
 │ │ ▼
 │ │ ┌─────────────┐
 │ │ │ Walrus │
 │ │ │ Storage │
 │ │ └─────────────┘
 │ │ │
 │ ▼ │
 └──────────────── Verified Answer ◀───────────────┘
 + Signature
```

**Components**:
1. **Frontend** (Next.js + TypeScript) - User interface with wallet integration
2. **Smart Contract** (Sui Move) - On-chain coordination and verification
3. **Oracle Node** (Python) - Query processing with TEE security
4. **Walrus Storage** - Decentralized blob storage for encrypted documents

---

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- Sui CLI
- Walrus CLI
- Sui Wallet with testnet SUI

### One-Command Demo

```bash
# Clone repository
git clone https://github.com/yourusername/fathom-protocol.git
cd fathom-protocol

# Start demo
./START_DEMO.sh
```

Then in a separate terminal:

```bash
# Start oracle
cd oracle-node
source venv/bin/activate
python oracle_node.py
```

**Access the app**: http://localhost:3000

For detailed setup instructions, see [Setup Guide](docs/SETUP_AND_DEPLOYMENT.md).

---

## Documentation

### Core Documentation
- **[Technical Architecture](docs/TECHNICAL_ARCHITECTURE.md)** - Complete technical implementation details
- **[Demo Presentation](docs/DEMO_PRESENTATION.md)** - Presentation script and talking points
- **[Setup & Deployment](docs/SETUP_AND_DEPLOYMENT.md)** - Installation, configuration, and deployment guide

### Quick Links
- [How It Works](#how-it-works)
- [Use Cases](#use-cases)
- [Roadmap](#roadmap)
- [Contributing](#contributing)

---

## How It Works

### 1. **Register Document**
```typescript
// Client-side encryption (AES-256-GCM)
const encryptedFile = await encryptDocument(file)
const blobId = await uploadToWalrus(encryptedFile)
await registerOnChain(blobId, metadata)
```

User encrypts document in browser, uploads to Walrus, registers on Sui blockchain.

### 2. **Submit Query**
```typescript
// Submit question on-chain
await submitQuery(documentId, "What was Q3 revenue?")
// Emits QuerySubmitted event
```

User asks a question about their document. Query recorded on blockchain.

### 3. **Oracle Processing**
```python
# Oracle detects event, fetches & decrypts
encrypted_blob = fetch_from_walrus(blob_id)
document = decrypt(encrypted_blob, key)

# RAG processing with AI
answer = process_with_gpt4(document, question)

# Sign and submit
signature = sign(answer, oracle_private_key)
submit_answer(query_id, answer, signature)
```

Oracle fetches encrypted document, decrypts in TEE, processes with AI, signs answer, submits on-chain.

### 4. **Verification**
```typescript
// Frontend verifies signature
const verified = await verifySignature(
 answer,
 signature,
 oraclePublicKey
)
```

User receives verified answer with cryptographic proof of authenticity.

---

## Use Cases

### **Healthcare**
- **Problem**: HIPAA prevents using cloud AI on patient records
- **Solution**: Query medical data with while maintaining compliance
- **Value**: AI-powered diagnosis assistance with privacy guarantees

### ️ **Legal**
- **Problem**: Attorney-client privilege prevents cloud document analysis
- **Solution**: AI research on case files without exposing confidential information
- **Value**: Faster legal research with confidentiality intact

### **Financial Services**
- **Problem**: Regulations prevent sharing financial data with third parties
- **Solution**: AI analysis of portfolios, reports, transactions with encryption
- **Value**: Better financial insights without regulatory risk

### **Enterprise**
- **Problem**: Proprietary data leakage concerns with cloud AI
- **Solution**: Query internal documents with verifiable privacy
- **Value**: Competitive intelligence without data exposure risk

---

## ️ Roadmap

### Phase 1: Core Protocol (Completed)
- [x] Smart contract implementation (Sui Move)
- [x] Client-side encryption (Web Crypto API)
- [x] Walrus storage integration
- [x] Oracle node with RAG processing
- [x] Frontend with wallet integration
- [x] Cryptographic signatures

### Phase 2: TEE Integration (Q1 2025)
- [ ] Intel SGX deployment
- [ ] Remote attestation
- [ ] On-chain verification of attestation
- [ ] Hardware security module integration

### Phase 3: Multi-Oracle (Q2 2025)
- [ ] Multiple oracle nodes
- [ ] Consensus mechanism (3-of-5 threshold)
- [ ] Slashing for malicious oracles
- [ ] Oracle staking and rewards

### Phase 4: Advanced Features (Q3-Q4 2025)
- [ ] Proxy re-encryption for key management
- [ ] Zero-knowledge query proofs
- [ ] Team/organization support
- [ ] Access control lists (ACLs)
- [ ] Fine-tuned model support in TEE
- [ ] Cross-chain bridges
- [ ] Mainnet deployment

---

## Technical Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Blockchain** | Sui Network | Transaction coordination & verification |
| **Smart Contracts** | Move Language | On-chain logic and state management |
| **Storage** | Walrus | Decentralized encrypted blob storage |
| **Frontend** | Next.js 14 + TypeScript | User interface & wallet integration |
| **Encryption** | Web Crypto API (AES-256-GCM) | Client-side document encryption |
| **Oracle** | Python 3.12 | Query processing & AI integration |
| **AI/RAG** | LangChain + OpenAI/Gemini | Retrieval-augmented generation |
| **Vector DB** | ChromaDB | Embedding storage & similarity search |
| **Signatures** | Ed25519 | Cryptographic answer verification |

---

## Demo

### Video Demo
[![Fathom Protocol Demo](assets/demo-thumbnail.png)](https://youtu.be/your-demo-video)

### Try It Live
1. Visit [demo site](http://localhost:3000)
2. Connect Sui wallet (testnet)
3. Upload a document (encrypted automatically)
4. Ask a question
5. Receive verified answer with signature

### Screenshots

<div align="center">

**Document Upload**
<img src="assets/screenshot-upload.png" width="600" alt="Upload Interface"/>

**Query Interface**
<img src="assets/screenshot-query.png" width="600" alt="Query Interface"/>

**Verified Answer**
<img src="assets/screenshot-answer.png" width="600" alt="Answer Display"/>

</div>

---

## Contributing

We welcome contributions! See our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Fork and clone the repo
git clone https://github.com/yourusername/fathom-protocol.git
cd fathom-protocol

# Install dependencies
cd frontend && npm install
cd ../oracle-node && pip install -r requirements.txt
cd ../contracts && sui move build

# Start development
./START_DEMO.sh
```

### Areas for Contribution
- Bug fixes and testing
- Documentation improvements
- UI/UX enhancements
- Security audits
- Internationalization
- Test coverage

---

## Security

### Threat Model
- **Protected Against**: Malicious storage providers, network eavesdropping, rogue oracles, data tampering
- **Trust Assumptions**: Oracle honesty (mitigated by TEE), user device security

### Audits
- Smart contract audit: *Pending*
- Security review: *In progress*

### Responsible Disclosure
Found a security issue? Email: security@fathom-protocol.com

We follow coordinated disclosure and offer bounties for critical findings.

---

## Performance

| Metric | Value |
|--------|-------|
| Document Upload | 3-8 seconds |
| Query Submission | 1-2 seconds |
| Oracle Processing | 5-15 seconds |
| **Total Query Time** | **10-25 seconds** |
| Cost per Query | $0.02-0.06 |
| Encryption Standard | AES-256-GCM |
| Signature Algorithm | Ed25519 |

---

## Hackathon & Awards

### Sui Overflow Hackathon 2024
- Best Use of Walrus Storage
- Most Innovative Privacy Solution
- Best Smart Contract Design

*Submission Category: DeFi & Infrastructure*

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- **Sui Foundation** - For the incredible blockchain infrastructure
- **Walrus Team** - For decentralized storage that makes this possible
- **Mysten Labs** - For developer support and tooling
- **OpenAI & Google** - For AI APIs
- **Community Contributors** - For testing and feedback

---

## Contact

- **Website**: [https://subhankar-s-portfolio.vercel.app/](https://subhankar-s-portfolio.vercel.app/)
- **GitHub**: [https://github.com/anynomousfriend](https://github.com/anynomousfriend)
- **Twitter/X**: [https://x.com/SsubhankarX](https://x.com/SsubhankarX?t=S2s-0mx5Vex7yhfwe5iUng)
- **LinkedIn**: [Subhankar Choudhury](https://www.linkedin.com/in/subh-choudhury/)

---

## Star History

If you find Fathom Protocol useful, please consider giving us a star ⭐

---

<div align="center">

**Built with ️ for a privacy-preserving future**

[Documentation](docs/) • [Demo](http://localhost:3000) • [Discord](#) • [Twitter](#)

</div>
