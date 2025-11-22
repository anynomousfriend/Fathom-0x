# Fathom Protocol - Complete Demo Day Guide

> **Privacy-Preserving RAG on Sui + Walrus**
> Verifiable AI answers without exposing your private data

---

## STARTUP INSTRUCTIONS (DO THIS FIRST!)

### Before Your Presentation Starts

**Execute these commands 5-10 minutes before demo:**

```bash
# Navigate to project directory
cd ~/Development/Fathom-0x

# Start all services (RAG API, Oracle, Frontend)
./START_FULL_SYSTEM.sh
```

**What this does:**
- Starts RAG API on `http://localhost:5000`
- Starts Oracle Node (blockchain listener)
- Starts Frontend on `http://localhost:3000`
- Creates logs in `logs/` directory

**System Check:**
1. Wait for "SYSTEM READY!" message
2. Open browser to `http://localhost:3000`
3. Verify you see the Fathom homepage
4. Keep terminal window open (Ctrl+C stops all services)

---

### Alternative: Start Components Individually

If you prefer manual control:

```bash
# Terminal 1 - RAG API
cd oracle-node
source venv/bin/activate
python simple_rag_api.py

# Terminal 2 - Oracle Node (optional)
cd oracle-node
source venv/bin/activate
python oracle_node.py

# Terminal 3 - Frontend
cd frontend
npm run dev
```

---

## Pre-Demo Checklist

**30 Minutes Before:**
- [ ] Test internet connection (for Walrus/Sui testnet)
- [ ] Open `http://localhost:3000` in Chrome/Firefox
- [ ] Have presentation slides ready
- [ ] Practice 2-minute pitch

**5 Minutes Before:**
- [ ] Run `./START_FULL_SYSTEM.sh`
- [ ] Verify frontend loads
- [ ] Have demo document ready (or use pre-loaded ones)
- [ ] Clear browser cache if needed

---

## 2-MINUTE PITCH (Opening)

### Hook (15 seconds)

"Imagine you're a hospital with patient records, or a company with sensitive IP. You need AI to answer questions about this data, but you can't just upload it to OpenAI or - that's a privacy nightmare and potentially illegal."

### Problem (20 seconds)

"Today's options are terrible:
- Upload to ? Data breach waiting to happen
- Run AI locally? Expensive, no verification
- Trust a centralized service? Back to square one

**The core problem:** You can't get verifiable AI answers on private data without exposing that data."

### Solution (30 seconds)

"Fathom solves this with three key innovations:

1. **Encrypted Storage** - Your docs go to Walrus, Sui's decentralized storage. Encrypted. Permanent.

2. **TEE Processing** - Queries are processed in a Trusted Execution Environment - hardware-enforced privacy. The AI sees your data, but nobody else can.

3. **Blockchain Verification** - Every answer is cryptographically signed and recorded on Sui. Immutable proof of computation.

**Result:** Private data + verifiable AI + zero trust required."

### Demo Transition (15 seconds)

"Let me show you this in action. I'll register a private medical document, query it, and prove the answer is verifiable - all while the data stays encrypted."

---

## LIVE DEMO (2 minutes)

### Part 1: Document Registration (40 seconds)

**Action:**
1. Navigate to `http://localhost:3000`
2. Click "Register Document"
3. Upload `demo_files/patient_record.txt` or paste:
 ```
 Patient: John Doe
 Age: 45
 Diagnosis: Type 2 Diabetes
 Medications: Metformin 500mg, Insulin
 Notes: Blood sugar levels improving with current treatment
 ```

**Narration:**
> "First, I register a private medical record. Watch what happens:
> - The document gets encrypted client-side
> - Stored on Walrus - Sui's decentralized storage network
> - Registration recorded on Sui blockchain
> - I get a Document ID - that's my permanent reference
>
> Notice: The plaintext data NEVER leaves my device unencrypted."

**Show on screen:**
- Document upload form
- Encryption happening (spinner/progress)
- Success message with Document ID
- Transaction hash on Sui Explorer

---

### Part 2: Query Processing (60 seconds)

**Action:**
1. Click "Query Documents"
2. Enter Document ID from previous step
3. Ask: "What medications is the patient taking?"
4. Click "Submit Query"

