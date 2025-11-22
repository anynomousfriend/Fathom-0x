# Emergency Scripts - Quick Reference

These scripts help you recover quickly during demo failures.

## 📋 Available Scripts

### 1. `test_all_services.sh` - Pre-Demo Testing
**When to use**: 1 hour before demo  
**What it does**: Tests all services and reports status  
**Run time**: 30 seconds

```bash
./emergency_scripts/test_all_services.sh
```

**Tests**:
- ✅ Walrus HTTP upload
- ✅ Walrus CLI functionality
- ✅ Sui RPC connectivity
- ✅ Oracle process running
- ✅ Frontend accessibility
- ✅ Wallet balance
- ✅ Demo files present

**Output**: Pass/Fail report with recovery suggestions

---

### 2. `restart_all.sh` - Nuclear Restart
**When to use**: Everything is frozen/stuck  
**What it does**: Kills and restarts all services  
**Run time**: 15 seconds

```bash
./emergency_scripts/restart_all.sh
```

**Actions**:
- Kills frontend (Next.js)
- Kills oracle node
- Clears .next cache
- Restarts frontend in background
- Restarts oracle in background
- Shows PIDs and log locations

**Logs**: 
- `logs/frontend.log`
- `logs/oracle.log`

---

### 3. `enable_mock_mode.sh` - Instant Responses
**When to use**: Oracle not responding or too slow  
**What it does**: Enables mock mode for instant answers  
**Run time**: 5 seconds

```bash
./emergency_scripts/enable_mock_mode.sh
```

**Actions**:
- Kills current oracle
- Creates `mock_responses.json` if not exists
- Starts oracle with `MOCK_MODE=true`
- Pre-configured answers for common queries

**Mock Queries**:
- "What was the Q3 revenue?"
- "What medications is the patient taking?"
- "What are the key findings?"
- "Summarize the document"

**Response time**: ~2 seconds (instant)

---

### 4. `switch_to_backup_rpc.sh` - RPC Failover
**When to use**: Blockchain RPC timing out  
**What it does**: Tests and switches to working RPC  
**Run time**: 10 seconds

```bash
./emergency_scripts/switch_to_backup_rpc.sh
```

**Actions**:
- Tests multiple RPC endpoints
- Finds working endpoint
- Updates `frontend/.env.local`
- Restarts frontend

**RPC Options**:
1. `https://sui-testnet.nodeinfra.com`
2. `https://rpc-testnet.suiscan.xyz`
3. `https://testnet.sui.rpcpool.com`
4. `https://fullnode.testnet.sui.io:443`

---

## 🚨 Quick Decision Guide

```
Problem?
├── All services frozen → restart_all.sh
├── Oracle too slow → enable_mock_mode.sh
├── Blockchain timeout → switch_to_backup_rpc.sh
└── Not sure? → test_all_services.sh
```

---

## 📖 Usage Examples

### Scenario 1: Pre-Demo Check
```bash
# 1 hour before demo
./emergency_scripts/test_all_services.sh

# Output shows what's working/broken
# Fix issues before demo starts
```

### Scenario 2: Demo Freeze
```bash
# Everything stopped responding during demo
./emergency_scripts/restart_all.sh

# Wait 15 seconds
# Refresh browser
# Continue demo
```

### Scenario 3: Slow Oracle
```bash
# Query submitted 30 seconds ago, no response
./emergency_scripts/enable_mock_mode.sh

# Resubmit query in frontend
# Get instant mock response
# Continue demo with mock mode
```

### Scenario 4: RPC Issues
```bash
# Wallet transactions timing out
./emergency_scripts/switch_to_backup_rpc.sh

# Frontend restarts with new RPC
# Try transaction again
```

---

## 🎯 Demo Day Workflow

### 1 Hour Before
```bash
# Test everything
./emergency_scripts/test_all_services.sh

# If any failures, fix them now
```

### 30 Minutes Before
```bash
# Final check
ps aux | grep oracle_node.py  # Oracle running?
curl localhost:3000 -I        # Frontend up?

# Have scripts ready to run
ls emergency_scripts/
```

