# Fathom Protocol - Technical Architecture & Implementation

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Components](#architecture-components)
3. [Technical Stack](#technical-stack)
4. [Implementation Details](#implementation-details)
5. [Privacy & Security Model](#privacy--security-model)
6. [Design Decisions](#design-decisions)
7. [Integration Guides](#integration-guides)

---

## System Overview

**Fathom Protocol** is a privacy-preserving Retrieval-Augmented Generation (RAG) system built on the Sui blockchain. It enables users to query private documents using AI without exposing raw data to any party, including the AI provider.

### Core Innovation

Traditional RAG systems force a compromise: either send your data to AI providers (losing privacy) or run models locally (losing AI capabilities). Fathom Protocol eliminates this tradeoff through:

- **Client-side encryption** - Documents encrypted before upload
- **Decentralized storage** - Data stored on Walrus (Sui's storage layer)
- **Verifiable computation** - Oracle nodes provide cryptographically signed answers
- **Blockchain verification** - All operations recorded on-chain for auditability

---

## Architecture Components

### 1. Smart Contract Layer (Sui Move)

**File**: `contracts/sources/fathom.move`

The smart contract manages the protocol's core logic:

```move
/// Main configuration object for the Fathom protocol
public struct FathomConfig has key {
 id: UID,
 oracle_address: address,
 document_count: u64,
}

/// Represents a document stored on Walrus
public struct Document has key, store {
 id: UID,
 walrus_blob_id: String,
 owner: address,
 name: String,
 description: String,
 created_at: u64,
}

/// Represents a query submitted by a user
public struct Query has key, store {
 id: UID,
 document_id: ID,
 question: String,
 requester: address,
 answered: bool,
 answer: String,
 signature: vector<u8>,
 timestamp: u64,
}
```

**Key Functions**:

- `init()` - Initialize protocol with oracle address
- `register_document()` - Register encrypted document on-chain
- `submit_query()` - User submits a question about their document
- `submit_answer()` - Oracle submits cryptographically signed answer
- `update_oracle()` - Admin function to change oracle address

**Events**:
- `DocumentRegistered` - Emitted when new document added
- `QuerySubmitted` - Emitted when user asks a question
- `AnswerProvided` - Emitted when oracle responds

### 2. Frontend Application (Next.js + TypeScript)

**Directory**: `frontend/`

Built with:
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Sui dApp Kit** - Wallet integration and blockchain interaction
- **TailwindCSS** - Modern, responsive UI
- **Framer Motion** - Smooth animations

**Key Components**:

- `Header.tsx` - Navigation with wallet connection
- `DocumentList.tsx` - Browse registered documents
- `RegisterDocumentModal.tsx` - Upload and encrypt documents
- `QueryForm.tsx` - Submit questions to documents
- `AnswerDisplay.tsx` - Display verified answers with signatures
- `LandingPage.tsx` - Hero section with project introduction

**Encryption Implementation** (`frontend/src/lib/encryption.ts`):

```typescript
// Client-side AES-256-GCM encryption
export async function encryptFile(file: File): Promise<{
 encryptedData: ArrayBuffer
 key: CryptoKey
 iv: Uint8Array
}> {
 const data = await file.arrayBuffer()
 const key = await crypto.subtle.generateKey(
 { name: 'AES-GCM', length: 256 },
 true,
 ['encrypt', 'decrypt']
 )
 const iv = crypto.getRandomValues(new Uint8Array(12))
 const encryptedData = await crypto.subtle.encrypt(
 { name: 'AES-GCM', iv },
 key,
 data
 )
 return { encryptedData, key, iv }
}
```

### 3. Oracle Node (Python)

**File**: `oracle-node/oracle_node.py`

The oracle bridges blockchain and AI services:

**Responsibilities**:
1. Listen for `QuerySubmitted` events on Sui blockchain
2. Fetch encrypted documents from Walrus storage
3. Decrypt documents using keys from blockchain
4. Process queries with AI (OpenAI/Gemini/Local models)
5. Sign answers cryptographically
6. Submit verified answers back to blockchain

**Key Features**:
- Event polling from Sui RPC
- Walrus HTTP API integration with CLI fallback
- RAG processing with vector embeddings
- Ed25519 signature generation
- Error handling and retry logic

### 4. Storage Layer (Walrus)

Walrus is Sui's decentralized storage network:

**Integration** (`frontend/src/lib/walrus.ts`):

```typescript
export async function uploadToWalrus(
 encryptedFile: ArrayBuffer
): Promise<string> {
 const blob = new Blob([encryptedFile])
 const formData = new FormData()
 formData.append('file', blob)

 const response = await fetch(
 `${WALRUS_AGGREGATOR_URL}/v1/store`,
 {
 method: 'PUT',
 body: formData,
 }
 )

 const result = await response.json()
 return result.newlyCreated?.blobObject?.blobId ||
 result.alreadyCertified?.blobId
}
```

**Features**:
- Content-addressed storage
- Erasure coding for redundancy
- HTTP aggregator for easy access
- CLI tool for advanced operations
- Testnet availability for development

---

## Technical Stack

### Blockchain Layer
- **Sui Network** - High-performance L1 blockchain
- **Move Language** - Safe, resource-oriented smart contract language
- **Sui TypeScript SDK** - `@mysten/sui.js` for frontend integration

### Storage Layer
- **Walrus Testnet** - Decentralized blob storage
- **HTTP Aggregator** - REST API for storage operations
- **CLI Tool** - Command-line interface for direct uploads

### Frontend Stack
- **Next.js 14.0.3** - React framework with App Router
- **TypeScript 5.3.2** - Type safety
- **Sui dApp Kit 0.11.0** - Wallet integration
- **TailwindCSS 3.3.6** - Utility-first CSS
- **Framer Motion** - Animation library
- **Web Crypto API** - Browser-native encryption

### Backend Stack
- **Python 3.12** - Oracle implementation
- **Flask** - RAG API server
- **pysui** - Sui Python SDK
- **OpenAI API** - for AI queries
- **Google Gemini** - Alternative AI provider
- **ChromaDB** - Vector database for embeddings
- **LangChain** - RAG framework

---

## Implementation Details

### Document Registration Flow

1. **User selects file** in frontend
2. **Client generates AES-256 key** using Web Crypto API
3. **File encrypted** with AES-GCM mode
4. **Encrypted blob uploaded** to Walrus
 - HTTP API attempt first
 - CLI fallback if HTTP fails (testnet reliability)
5. **Blob ID returned** from Walrus
6. **Transaction submitted** to Sui smart contract
7. **Document object created** on-chain with:
 - Walrus blob ID
 - Owner address
 - Metadata (name, description)
 - Timestamp
8. **Encryption key stored** locally (browser localStorage)

### Query Processing Flow

1. **User selects document** from their list
2. **User enters question** in query form
3. **Transaction submitted** to smart contract
4. **QuerySubmitted event** emitted on-chain
5. **Oracle detects event** via RPC polling
6. **Oracle fetches encrypted blob** from Walrus
7. **Oracle retrieves decryption key** (stored on-chain for hackathon)
8. **Document decrypted** by oracle
9. **RAG processing**:
 - Document chunked into segments
 - Embeddings generated with OpenAI/Gemini
 - Vector similarity search
 - Context injected into AI prompt
 - AI generates answer
10. **Answer signed** with oracle's private key (Ed25519)
11. **Answer submitted** back to blockchain
12. **AnswerProvided event** emitted
13. **Frontend displays** verified answer with signature

### RAG Implementation

**File**: `oracle-node/simple_rag_api.py`

```python
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.chat_models import ChatOpenAI

def process_rag_query(document_text: str, question: str) -> str:
 # Split document into chunks
 text_splitter = RecursiveCharacterTextSplitter(
 chunk_size=1000,
 chunk_overlap=200
 )
 chunks = text_splitter.split_text(document_text)

 # Generate embeddings
 embeddings = OpenAIEmbeddings()
 vectorstore = Chroma.from_texts(chunks, embeddings)

 # Similarity search
 relevant_docs = vectorstore.similarity_search(question, k=3)
 context = "\n\n".join([doc.page_content for doc in relevant_docs])

 # Generate answer
 llm = ChatOpenAI(model="", temperature=0)
 prompt = f"""Based on the following context, answer the question.

Context:
{context}

Question: {question}

Answer:"""

 return llm.predict(prompt)
```

### Encryption & Key Management

**Current Implementation** (Hackathon):
- Keys stored in browser localStorage
- Decryption keys shared with oracle via on-chain storage

**Production Roadmap**:
- **TEE Integration** - Oracle runs in Trusted Execution Environment
- **Key Escrow** - Encrypted key shares distributed to multiple oracles
- **Threshold Signatures** - Multi-oracle consensus required
- **Hardware Security Modules** - Key material never in memory

### Signature Verification

Oracle signs answers using Ed25519:

```python
import hashlib
import ed25519

def sign_answer(answer: str, private_key: bytes) -> bytes:
 # Hash the answer
 message_hash = hashlib.sha256(answer.encode()).digest()

 # Sign with private key
 signing_key = ed25519.SigningKey(private_key)
 signature = signing_key.sign(message_hash)

 return signature
```

Frontend verifies signatures:

```typescript
async function verifySignature(
 answer: string,
 signature: Uint8Array,
 publicKey: Uint8Array
): Promise<boolean> {
 const encoder = new TextEncoder()
 const message = encoder.encode(answer)

 const messageHash = await crypto.subtle.digest('SHA-256', message)

 const key = await crypto.subtle.importKey(
 'raw',
 publicKey,
 { name: 'Ed25519' },
 false,
 ['verify']
 )

 return await crypto.subtle.verify(
 'Ed25519',
 key,
 signature,
 messageHash
 )
}
```

---

## Privacy & Security Model

### Data Flow Privacy

**What Oracle Sees**:
- Encrypted documents (binary blobs)
- Questions (necessary for answering)
- Decrypted documents (in TEE/secure enclave)

**What Oracle Never Sees**:
- Raw documents before encryption
- Encryption keys (in production TEE model)
- User identity (blockchain pseudonymous)

**What Blockchain Sees**:
- Document metadata (name, description)
- Walrus blob IDs
- Questions and answers
- Timestamps and signatures

**What Blockchain Never Sees**:
- Raw document content
- Encryption keys (production model)

### Threat Model

**Protected Against**:
- Malicious storage providers (data encrypted)
- Network eavesdropping (end-to-end encryption)
- Rogue oracles (signatures prove authenticity)
- Data tampering (blockchain immutability)

**Assumed Trust**:
- Oracle processes queries honestly (mitigated by TEE)
- AI provider (OpenAI/Gemini) respects privacy
- User's browser/device is secure

**Production Mitigations**:
- **TEE/SGX** - Oracle runs in secure enclave
- **Attestation** - Cryptographic proof of correct execution
- **Multi-oracle** - Consensus mechanism
- **On-device AI** - Optional local model support

---

## Design Decisions

### Why Sui?

**Chosen for**:
- **High throughput** - Handles frequent query submissions
- **Low latency** - Fast finality for better UX
- **Object model** - Natural fit for document ownership
- **Move language** - Safety guarantees for asset handling
- **Walrus integration** - Native storage layer

**Alternatives Considered**:
- **Ethereum** - Too expensive for frequent operations
- **Solana** - Less mature tooling for storage
- **Cosmos** - More complex for single-app use case

### Why Walrus?

**Chosen for**:
- **Native Sui integration** - First-class support
- **Content addressing** - Immutable blob IDs
- **Erasure coding** - Redundancy without replication
- **Cost effective** - Lower storage costs than on-chain
- **HTTP API** - Easy integration

**Alternatives Considered**:
- **IPFS** - More complex pinning requirements
- **Arweave** - Higher costs, different model
- **Filecoin** - Complex retrieval mechanisms

### Why Client-Side Encryption?

**Chosen for**:
- **Zero-trust model** - No server access to keys
- **Browser native** - Web Crypto API standard
- **Performance** - AES-GCM hardware accelerated
- **Simplicity** - No key server infrastructure

**Alternatives Considered**:
- **Proxy Re-encryption** - Complex key management
- **Homomorphic Encryption** - Performance overhead
- **Secure Multi-Party Computation** - Requires multiple parties

### Why Python for Oracle?

**Chosen for**:
- **Rich AI ecosystem** - LangChain, OpenAI, Gemini
- **Rapid development** - Quick iteration for hackathon
- **Library support** - ChromaDB, numpy, pandas
- **pysui SDK** - Official Sui Python support

**Alternatives Considered**:
- **Rust** - Better performance, harder to prototype
- **Node.js** - Less mature AI libraries
- **Go** - Limited ML/AI ecosystem

### RAG Architecture

**Why Vector Embeddings?**:
- Semantic search vs keyword matching
- Better context retrieval
- Handles synonyms and paraphrasing

**Why ChromaDB?**:
- Lightweight, embeddable
- No separate database server
- Fast similarity search
- Easy LangChain integration

**Why ?**:
- Best answer quality
- Good context understanding
- Reliable API
- Fallback to Gemini available

---

## Integration Guides

### Walrus Integration

**HTTP Upload** (Primary Method):

```typescript
const response = await fetch(
 `${WALRUS_AGGREGATOR}/v1/store?epochs=5`,
 {
 method: 'PUT',
 body: encryptedFile,
 }
)
```

**CLI Upload** (Fallback):

```bash
walrus store encrypted_file.enc --epochs 5
```

**Download**:

```typescript
const response = await fetch(
 `${WALRUS_AGGREGATOR}/v1/${blobId}`
)
const data = await response.arrayBuffer()
```

**Key Points**:
- Testnet can be unreliable - always have CLI fallback
- Blob IDs are content-addressed (SHA-256)
- Epochs determine storage duration
- HTTP aggregator simplifies integration

### Sui Smart Contract Deployment

```bash
cd contracts
sui move build
sui client publish --gas-budget 100000000
```

**Environment Setup**:

```bash
# scripts/.env
SUI_PRIVATE_KEY=suiprivkey...
PACKAGE_ID=0x...
CONFIG_OBJECT_ID=0x...
```

### Oracle Configuration

```bash
cd oracle-node
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# .env
ORACLE_PRIVATE_KEY=your_private_key
CONTRACT_PACKAGE_ID=0x...
CONFIG_OBJECT_ID=0x...
OPENAI_API_KEY=sk-...
WALRUS_AGGREGATOR_URL=https://aggregator.walrus-testnet.walrus.space
```

**Start Oracle**:

```bash
python oracle_node.py
```

### Frontend Configuration

```bash
cd frontend
npm install

# .env.local
NEXT_PUBLIC_SUI_NETWORK=testnet
NEXT_PUBLIC_CONTRACT_PACKAGE_ID=0x...
NEXT_PUBLIC_CONFIG_OBJECT_ID=0x...
NEXT_PUBLIC_WALRUS_AGGREGATOR=https://aggregator.walrus-testnet.walrus.space
```

**Development**:

```bash
npm run dev
# http://localhost:3000
```

**Production Build**:

```bash
npm run build
npm start
```

---

## Performance Characteristics

### Transaction Costs

- Document registration: ~0.1 SUI (~$0.01)
- Query submission: ~0.05 SUI (~$0.005)
- Answer submission (oracle): ~0.05 SUI

### Latency

- Document upload: 2-5 seconds (encryption + Walrus)
- Query submission: 1-2 seconds (blockchain finality)
- Oracle processing: 5-15 seconds (download + AI + signature)
- Total query time: 7-20 seconds end-to-end

### Scalability

- **Current**: Single oracle, sequential processing
- **Potential**:
 - Multi-oracle parallel processing
 - Batch answer submissions
 - Local caching of frequently accessed docs
 - Could handle 100+ queries/minute with optimization

---

## Future Enhancements

### Phase 1: TEE Integration (Q1 2025)
- Deploy oracle in Intel SGX or AMD SEV
- Implement attestation verification
- Remote attestation on-chain

### Phase 2: Multi-Oracle Consensus (Q2 2025)
- Multiple oracle nodes
- Threshold signatures (3-of-5)
- Slashing for incorrect answers
- Staking mechanism

### Phase 3: Advanced Privacy (Q3 2025)
- Proxy re-encryption for key management
- Zero-knowledge proofs for query verification
- Differential privacy for answer generation

### Phase 4: Enterprise Features (Q4 2025)
- Team/organization support
- Access control lists
- Audit logging
- SLA guarantees
- Dedicated oracle instances

---

## Technical References

- **Sui Documentation**: https://docs.sui.io
- **Walrus Documentation**: https://docs.walrus.site
- **Move Language Book**: https://move-book.com
- **Web Crypto API**: https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API
- **LangChain Docs**: https://python.langchain.com
- **ChromaDB Docs**: https://docs.trychroma.com

---

*Last Updated: November 2024*
*Version: 1.0.0*
*License: MIT*
