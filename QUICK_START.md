# Fathom Protocol - Quick Start Guide

## Start Before Your Demo (5 minutes)

### Single Command Startup

```bash
./START_FULL_SYSTEM.sh
```

This starts:
- RAG API (Backend) - Port 5000
- Oracle Node (Blockchain listener)
- Frontend (Next.js) - Port 3000

**Wait for:** "SYSTEM READY!" message

---

## Pre-Flight Checklist

**Before running startup:**

1. **Check Python environment:**
 ```bash
 cd oracle-node
 source venv/bin/activate
 pip list | grep pysui # Should show pysui 0.93.0
 ```

2. **Check Node.js:**
 ```bash
 cd frontend
 npm list | head -5 # Verify dependencies installed
 ```

3. **Check environment variables:**
 ```bash
 cat oracle-node/.env # Should have all keys set
 ```

---

## Access Points

Once started:

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | User interface |
| RAG API | http://localhost:5000 | Backend processing |
| Health Check | http://localhost:5000/health | API status |

---

## Quick Test

After startup:

```bash
# Test RAG API
curl http://localhost:5000/health

# Should return:
# {"status":"healthy","gemini_configured":false,"openai_configured":false}

# Test Frontend
curl -I http://localhost:3000

# Should return: HTTP/1.1 200 OK
```

---

## Stopping Services

**Option 1:** In the terminal running `START_FULL_SYSTEM.sh`, press **Ctrl+C**

**Option 2:** Kill all processes manually:
```bash
pkill -f simple_rag_api.py
pkill -f oracle_node.py
pkill -f "next dev"
```

---

## View Logs

```bash
# RAG API logs
tail -f logs/rag_api.log

# Oracle logs
tail -f logs/oracle.log

# Frontend logs
tail -f logs/frontend.log
```

---

## Troubleshooting

### Services Won't Start

**Check ports:**
```bash
lsof -i :3000 # Frontend
lsof -i :5000 # RAG API
```

**Kill existing processes:**
```bash
pkill -f "simple_rag|oracle_node|next"
```

**Restart:**
```bash
./START_FULL_SYSTEM.sh
```

---

### Frontend Shows Error

**Clear cache:**
```bash
cd frontend
rm -rf .next
npm run dev
```

---

### RAG API Not Responding

**Check status:**
```bash
cd oracle-node
./venv/bin/python -c "from simple_rag_api import app; print(' Import successful')"
```

**Restart manually:**
```bash
cd oracle-node
./venv/bin/python simple_rag_api.py
```

---

## Demo Flow

1. **Register Document:**
 - Go to http://localhost:3000
 - Click "Register Document"
 - Upload file or paste text
 - Get Document ID

2. **Query Document:**
 - Click "Query Documents"
 - Enter Document ID
 - Ask question
 - Get verified answer

3. **Show Verification:**
 - Click transaction hash
 - Show on Sui Explorer
 - Highlight signature and timestamp

---

## Key Commands Reference

```bash
# Full system startup
./START_FULL_SYSTEM.sh

# Individual components
cd oracle-node && ./venv/bin/python simple_rag_api.py # RAG API
cd oracle-node && ./venv/bin/python oracle_node.py # Oracle
cd frontend && npm run dev # Frontend

# System tests
./TEST_EVERYTHING.sh

# TEE demo
./START_TEE_DEMO.sh --live

# Stop all
Ctrl+C or pkill -f "simple_rag|oracle_node|next"
```

---

## Need Help?

- **Check logs:** `logs/` directory
- **Test components:** `./TEST_EVERYTHING.sh`
- **Documentation:** `DEMO_DAY_PRESENTATION.md`

---

**Ready to demo! **
