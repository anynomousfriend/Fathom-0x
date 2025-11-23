# START HERE - Fathom Protocol Demo Guide

## Welcome! Read This First

This is your complete guide to presenting Fathom Protocol. Everything you need is here.

---

## STEP 1: Start The System (10 minutes before demo)

Open a terminal and run:

```bash
./START_FULL_SYSTEM.sh
```

**What this does:**
- Starts RAG API (backend)
- Starts Oracle Node (blockchain listener)
- Starts Frontend (Next.js UI)

**Look for:** `SYSTEM READY!` message

**Then:** Open http://localhost:3000 in your browser

---

## STEP 2: Read The Documentation (5 minutes)

**Start with this one (MUST READ):**
- **[README_DEMO_QUICK.md](README_DEMO_QUICK.md)** - 1-page cheat sheet with everything you need

**If you have more time:**
- **[DEMO_DAY_PRESENTATION.md](DEMO_DAY_PRESENTATION.md)** - Complete guide with scripts, Q&A, troubleshooting

**For reference during demo:**
- **[QUICK_START.md](QUICK_START.md)** - Technical commands
- **[SYSTEM_READY.md](SYSTEM_READY.md)** - System status and verification

---

## STEP 3: Your Demo Flow (2 minutes total)

### Part 1: Register Document (40 seconds)
1. Go to http://localhost:3000
2. Click "Register Document"
3. Upload `demo_files/patient_record.txt`
4. Show encryption Walrus Blockchain
5. Copy the Document ID

### Part 2: Query Document (60 seconds)
1. Click "Query Documents"
2. Paste Document ID
3. Ask: *"What medications is the patient taking?"*
4. Show the verified AI answer with signature

### Part 3: Show Verification (20 seconds)
1. Click the transaction hash
2. Open Sui Explorer
3. Point to the signature and timestamp
4. Explain: *"Cryptographic proof on blockchain"*

---

## Your Opening Hook (15 seconds)

> "Imagine you're a hospital with patient records. You need AI to answer questions, but you can't upload to - that's a privacy nightmare and potentially illegal.
>
> Fathom solves this: encrypted storage on Walrus, processing in TEEs, verification on Sui. Private data + verifiable AI. Let me show you."

---

## Your Closing (15 seconds)

> "That's Fathom - privacy-preserving RAG on Sui and Walrus. Healthcare, finance, legal - anywhere you can't afford to leak data but need AI insights. The infrastructure is here. The demand is massive. Questions?"

---

## How To Stop Everything

In the terminal running `START_FULL_SYSTEM.sh`:
```bash
Ctrl+C
```

Or kill manually:
```bash
pkill -f "simple_rag|oracle_node|next"
```

---

## If Something Breaks

**Quick fix:**
```bash
pkill -f "simple_rag|oracle_node|next"
./START_FULL_SYSTEM.sh
```

**Backup demo:**
```bash
./START_TEE_DEMO.sh --live
```

**Last resort:** Walk through the architecture and code instead

---

## What's Already Done

- Oracle Node configured with all dependencies
- Smart contracts deployed on Sui testnet
- Frontend builds successfully
- All environment variables set
- Complete documentation created
- All 13 system tests passed

---

## All Documentation Files

**For Demo Day:**
- `README_DEMO_QUICK.md` - 1-page cheat sheet ⭐ READ THIS FIRST
- `DEMO_DAY_PRESENTATION.md` - Complete presentation guide
- `QUICK_START.md` - Technical quick reference
- `SYSTEM_READY.md` - System verification
- `START_HERE.md` - This file

**Technical:**
- `oracle-node/SETUP_COMPLETE.md` - Oracle configuration details
- `docs/TECHNICAL_ARCHITECTURE.md` - System architecture
- `README.md` - Project overview (now with quick start)

**Scripts:**
- `START_FULL_SYSTEM.sh` - Launch everything
- `test_full_stack.sh` - Test all components
- `START_TEE_DEMO.sh` - Backup demo

---

## Key Talking Points

**Problem:** Can't get verifiable AI answers on private data

**Solution:** Walrus (storage) + TEE (processing) + Sui (verification)

**Market:** Healthcare, Finance, Legal ($50B+ opportunity)

**Why Sui:** Fast finality + Walrus integration + Move's object model

---

## Important Numbers

- **Cost:** ~$0.02 per operation on testnet
- **Speed:** 3-5 seconds query latency
- **Market:** $50B+ healthcare AI market
- **Problem:** 95% of enterprises cite privacy as AI barrier

---

## Important Links

| What | URL |
|------|-----|
| Frontend | http://localhost:3000 |
| RAG API Health | http://localhost:5000/health |
| Sui Explorer | https://suiscan.xyz/testnet |
| Walrus | https://aggregator.walrus-testnet.walrus.space |

---

## Quick Test

Verify everything works:
```bash
./test_full_stack.sh
```

Should show: `Passed: 13/13`

---

## Timeline For Demo Day

**30 minutes before:**
- Read README_DEMO_QUICK.md one more time
- Test internet connection
- Open browser

**10 minutes before:**
- Run `./START_FULL_SYSTEM.sh`
- Wait for "SYSTEM READY!"
- Verify http://localhost:3000 loads

**During demo:**
- Keep README_DEMO_QUICK.md visible for reference
- Follow 2-minute demo flow
- Stay calm!

---

##

Everything is configured, tested, and documented. The system works. You've got backup plans. You know your pitch.

**Next steps:**
1. Read `README_DEMO_QUICK.md` (2 minutes)
2. Practice starting the system once
3. Run through the demo flow once
4. Breathe and have confidence!

---

**Good luck! **

*Questions? Check the detailed guides or run `./test_full_stack.sh` to verify system status.*
