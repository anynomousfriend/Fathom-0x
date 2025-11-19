# Fathom Protocol - Frequently Asked Questions

## General Questions

### What is Fathom Protocol?
Fathom is a verifiable RAG (Retrieval-Augmented Generation) system that allows AI to answer questions about private documents without exposing the raw data. It combines Walrus decentralized storage, Sui smart contracts, and verifiable computation (inspired by Nautilus Chain).

### Why is this needed?
Current AI systems require you to upload sensitive documents to centralized servers. Fathom keeps your data encrypted on Walrus while still enabling AI to provide answers with cryptographic proof of integrity.

### What makes it "verifiable"?
Every answer comes with a cryptographic signature from the oracle node. This signature proves:
1. The answer came from an authorized oracle
2. The computation was performed correctly
3. The answer relates to the specific document

## Technical Questions

### How does the RAG pipeline work?
1. User uploads document to Walrus (encrypted)
2. User registers document on Sui (stores Blob ID)
3. User submits question through smart contract
4. Oracle fetches document from Walrus
5. Oracle processes question with AI
6. Oracle signs answer and submits back to chain
7. User receives verified answer

### Why use Walrus instead of IPFS or Arweave?
Walrus offers:
- High availability through erasure coding
- Efficient retrieval through aggregator network
- Native integration with Sui ecosystem
- Cost-effective storage for large files

### Why use Sui for the smart contracts?
Sui provides:
- Low transaction costs
- Fast finality
- Rich object model perfect for documents/queries
- Excellent developer experience
- Event system for oracle coordination

### Where does Nautilus fit in?
Fathom demonstrates a "mock TEE" (Trusted Execution Environment) architecture. In production, we'd integrate with Nautilus Chain to provide:
- Hardware-backed computation attestation
- Sealed execution environment
- Zero-knowledge proof generation
- Full privacy preservation

### Is the data really private?
Yes! Documents are:
- Encrypted before upload to Walrus
- Never exposed to the frontend
- Processed in isolated oracle environment
- Only results (not data) returned on-chain

In production with full TEE, even the oracle can't access raw data.

## Usage Questions

### What types of documents can I use?
Currently:
- Text documents
- PDFs (converted to text)
- Research papers
- Code files
- Markdown documents

Future support:
- Images with OCR
- Audio transcripts
- Video transcripts
- Structured data (JSON, CSV)

### What types of questions can I ask?
Any question that can be answered from the document content:
- Summarization: "What is the main conclusion?"
- Extraction: "Who are the authors?"
- Analysis: "What methodology was used?"
- Comparison: "How does this compare to approach X?"

### How long does it take to get an answer?
Typically 10-30 seconds:
- Transaction confirmation: 2-3 seconds
- Oracle detection: 2-10 seconds (polling interval)
- Document fetch: 1-5 seconds
- AI processing: 5-15 seconds
- Answer submission: 2-3 seconds

### How much does it cost?
Approximate costs on Sui Testnet:
- Register document: ~0.001 SUI
- Submit query: ~0.0008 SUI
- Oracle answer: ~0.001 SUI (paid by oracle)

Plus Walrus storage costs (one-time).

## Development Questions

### How do I run this locally?
Follow the [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for step-by-step instructions.

Quick start:
```bash
# 1. Deploy contract
cd contracts && sui move build && sui client publish

# 2. Configure oracle
cd ../oracle-node && cp .env.example .env
# Edit .env with your values
python3 oracle_node.py

# 3. Run frontend
cd ../frontend && npm install && npm run dev
```

### Can I use a different AI model?
Yes! The oracle's `process_query()` function is designed to be modular. You can integrate:
- OpenAI GPT-4
- Anthropic Claude
- Local LLMs (Llama, Mistral)
- Custom RAG pipelines

### Can I deploy to mainnet?
Not recommended yet. This is a hackathon prototype. Before mainnet:
- Complete security audit
- Implement proper TEE
- Add oracle redundancy
- Comprehensive testing
- Production monitoring

### How can I contribute?
See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

Areas we need help:
- TEE integration
- Multi-oracle consensus
- Vector embeddings
- Additional document formats
- Mobile app

## Troubleshooting

### Contract deployment fails
**Issue:** "insufficient gas"
**Solution:** Increase gas budget: `--gas-budget 100000000`

**Issue:** "address not found"
**Solution:** Ensure wallet has testnet SUI from faucet

### Oracle not processing queries
**Issue:** Oracle doesn't detect events
**Solution:** 
- Check .env configuration
- Verify contract addresses are correct
- Ensure RPC URL is accessible
- Increase polling interval

**Issue:** "Failed to fetch Walrus blob"
**Solution:**
- Verify Blob ID is correct
- Check Walrus aggregator URL
- Ensure blob was uploaded successfully

### Frontend won't connect to wallet
**Issue:** Wallet connection fails
**Solution:**
- Install Sui Wallet extension
- Switch wallet to testnet
- Refresh page and try again

**Issue:** "Package ID not configured"
**Solution:**
- Create .env.local from .env.example
- Add your deployed Package ID
- Restart dev server

## Hackathon Specific

### Which track should I submit to?
**AI x Data Track** - Fathom combines AI (RAG) with data infrastructure (Walrus storage)

### What makes this submission competitive?
Strengths:
- ✅ Uses all three technologies (Walrus, Sui, Nautilus concept)
- ✅ Working end-to-end demo
- ✅ Solves real problem (data privacy in AI)
- ✅ Novel architecture
- ✅ Production-ready path

### How do I explain the technology stack?
Use this framing:
1. **Problem:** AI needs access to private data
2. **Walrus:** Stores encrypted documents (decentralized)
3. **Sui:** Coordinates queries and verifies answers (blockchain)
4. **Nautilus:** Provides verifiable computation (TEE)
5. **Result:** Private RAG with cryptographic proof

### What should I show in the demo video?
Essential flows:
1. Connect wallet (15s)
2. Register document with Walrus Blob ID (30s)
3. Submit question (30s)
4. Show oracle processing (terminal view) (45s)
5. Display verified answer (30s)
6. Explain architecture (60s)

Tips:
- Show both terminal and browser
- Narrate what's happening
- Emphasize the verification aspect
- Keep it under 5 minutes

## Future Roadmap

### What's next for Fathom?
Short term (3 months):
- Full Nautilus TEE integration
- Multiple oracle nodes
- Vector embeddings for semantic search

Medium term (6 months):
- Multi-document knowledge bases
- Cross-chain support
- Mobile application

Long term (12 months):
- Decentralized oracle network
- On-chain governance
- Enterprise features

### Is this production-ready?
No. This is a hackathon prototype demonstrating the concept. For production use, we need:
- Security audit
- Full TEE implementation
- Oracle redundancy
- Comprehensive testing
- Production monitoring
- SLA guarantees

### Will you continue development after the hackathon?
Yes! We believe in the vision of verifiable private AI. Regardless of hackathon results, we plan to:
- Integrate with Nautilus when available
- Build out the oracle network
- Add requested features
- Work toward mainnet launch

## Contact

### How can I reach the team?
- GitHub: [Your GitHub]
- Email: [Your Email]
- Twitter: [Your Twitter]
- Discord: [Link if available]

### Where can I report bugs?
Please open an issue on GitHub with:
- Description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/logs if applicable

### Can I use this in my project?
Yes! Fathom is MIT licensed. You're free to:
- Use the code
- Modify it
- Build on top of it
- Commercial use

We'd appreciate attribution and would love to hear about your use case!

---

**Didn't find your question?** Open an issue on GitHub or reach out directly!
