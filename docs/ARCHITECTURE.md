# Fathom Protocol Architecture

## Overview

Fathom Protocol implements a verifiable RAG (Retrieval-Augmented Generation) system for private data using decentralized storage and blockchain-based verification.

## System Components

### 1. Walrus Storage Layer
**Purpose:** Decentralized blob storage for encrypted documents

**Key Features:**
- Content-addressed storage
- High availability through redundancy
- Immutable data storage
- Efficient retrieval through aggregators

**Integration:**
- Documents uploaded via Walrus CLI/API
- Blob IDs stored on-chain as references
- Oracle fetches documents using Blob IDs
- No centralized storage dependencies

### 2. Sui Smart Contract Layer
**Purpose:** On-chain coordination and verification

**Components:**

#### FathomConfig
- Global configuration object
- Stores oracle address
- Tracks document count
- Shared object for public access

#### Document Objects
- Represents registered documents
- Links to Walrus Blob ID
- Owner information
- Metadata (name, description, timestamps)

#### Query Objects
- User-submitted queries
- Links to document
- Tracks answer status
- Stores verified signatures

**Functions:**
- `register_document()` - Register new document
- `submit_query()` - Submit query request
- `submit_answer()` - Oracle submits verified answer
- `update_oracle()` - Admin updates oracle address

**Events:**
- `DocumentRegistered` - New document added
- `QuerySubmitted` - New query created
- `InsightGenerated` - Answer provided

### 3. Oracle Node Layer
**Purpose:** Verifiable computation bridge

**Architecture:**
```
┌─────────────────────────────────────┐
│         Oracle Node                 │
│                                     │
│  ┌──────────────────────────────┐  │
│  │   Event Listener             │  │
│  │   (Sui WebSocket/Polling)    │  │
│  └────────────┬─────────────────┘  │
│               │                     │
│  ┌────────────▼─────────────────┐  │
│  │   Query Processor            │  │
│  │   • Fetch from Walrus        │  │
│  │   • Run AI inference         │  │
│  │   • Generate signature       │  │
│  └────────────┬─────────────────┘  │
│               │                     │
│  ┌────────────▼─────────────────┐  │
│  │   Transaction Builder        │  │
│  │   (Submit to Sui)            │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
```

**Future TEE Integration:**
- Hardware-based attestation
- Sealed computation environment
- Cryptographic proof of execution
- Integration with Nautilus Chain

### 4. Frontend Layer
**Purpose:** User interface for interactions

**Technology Stack:**
- Next.js 14 (React framework)
- @mysten/dapp-kit (Sui wallet integration)
- TailwindCSS (styling)
- TypeScript (type safety)

**Features:**
- Wallet connection (Sui Wallet, Ethos, Suiet)
- Document registration
- Query submission
- Real-time answer display
- Transaction verification

## Data Flow

### Query Processing Flow

```
1. User Submits Query
   │
   ├─→ Frontend validates input
   │
   └─→ Creates transaction
       │
       └─→ Calls: submit_query(document, question)

2. Smart Contract Processing
   │
   ├─→ Creates Query object
   │
   ├─→ Emits QuerySubmitted event
   │
   └─→ Returns query_id

3. Oracle Detection
   │
   ├─→ Event listener catches QuerySubmitted
   │
   └─→ Extracts: query_id, document_id, question

4. Oracle Processing
   │
   ├─→ Fetches document from Walrus (via Blob ID)
   │
   ├─→ Processes query with AI (RAG pipeline)
   │
   ├─→ Generates answer
   │
   └─→ Creates cryptographic signature

5. Answer Submission
   │
   ├─→ Oracle creates transaction
   │
   ├─→ Calls: submit_answer(query, answer, signature)
   │
   └─→ Emits InsightGenerated event

6. Frontend Display
   │
   ├─→ Polls for InsightGenerated event
   │
   ├─→ Retrieves answer and signature
   │
   └─→ Displays verified result to user
```

## Security Model

### Data Privacy
- **At Rest:** Documents encrypted on Walrus
- **In Transit:** HTTPS/WSS for all communications
- **In Processing:** TEE isolation (future)

### Verification
- **Signature:** Oracle signs all answers
- **On-Chain:** All transactions recorded
- **Immutable:** Historical audit trail

### Access Control
- **Document Ownership:** Only owners can update
- **Oracle Authorization:** Only registered oracle can submit
- **Admin Functions:** Protected by AdminCap

## Scalability Considerations

### Current Architecture (Hackathon)
- Single oracle node
- Polling for events
- Synchronous processing

### Production Architecture (Future)
- **Multiple Oracle Nodes:**
  - Consensus mechanism
  - Load balancing
  - Failover support

- **Event Processing:**
  - WebSocket subscriptions
  - Message queue integration
  - Parallel processing

- **Caching Layer:**
  - Frequently accessed documents
  - Pre-computed embeddings
  - Query result caching

## Technology Integration

### How Fathom Uses Walrus
1. **Document Storage:** All sensitive documents stored as Walrus blobs
2. **Content Addressing:** Blob IDs provide immutable references
3. **Decentralization:** No single point of failure for data
4. **Efficient Retrieval:** Aggregator network for fast access

### How Fathom Uses Sui
1. **Smart Contracts:** Document registry and query coordination
2. **Event System:** Real-time oracle notifications
3. **Object Model:** Natural representation of documents/queries
4. **Gas Efficiency:** Optimized Move code for low costs

### How Fathom Uses Nautilus Concepts
1. **Mock TEE:** Current oracle demonstrates TEE architecture
2. **Verifiable Computation:** Signatures prove computation integrity
3. **Future Integration:** Path to full TEE deployment
4. **Privacy Preservation:** Computation without data exposure

## Gas Optimization

### Contract Design
- Shared objects for configuration (no transfer costs)
- Minimal storage in objects
- Efficient event emission
- Batch operations where possible

### Estimated Costs (Testnet)
- Document registration: ~0.001 SUI
- Query submission: ~0.0008 SUI
- Answer submission: ~0.001 SUI

## Future Enhancements

### Phase 1: Production Hardening
- [ ] Multiple oracle nodes with consensus
- [ ] WebSocket event subscriptions
- [ ] Comprehensive error handling
- [ ] Rate limiting and DoS protection

### Phase 2: Advanced Features
- [ ] Vector embeddings for semantic search
- [ ] Multi-document knowledge bases
- [ ] Support for various AI models
- [ ] Query result caching

### Phase 3: Decentralization
- [ ] Full TEE integration with Nautilus
- [ ] Decentralized oracle network
- [ ] On-chain governance
- [ ] Staking mechanisms for oracles

### Phase 4: Scale
- [ ] High-throughput query processing
- [ ] Cross-chain integration
- [ ] Enterprise features
- [ ] Mobile applications

## Development Notes

### Testing Strategy
1. **Unit Tests:** Individual contract functions
2. **Integration Tests:** Full flow testing
3. **Load Tests:** Scalability verification
4. **Security Audits:** Professional review

### Monitoring
- Oracle health checks
- Query processing metrics
- Gas usage tracking
- Error rate monitoring

### Deployment
- Testnet: For development and demos
- Mainnet: After security audit
- Multi-region: For oracle redundancy

---

For technical questions, see [CONTRIBUTING.md](CONTRIBUTING.md)
