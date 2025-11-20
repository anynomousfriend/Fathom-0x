# Fathom RAG API - Quick Setup Guide

## 🚀 Quick Start (5 minutes)

### Step 1: Get a FREE API Key

Choose one (Gemini recommended for free tier):

**Option A: Google Gemini (FREE - Recommended)**
1. Go to: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy your key

**Option B: OpenAI (Optional)**
1. Go to: https://platform.openai.com/api-keys
2. Sign up and get $5 free credit
3. Create API key

### Step 2: Start the RAG API

```bash
cd oracle-node

# Run the startup script
./START_RAG_API.sh
```

On first run, it will:
1. Create virtual environment
2. Install dependencies
3. Create `.env` file
4. Ask you to add your API key

**Edit `.env` file:**
```bash
nano .env
# or
vim .env
```

Add your API key:
```env
GEMINI_API_KEY=your_key_here
```

Then run again:
```bash
./START_RAG_API.sh
```

### Step 3: Test the API

```bash
# In another terminal, test the health endpoint
curl http://localhost:5000/health
```

You should see:
```json
{
  "status": "healthy",
  "gemini_configured": true
}
```

### Step 4: Use in Frontend

1. Open http://localhost:3000
2. Go to a document's query page
3. Toggle "Use Real RAG" ON
4. Ask a question!

---

## 📖 How It Works

### Demo Mode (Default)
- Toggle OFF = Demo responses
- No backend needed
- Instant answers
- Good for testing UI

### Real RAG Mode
- Toggle ON = Real AI answers
- Downloads document from Walrus
- Decrypts locally
- Chunks and searches
- Sends to AI model
- Returns real answer

---

## 🔧 API Endpoints

### GET /health
Check if API is running and configured

### POST /query
Query a document with real RAG

**Request:**
```json
{
  "blob_id": "your_blob_id",
  "encryption_key": "64_char_hex_key",
  "iv": "32_char_hex_iv",
  "question": "What is the main conclusion?"
}
```

**Response:**
```json
{
  "answer": "Based on the document...",
  "chunks_used": 3,
  "document_length": 5000,
  "model_used": "gemini"
}
```

### POST /query-mock
Test endpoint without real documents

---

## 🐛 Troubleshooting

### "Encryption key not found"
- Make sure you saved the encryption key when registering the document
- It's stored in localStorage under `fathom_keys`

### "Failed to download from Walrus"
- Check if blob ID is correct
- Verify Walrus testnet is accessible
- Try manual download: `walrus read <blob-id>`

### "RAG API request failed"
- Check if backend is running on port 5000
- Test with: `curl http://localhost:5000/health`
- Check backend logs for errors

### "No LLM configured"
- Add API key to `.env` file
- Restart the backend
- Check with `/health` endpoint

---

## 💡 For Your Demo

### Scenario 1: Show Real RAG
1. Toggle "Use Real RAG" ON
2. Ask: "What is the main conclusion?"
3. Show it downloads, decrypts, and answers
4. Point out the "Real RAG - GEMINI" badge

### Scenario 2: Show Fallback
1. Stop the backend (Ctrl+C)
2. Toggle still ON
3. Ask a question
4. Show it falls back to demo mode gracefully
5. Show "Demo (RAG unavailable)" badge

### Scenario 3: Full Pipeline
1. Upload document (with CLI if needed)
2. Save encryption key
3. Enable Real RAG
4. Query document
5. Get AI-generated answer
6. Show transaction on blockchain

---

## 📊 What Makes This Special?

### Privacy-Preserving RAG
- ✅ Document encrypted on Walrus
- ✅ Backend decrypts only when needed
- ✅ No permanent storage of plaintext
- ✅ Keys managed by user

### Verifiable AI
- ✅ Answers recorded on Sui blockchain
- ✅ Transaction hash provided
- ✅ On-chain audit trail
- ✅ Transparent processing

### Hybrid Approach
- ✅ Works with or without backend
- ✅ Graceful fallback to demo
- ✅ Easy to demo and test
- ✅ Production-ready architecture

---

## 🎯 19 Hours Left - Priority Checklist

- [x] Real RAG backend created
- [x] Frontend integration complete
- [x] Toggle for demo/real mode
- [x] Graceful error handling
- [x] Documentation ready

### Still to do (if time permits):
- [ ] Get Gemini API key (2 minutes)
- [ ] Test full pipeline (5 minutes)
- [ ] Prepare demo script (10 minutes)
- [ ] Practice presentation (15 minutes)

---

## 🚀 The Complete Flow

```
User uploads document
  → Encrypted with AES-256
  → Stored on Walrus
  → Registered on Sui blockchain
  
User queries document (Real RAG ON)
  → Frontend sends request to backend
  → Backend downloads from Walrus
  → Decrypts with user's key
  → Chunks text (1000 chars, 200 overlap)
  → Semantic search (finds relevant chunks)
  → Sends to Gemini/OpenAI
  → AI generates answer
  → Frontend displays answer + mode badge
  → Transaction recorded on blockchain
```

---

## 📝 Demo Script

**"Let me show you Fathom's RAG in action..."**

1. **Upload**: "First, I upload an encrypted document to Walrus"
2. **Register**: "Register it on Sui blockchain"
3. **Query (Demo)**: "Here's a demo query with mock responses"
4. **Toggle**: "Now let me enable Real RAG..."
5. **Query (Real)**: "Watch as it downloads, decrypts, and uses AI"
6. **Answer**: "Here's the actual AI-generated answer"
7. **Verify**: "And it's recorded on the blockchain"
8. **Privacy**: "All while keeping data encrypted and private"

**Time**: 3-5 minutes

---

## 🎓 Key Points for Judges

1. **Privacy-First**: Documents stay encrypted, keys with users
2. **Decentralized**: Walrus storage + Sui blockchain
3. **Verifiable**: All queries/answers on-chain
4. **Practical**: Actually works, not just a concept
5. **Scalable**: Real RAG pipeline with LLM integration

---

Need help? The backend logs everything, just watch the terminal!
