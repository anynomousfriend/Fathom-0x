# Fathom Protocol - Demo Quick Reference

> **Before you start your presentation, read this!**

---

## START THE SYSTEM (Do This First!)

### One Command to Rule Them All

```bash
./START_FULL_SYSTEM.sh
```

️ **Takes:** 10-15 seconds
 **Starts:** RAG API + Oracle Node + Frontend
 **Opens:** http://localhost:3000

**Wait for the "SYSTEM READY!" message before proceeding.**

---

## Quick Checklist

**5 Minutes Before Demo:**
- [ ] Run `./START_FULL_SYSTEM.sh`
- [ ] Open http://localhost:3000 in browser
- [ ] Verify homepage loads
- [ ] Keep terminal window open

---

## Demo Flow (2 Minutes)

### 1. Register Document (40 sec)
- Click "Register Document"
- Upload `demo_files/patient_record.txt`
- Show encryption happening
- Copy Document ID

### 2. Query Document (60 sec)
- Click "Query Documents"
- Paste Document ID
- Ask: "What medications is the patient taking?"
- Show answer with verification

### 3. Show Proof (20 sec)
- Click transaction hash
- Open Sui Explorer
- Point to signature and timestamp

---

## URLs You Need

| What | URL |
|------|-----|
| Frontend | http://localhost:3000 |
| RAG API Health | http://localhost:5000/health |
| Sui Explorer | https://suiscan.xyz/testnet |
| Contract | `0xc1c7e98b...` (see deployed_addresses.json) |

---

## Stop Everything

In the terminal running the startup script:
```bash
Ctrl+C
```

Or kill manually:
```bash
pkill -f "simple_rag|oracle_node|next"
```

---

## Emergency Troubleshooting

**Nothing works?**
```bash
pkill -f "simple_rag|oracle_node|next"
./START_FULL_SYSTEM.sh
```

**Frontend error?**
```bash
cd frontend
rm -rf .next
npm run dev
```

**API error?**
```bash
cd oracle-node
./venv/bin/python simple_rag_api.py
```

---

## Key Talking Points

1. **Problem:** Can't get verifiable AI answers on private data
2. **Solution:** Walrus (storage) + TEE (processing) + Sui (verification)
3. **Demo:** Register encrypted doc Query it Show proof
4. **Market:** Healthcare, Finance, Legal (regulated industries)
5. **Why Sui:** Fast finality + Walrus integration + Move language

---

## Full Documentation

- **Complete Guide:** `DEMO_DAY_PRESENTATION.md`
- **Quick Start:** `QUICK_START.md`
- **Technical Docs:** `docs/TECHNICAL_ARCHITECTURE.md`

---

## Opening Hook (15 sec)

> "Imagine you're a hospital with patient records. You need AI to answer questions about this data, but you can't just upload it to - that's a privacy nightmare and potentially illegal. Fathom solves this: encrypted storage on Walrus, processing in TEEs, verification on Sui. Private data + verifiable AI. Let me show you."

---

## Closing (15 sec)

> "That's Fathom - privacy-preserving RAG on Sui and Walrus. Healthcare, finance, legal - anywhere you can't afford to leak data but need AI insights. The infrastructure is here. The demand is massive. Questions?"

---

## System Status

**Last Tested:** Working
**Components:** All operational
**Contract:** Deployed on Sui testnet
**Frontend:** Builds successfully

---

** **