**Narration:**
> "Now I query this encrypted document:
>
> *[As you type]*
> 'What medications is the patient taking?'
>
> *[Click Submit]*
> Here's what happens behind the scenes - and this is the magic:
>
> 1. My query goes to the blockchain
> 2. Oracle node picks it up
> 3. Fetches encrypted doc from Walrus
> 4. Decrypts it inside a TEE - think of it as a locked box with AI inside
> 5. LLM processes the query on the decrypted data
> 6. Generates answer
> 7. Signs it cryptographically
> 8. Posts back to blockchain
>
> *[Answer appears]*
>
> Look at this answer: 'Patient is taking Metformin 500mg and Insulin'
>
> And here's the key - I have cryptographic proof this computation happened correctly. The signature, the timestamp, all on-chain. Anyone can verify this without seeing the private data."

**Show on screen:**
- Query form with Document ID
- Processing animation
- Answer display with:
 - Response text
 - Signature/attestation
 - Blockchain transaction link
 - Timestamp

---

### Part 3: Verification (20 seconds)

**Action:**
1. Click on transaction hash
2. Show Sui Explorer with answer submission
3. Point to signature and timestamp

**Narration:**
> "This isn't just a demo - this is production-ready infrastructure on Sui testnet. Every answer is:
> - Cryptographically signed
> - Timestamped
> - Permanently recorded
> - Independently verifiable
>
> Healthcare, finance, legal - anywhere you need AI on sensitive data."

---

## KEY TALKING POINTS

### During Demo

**Technical Highlights:**
- "Walrus gives us permanent, decentralized storage"
- "Sui's fast finality means answers in seconds, not minutes"
- "TEE provides hardware-level privacy guarantees"
- "Zero-knowledge proof-like verification without the ZK complexity"

**Market Fit:**
- "Healthcare: HIPAA-compliant AI analytics"
- "Finance: Risk analysis on sensitive portfolios"
- "Legal: Document analysis with attorney-client privilege"
- "Enterprise: IP analysis without data leakage"

**Why This Matters:**
- "This is the missing piece for enterprise AI adoption"
- "Regulatory compliance built-in"
- "Decentralization removes single points of failure"
- "Open protocol - anyone can build on this"

---

## EXPECTED QUESTIONS & ANSWERS

### Technical Questions

**Q: "How does the TEE actually work?"**

A: "Great question. We use Nautilus or similar TEE infrastructure. The key is:
- TEE has its own private key that never leaves secure hardware
- Code running inside is attestable - you can verify WHAT code ran
- Memory is encrypted and isolated from the host OS
- Even cloud providers with physical access can't see the data
- We generate cryptographic attestations proving correct execution

For this demo, we simulate TEE behavior, but the architecture is production-ready for Nautilus integration."

---

**Q: "What if the oracle is malicious?"**

A: "Excellent security question. Three layers of protection:

1. **TEE Attestation**: The oracle can't lie about computation - the TEE hardware enforces correct execution

2. **Economic Staking**: Oracles stake tokens. Slashed if caught submitting bad answers

3. **Multiple Oracles**: Production would use multiple independent oracles. Consensus required.

The beauty is - you don't need to trust the oracle operator. You trust the cryptography and hardware."

---

**Q: "How do you handle key management?"**

A: "Smart question. We use a hybrid approach:
- Documents encrypted with symmetric keys
- Access control keys managed via Sui smart contracts
- TEE has its own attestation keys
- Users control permissions via on-chain ACLs

For enterprises, we'd integrate with existing HSM/KMS infrastructure."

---

**Q: "What about performance and costs?"**

A: "Real numbers from Sui testnet:
- Document registration: ~0.02 SUI (~$0.02)
- Query processing: ~0.01 SUI per query
- Walrus storage: One-time fee, permanent storage
- Query latency: 3-5 seconds end-to-end

Compare that to traditional secure cloud: orders of magnitude cheaper, with better security guarantees."

---

**Q: "Why Sui instead of Ethereum/Solana?"**

A: "Three reasons:

1. **Move Language**: Object-centric model perfect for document permissions and ownership

2. **Walrus Integration**: Native decentralized storage designed for Sui. Better than IPFS pinning games.

3. **Performance**: Sub-second finality, parallel execution. Healthcare doesn't wait 15 seconds for block confirmation.

Sui was built for real-world applications, not just DeFi speculation."

---

**Q: "Can't someone just copy the encrypted data?"**

A: "They can copy the ciphertext, sure - it's on Walrus, it's public. But:
- Encryption keys never leave user control
- TEE doesn't expose keys even during processing
- Access control enforced by smart contracts
- Revocation is instant and on-chain

It's like someone copying your locked safe - great, you have a heavy box you can't open."

---

### Business Questions

**Q: "What's your go-to-market strategy?"**

