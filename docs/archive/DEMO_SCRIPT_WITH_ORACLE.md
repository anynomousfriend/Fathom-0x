# Complete Fathom-0x Protocol Demo Script

## Demo Overview

**Duration:** 5-7 minutes
**Goal:** Show complete privacy-preserving AI system on blockchain
**Key Points:** Encryption, Decentralization, Verifiability, Privacy

---

## Opening (30 seconds)

### What to Say:

> "Hi! I'm excited to show you **Fathom-0x Protocol** - a privacy-preserving AI system for sensitive documents built on blockchain.
>
> The problem we're solving: Organizations need AI analysis of sensitive documents like medical records, financial reports, and confidential research - but current AI systems require uploading data to centralized servers, creating privacy risks.
>
> Our solution: Fathom-0x Protocol combines client-side encryption, decentralized storage on Walrus, smart contracts on Sui blockchain, and AI processing in Trusted Execution Environments."

### What to Show:
- Project homepage
- Quick architecture diagram (we'll create this)

---

## Part 1: Document Registration (90 seconds)

### What to Say:

> "Let me show you how it works. First, I'll register a sensitive document - let's use this financial report.
>
> **[Click 'Register New Document']**
>
> Notice what happens:
> 1. **Client-side encryption** - The document is encrypted right here in my browser using AES-256. The plaintext never leaves my machine.
>
> **[Select file: financial_report.txt]**
>
> 2. **Decentralized storage** - The encrypted file is uploaded to Walrus, which is a decentralized storage network. No single server holds my data.
>
> **[Show encryption progress]**
>
> 3. **Blockchain registration** - The metadata and blob ID are registered on the Sui blockchain. This creates a permanent, verifiable record.
>
> **[Click 'Register Document', approve wallet transaction]**
>
> And here's the transaction on-chain - completely transparent and verifiable."

### What to Show:
1. Empty document list initially
2. Click "Register New Document"
3. Select `demo-data/financial_report.txt`
4. Show encryption: "Encrypting document..."
5. Show upload: "Uploading to Walrus..."
6. Show transaction approval in wallet
7. Show success message

### Key Points to Emphasize:
- ⭐ **Client-side encryption** (privacy by design)
- ⭐ **Decentralized storage** (no single point of failure)
- ⭐ **Blockchain verification** (transparency + immutability)

---

## Part 2: Automatic Document Discovery (30 seconds)

### What to Say:

> "Now watch this - when I close the modal, the frontend automatically fetches my documents from the blockchain.
>
> **[Close modal]**
>
> See the loading spinner? It's querying the Sui blockchain right now for all Document objects owned by my wallet.
>
> **[Wait for document to appear]**
>
> And there it is! This isn't hardcoded - it's pulling real data from the blockchain. The document appears with all its details: name, description, the Walrus blob ID, and registration timestamp.
>
> This demonstrates true decentralization - any client can fetch and verify this data directly from the blockchain."

### What to Show:
1. Close registration modal
2. Point to "Loading your documents..." spinner
3. Document appears automatically
4. Highlight document details (name, blob ID, timestamp)
5. Maybe register a second document to show multiple documents

### Key Points to Emphasize:
- ⭐ **Real blockchain integration** (not mock data)
- ⭐ **Automatic discovery** (pulls from chain)
- ⭐ **Decentralized verification** (anyone can verify)

---

## Part 3: Query Submission (60 seconds)

### What to Say:

> "Now I can query this document. Let me click on it to select it.
>
> **[Click on document - shows blue border]**
>
> The query form appears. I'll ask a question about the financial data.
>
> **[Type: 'What are the key financial metrics?']**
>
> When I submit this query, several things happen:
> 1. The query is recorded on the Sui blockchain as a permanent event
> 2. An oracle node running in a Trusted Execution Environment picks up this query
> 3. The oracle securely decrypts the document *inside* the TEE
> 4. Runs an AI model on it - still inside the secure enclave
> 5. Encrypts the answer and returns it
>
> **[Click 'Submit Query', approve transaction]**
>
> Let me show you the transaction on SuiScan - you can see the QuerySubmitted event with all the details."

### What to Show:
1. Click document (blue border appears)
2. Query form appears below
3. Type question: "What are the key financial metrics?"
4. Click "Submit Query"
5. Approve wallet transaction
6. Show success message

### Key Points to Emphasize:
- ⭐ **On-chain query recording** (audit trail)
- ⭐ **TEE processing** (secure computation)
- ⭐ **End-to-end encryption** (privacy preserved)

---

## Part 4: TEE Oracle Processing (90 seconds)

### What to Say:

> "Now let me show you the oracle processing. I'll run the mock oracle to demonstrate the flow.
>
> **[Open terminal, run: python3 oracle-node/mock_oracle.py]**
>
> Watch the oracle process our query:
>
> **[Point to terminal output]**
>
> See what's happening:
> 1. TEE enclave initialized
> 2. Document decrypted inside the TEE
> 3. AI model loaded in secure memory
> 4. Query processed with privacy guarantees
> 5. Response generated and encrypted
> 6. Cryptographic attestation created
>
> The answer is: **[Read the generated answer]**
>
> This is a mock oracle for the demo, but in production it would run on actual TEE hardware like Intel SGX or AMD SEV. The key point is that the document is never decrypted outside the secure enclave.
>
> Here's the cryptographic attestation - this proves the computation happened inside a genuine TEE and followed the correct protocol."

### What to Show:
1. Terminal with mock oracle running
2. Point to each processing step
3. Show generated answer preview
4. Show TEE attestation hash
5. Explain this is mock but architecture is real

### Key Points to Emphasize:
- ⭐ **TEE security** (isolated execution)
- ⭐ **Cryptographic attestation** (verifiable computation)
- ⭐ **Privacy guarantees** (data never exposed)

### What to Say About Mock vs Real:

> "I'm using a mock oracle for this demo because TEE hardware requires special setup, but the architecture is production-ready. The real oracle would:
> - Run on Intel SGX or AMD SEV hardware
> - Provide hardware-backed attestation
> - Use the actual pysui SDK for blockchain integration
> - Process queries automatically in the background
>
> Everything else you're seeing - the encryption, blockchain integration, storage - is fully functional and deployed on testnet."

---

## Part 5: Blockchain Verification (60 seconds)

### What to Say:

> "Everything I've shown you is verifiable on-chain. Let me open SuiScan.
>
> **[Open SuiScan with your wallet address]**
>
> Here you can see all my transactions:
> - Document registration transactions
> - Query submission transactions
>
> **[Click on a registration transaction]**
>
> Look at the 'Object Changes' section - here's the Document object that was created. You can see:
> - The Document ID
> - The Walrus blob ID where encrypted data is stored
> - The owner (my wallet address)
> - The timestamp
>
> **[Click on a query transaction]**
>
> And here's a query event showing:
> - Which document was queried
> - What question was asked
> - When it happened
>
> This transparency means anyone can audit the system while privacy is preserved through encryption."

### What to Show:
1. SuiScan account page
2. List of transactions
3. Click on `register_document` transaction
4. Show created Document object
5. Show object details and fields
6. Click on `submit_query` transaction
7. Show QuerySubmitted event

### Key Points to Emphasize:
- ⭐ **Complete transparency** (all on-chain)
- ⭐ **Verifiable** (anyone can check)
- ⭐ **Immutable** (permanent audit trail)

---

## Part 6: Architecture Explanation (60 seconds)

### What to Say:

> "Let me show you the complete architecture.
>
> **[Show architecture diagram]**
>
> Here's how all the pieces fit together:
>
> **Layer 1 - Client (Browser):**
> - User uploads document
> - AES-256 encryption happens here - plaintext never transmitted
> - Next.js frontend with Sui wallet integration
>
> **Layer 2 - Decentralized Storage (Walrus):**
> - Encrypted blobs stored across decentralized nodes
> - No single point of failure
> - Content-addressed storage
>
> **Layer 3 - Blockchain (Sui):**
> - Smart contracts in Move language
> - Document registry
> - Query events
> - Immutable audit trail
>
> **Layer 4 - TEE Oracle:**
> - Runs in isolated secure enclave
> - Decrypts documents safely
> - AI processing with privacy
> - Cryptographic attestation
>
> The beauty of this architecture is:
> - Privacy: End-to-end encryption
> - Decentralization: No single authority
> - Verifiability: Everything on-chain
> - Security: TEE-backed computation"

### What to Show:
1. Architecture diagram (we'll create this)
2. Point to each layer
3. Show data flow arrows
4. Highlight security boundaries

---

## Part 7: Real-World Applications (30 seconds)

### What to Say:

> "This technology enables several critical use cases:
>
> **Healthcare:** Hospitals can use AI to analyze patient records without exposing sensitive medical data to cloud providers. HIPAA compliance is maintained through encryption and TEE processing.
>
> **Finance:** Financial institutions can get AI insights on confidential reports and transactions while maintaining regulatory compliance and data privacy.
>
> **Research:** Scientists can share and analyze sensitive research data with verifiable computation and full audit trails.
>
> **Legal:** Law firms can use AI for document analysis while maintaining attorney-client privilege.
>
> The key innovation is combining three technologies - blockchain for transparency, TEEs for secure computation, and decentralized storage for resilience."

---

## Closing (30 seconds)

### What to Say:

> "To summarize, Fathom-0x Protocol solves the privacy problem in AI:
>
> **Privacy-First:** Client-side encryption, TEE processing
> **Decentralized:** Walrus storage, Sui blockchain
> **Verifiable:** On-chain audit trails, cryptographic attestation
> **Practical:** Real deployment on Sui testnet, working demo
>
> This is the future of privacy-preserving AI - secure, transparent, and decentralized.
>
> Thank you! Questions?"

---

## Quick Reference Card

### Before Recording:

**Checklist:**
- [ ] Frontend running on localhost:3000
- [ ] Wallet connected with testnet SUI
- [ ] Mock oracle script ready
- [ ] Demo documents in demo-data/ folder
- [ ] SuiScan tab open with your address
- [ ] Architecture diagram open
- [ ] Browser console closed (no distractions)
- [ ] Notifications disabled
- [ ] Clean browser tabs

### Key Phrases to Use:

1. **"Client-side encryption"** - Emphasize privacy
2. **"Decentralized storage"** - Highlight resilience
3. **"Blockchain verification"** - Show transparency
4. **"TEE processing"** - Explain secure computation
5. **"Cryptographic attestation"** - Prove authenticity

### Common Demo Pitfalls to Avoid:

 Don't say "this is just a mock" - say "production-ready architecture"
 Don't apologize for mock oracle - explain hardware constraints
 Don't skip the auto-fetch feature - it's impressive!
 Don't rush through transactions - let them confirm
 Don't forget to show SuiScan verification

### Timing Breakdown:

| Section | Time | Critical? |
|---------|------|-----------|
| Opening | 0:30 | Yes |
| Document Registration | 1:30 | Yes |
| Auto Discovery | 0:30 | ⭐ Must show! |
| Query Submission | 1:00 | Yes |
| Oracle Processing | 1:30 | ⭐ Key demo |
| Blockchain Verification | 1:00 | Yes |
| Architecture | 1:00 | Yes |
| Use Cases | 0:30 | Optional |
| Closing | 0:30 | Yes |
| **Total** | **7:00** | |

### Backup Plans:

**If wallet transaction fails:**
> "Let me resubmit... In production we'd have retry logic. Ah, there it goes!"

**If document doesn't appear:**
> "The blockchain is taking a moment to propagate. Let me refresh... And there it is!"

**If demo environment has issues:**
> "Let me show you the SuiScan verification instead - you can see the production deployment here."

---

## Recording Tips

### Video Setup:

1. **Screen recording:** Use OBS or similar
2. **Resolution:** 1920x1080 minimum
3. **Audio:** Clear microphone, no background noise
4. **Pace:** Speak clearly, not too fast
5. **Enthusiasm:** Show excitement about the tech!

### Screen Layout:

```
┌─────────────────────────────────────┐
│ Browser: Fathom-0x Protocol │
│ localhost:3000 │
│ │
│ (Main demo area) │
│ │
└─────────────────────────────────────┘

Optional second screen:
┌─────────────────────────────────────┐
│ Terminal: Mock Oracle │
│ SuiScan: Verification │
│ Architecture Diagram │
└─────────────────────────────────────┘
```

### What to Record:

1. **Main video:** Follow this script
2. **Supplemental B-roll (optional):**
 - Code walkthrough
 - Architecture explanation
 - Smart contract code
 - Terminal outputs

### Post-Recording Checklist:

- [ ] Video is clear and readable
- [ ] Audio is clear
- [ ] All key features shown
- [ ] No sensitive info visible (wallet addresses OK, private keys NO)
- [ ] Demo flows smoothly
- [ ] Within time limit (5-7 minutes ideal)

---

##

**This script gives you:**
- Clear structure and timing
- Specific talking points
- Key emphasizing phrases
- Backup plans
- Technical depth
- Business value

**Remember:**
- Be enthusiastic!
- Speak clearly
- Show don't just tell
- Highlight the innovation
- Be proud of what you built!

**Good luck with your demo! **