### During Demo
```bash
# Keep terminal with these commands ready:

# If stuck:
./emergency_scripts/restart_all.sh

# If slow:
./emergency_scripts/enable_mock_mode.sh

# Have them typed out and ready to press Enter!
```

---

## 📝 What to Say During Recovery

### When restarting:
> "Let me quickly restart the services—this is still hackathon code! 
> In production, we'd have automatic failover... [run script] ...
> there we go, back online!"

### When enabling mock mode:
> "To demonstrate the flow without waiting for the AI, I'll enable 
> mock mode—this simulates instant oracle responses... [run script] ...
> perfect, now let's continue."

### When switching RPC:
> "The testnet RPC is experiencing some load. Let me switch to a 
> backup endpoint... [run script] ...and we're back in business!"

---

## 🔧 Troubleshooting the Scripts

### Script won't run
```bash
# Make executable
chmod +x emergency_scripts/*.sh

# Check permissions
ls -l emergency_scripts/
```

### "command not found"
```bash
# Run from project root, not from emergency_scripts folder
cd /path/to/fathom-protocol
./emergency_scripts/restart_all.sh
```

### Scripts run but services don't start
```bash
# Check logs
tail -f logs/frontend.log
tail -f logs/oracle.log

# Manual restart
cd frontend && npm run dev
cd oracle-node && python oracle_node.py
```

---

## 📊 Script Success Indicators

### restart_all.sh Success:
```
✅ All services restarted!
Frontend: http://localhost:3000 (PID: 12345)
Oracle: Running (PID: 67890)
```

### enable_mock_mode.sh Success:
```
✅ Mock mode enabled!
Oracle PID: 12345
Mode: MOCK (instant responses)
```

### switch_to_backup_rpc.sh Success:
```
✅ Frontend restarted (PID: 12345)
New Configuration:
  RPC: https://sui-testnet.nodeinfra.com
```

### test_all_services.sh Success:
```
✅ ALL TESTS PASSED!
🚀 You're ready for the demo!
```

---

## 🎓 Practice Using Scripts

**Before demo day, practice**:

1. **Simulate Walrus failure**:
   ```bash
   # Disconnect WiFi during upload
   # Run: ./emergency_scripts/enable_mock_mode.sh
   # Verify: Mock responses work
   ```

2. **Simulate oracle crash**:
   ```bash
   # Kill oracle: pkill -f oracle_node
   # Run: ./emergency_scripts/restart_all.sh
   # Verify: Oracle restarts
   ```

3. **Simulate RPC timeout**:
   ```bash
   # Block RPC in /etc/hosts temporarily
   # Run: ./emergency_scripts/switch_to_backup_rpc.sh
   # Verify: Frontend uses backup
   ```

**Target**: Execute any script in under 10 seconds!

---

## 📞 If Scripts Fail

### Last Resort Manual Recovery:

```bash
# 1. Kill everything
pkill -f "next dev"
pkill -f "oracle_node"

# 2. Start frontend
cd frontend
rm -rf .next
npm run dev

# 3. Start oracle in mock mode
cd ../oracle-node
export MOCK_MODE=true
python oracle_node.py

# 4. Continue demo with mock responses
```

---

## ✅ Post-Demo

### Clean up logs:
```bash
rm logs/*.log
```

### Reset to normal mode:
```bash
# Disable mock mode
unset MOCK_MODE
cd oracle-node
python oracle_node.py
```

### Review what happened:
```bash
# Check what went wrong
cat logs/frontend.log
cat logs/oracle.log
```

---

## 🎯 Remember

- **Practice**: Run each script 3 times before demo
- **Prepare**: Have terminal window ready with scripts
- **Stay Calm**: Scripts are your safety net
- **Explain**: Tell audience what you're doing
- **Move On**: Don't dwell on failures

**These scripts can save your demo! Know them well!**

---

*Last Updated: November 2024*  
*Keep this file open in a tab during your demo*