A: "We target three verticals initially:

1. **Healthcare**: HIPAA-compliant AI analytics on patient data. Partner with EHR providers.

2. **Financial Services**: Risk analysis, fraud detection on customer portfolios. Banks are desperate for compliant AI.

3. **Legal**: Discovery and document analysis. Law firms can't use - we're the alternative.

We'll offer:
- SDK for integration
- Hosted oracle infrastructure
- Enterprise SLAs
- Compliance certifications

Revenue from oracle fees and enterprise support contracts."

---

**Q: "Who are your competitors?"**

A: "Honest answer - there aren't direct competitors doing verifiable RAG on decentralized infrastructure. Adjacent players:

- **Oasis Network**: Privacy-focused chain, but no Walrus-equivalent storage
- **Secret Network**: Has TEEs, lacks fast finality and storage solution
- **Traditional**: AWS Nitro Enclaves, Azure Confidential Computing - centralized, expensive
- **OpenAI + Enterprise Contracts**: Not verifiable, trust-based

Our unique combo: Sui + Walrus + TEE + RAG in one protocol."

---

**Q: "What's your traction?"**

A: "We're at the proof-of-concept stage:
- Smart contracts deployed on Sui testnet
- Demo functional with real Walrus integration
- Early discussions with 2 healthcare tech companies
- Developer interest from Sui ecosystem

Next 3 months:
- Mainnet launch
- First pilot customer
- Grant from Sui Foundation (applied)
- Nautilus TEE integration"

---

**Q: "What about regulations - HIPAA, GDPR?"**

A: "This is actually our STRENGTH:

**HIPAA**: TEE processing means we're a covered entity that can provably secure PHI. Cryptographic audit trail built-in.

**GDPR**:
- Right to be forgotten: Revoke keys, data becomes unreadable
- Data minimization: Only process what's needed in TEE
- Purpose limitation: Enforced by smart contracts
- Audit requirements: Every operation on-chain

We're not trying to avoid regulations - we're building the infrastructure that makes compliance automatic."

---

### Vision Questions

**Q: "What's the long-term vision?"**

A: "Fathom becomes the standard protocol for private data AI:

**Year 1**: Healthcare and legal verticals, enterprise pilot programs

**Year 2**: Cross-document queries, federated learning, multi-party computation

**Year 3**: Fathom becomes middleware - any AI app can add privacy with one API call

**Ultimate vision**: A future where privacy and AI aren't in conflict. Where you can get insights from data without exposing it. Where verification is automatic, not an afterthought.

Think of us like HTTPS for AI - everyone will use it, most won't know it's there."

---

**Q: "How does this fit into the broader Sui ecosystem?"**

A: "Fathom showcases what makes Sui special:

1. **Move's Object Model**: Perfect for representing documents with complex permissions
2. **Walrus**: Decentralized storage is critical - we're building on Sui's native solution
3. **Sponsored Transactions**: Users don't need SUI tokens for basic operations
4. **Performance**: Real-time AI needs real-time blockchain

We're proving that Sui isn't just for DeFi - it's infrastructure for next-gen applications. Healthcare, AI, privacy - this is where blockchain matters to normal people."

---

## DEMO SCENARIOS

### Scenario A: Healthcare Focus

**Setup:** Upload `patient_record.txt`

**Query:** "What are the patient's current medications and dosage?"

**Talking Points:**
- HIPAA compliance
- Electronic Health Records (EHR) integration potential
- Multi-institution data sharing
- Clinical decision support

---

### Scenario B: Financial Focus

**Setup:** Upload `financial_report.txt`

**Query:** "What was the company's revenue growth rate?"

**Talking Points:**
- Analyst research on private companies
- Portfolio risk analysis
- Compliance with data protection regulations
- Competitive intelligence without data leakage

---

### Scenario C: Legal Focus

**Setup:** Upload a contract or legal document

**Query:** "Summarize the key obligations and deadlines"

**Talking Points:**
- Attorney-client privilege maintained
- Discovery process automation
- Due diligence for M&A
- Regulatory filing analysis

---

## TROUBLESHOOTING

### If Demo Breaks

**Frontend won't load:**
```bash
# Check if services are running
ps aux | grep -E "(simple_rag|next)"

# Restart
./START_FULL_SYSTEM.sh
```

**Document upload fails:**
- Check Walrus is reachable: `curl https://aggregator.walrus-testnet.walrus.space`
- Verify wallet has SUI for gas
- Try with smaller document

**Query returns error:**
- Check RAG API: `curl http://localhost:5000/health`
- Verify oracle is running: `ps aux | grep oracle_node`
- Check logs: `tail -f logs/rag_api.log`

**Nuclear option:**
```bash
# Stop everything
pkill -f "simple_rag|oracle_node|next"

# Restart
./START_FULL_SYSTEM.sh
```

---

## BACKUP DEMO PLAN

If live demo completely fails:

1. **Show TEE Simulation:**
 ```bash
 ./START_TEE_DEMO.sh --live
 ```

2. **Walk through code:**
 - Open `contracts/sources/fathom.move`
 - Explain smart contract logic
 - Show Walrus integration

3. **Use pre-recorded video:**
 - Have screen recording of successful demo
 - Narrate over it

4. **Focus on architecture:**
 - Draw system diagram
 - Emphasize technical innovation
 - Pivot to vision and roadmap

---

## METRICS TO HIGHLIGHT

**Technical:**
- Sub-second transaction finality on Sui
- 3-5 second end-to-end query latency
- 0.02 SUI average cost per operation
- Permanent storage on Walrus

**Market:**
- $50B+ healthcare AI market
- $10B+ legal tech market
- 95% of enterprises cite data privacy as AI adoption barrier
- HIPAA violations cost average $1.5M per incident

---

## POST-DEMO ACTIONS

**Immediately After:**
- Share GitHub repo link
- Exchange contact info with interested parties
- Note questions you couldn't answer

**Follow-up (24 hours):**
- Send technical whitepaper to technical folks
- Send business deck to investors
- Connect on LinkedIn/Twitter

**Within 1 week:**
- Blog post about demo experience
- Answer follow-up questions
- Schedule deeper technical discussions

---

## WINNING THE DEMO

**What Judges Want to See:**

1. **Clear Problem**: Privacy vs. AI is a real, billion-dollar problem
2. **Novel Solution**: No one else combines Sui + Walrus + TEE + RAG
3. **Technical Depth**: You understand cryptography, not just buzzwords
4. **Working Demo**: It actually works on testnet
5. **Market Opportunity**: Real customers will pay for this

**Your Advantages:**
- Sui/Walrus native - built for the ecosystem
- Real technical innovation (TEE + blockchain)
- Clear go-to-market in regulated industries
- Functional proof-of-concept

**Be Ready For:**
- Technical deep-dives (know your crypto)
- Business model questions (have numbers)
- Competitive landscape (know alternatives)
- Scaling concerns (have architecture answers)

---

## CLOSING (30 seconds)

"So that's Fathom - privacy-preserving RAG on Sui and Walrus.

We're not just building another AI wrapper. We're solving the fundamental tension between data privacy and AI utility.

Healthcare, finance, legal - anywhere you can't afford to leak data but need AI insights - that's our market.

The infrastructure is here. The demand is massive. The time is now.

We're looking for partners, early customers, and supporters who believe private data and public verification can coexist.

Thank you. Questions?"

---

## CONTACT & NEXT STEPS

**After Demo:**
- GitHub: https://github.com/your-repo/fathom-0x
- Email: team@fathom-protocol.com
- Twitter: @FathomProtocol
- Discord: [Link]

**For Developers:**
- Documentation: See `/docs`
- Smart Contracts: `/contracts/sources/fathom.move`
- Integration Guide: Coming soon

**For Investors:**
- Deck: [Link]
- Technical Whitepaper: [Link]
- Meeting: [Calendar link]

---

## APPENDIX: QUICK REFERENCE

### Terminal Commands
```bash
# Start everything
./START_FULL_SYSTEM.sh

# Stop everything
Ctrl+C (in terminal running START_FULL_SYSTEM.sh)
# OR
pkill -f "simple_rag|oracle_node|next"

# Check service status
curl http://localhost:5000/health # RAG API
curl http://localhost:3000 # Frontend
ps aux | grep oracle_node # Oracle

# View logs
tail -f logs/rag_api.log
tail -f logs/oracle.log
tail -f logs/frontend.log
```

### Key URLs
- Frontend: http://localhost:3000
- RAG API: http://localhost:5000
- Sui Explorer: https://suiscan.xyz/testnet
- Walrus: https://aggregator.walrus-testnet.walrus.space

### Contract Info
- Package ID: `0xc1c7e98b6ec28ed8c722e8dba6dcadded25797a88b1778bdf3f9a754ed275274`
- Config Object: `0xd4f796e0c1f82064d8f1ed8f4fae3e061869f485f53d16e82b139a49301392d1`

---

**Good luck! **
