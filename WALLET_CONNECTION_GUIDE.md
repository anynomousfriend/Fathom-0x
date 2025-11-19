# 🔗 Wallet Connection Troubleshooting Guide

## ❓ Can't Connect Wallet?

Follow these steps to fix wallet connection issues:

---

## ✅ Step 1: Install Sui Wallet

### **Option 1: Sui Wallet (Official)**
1. Visit: https://chrome.google.com/webstore
2. Search: "Sui Wallet"
3. Install the extension
4. Create or import a wallet

### **Option 2: Suiet Wallet (Alternative)**
1. Visit: https://suiet.app
2. Install browser extension
3. Create wallet

### **Option 3: Ethos Wallet**
1. Visit: https://ethoswallet.xyz
2. Install extension
3. Set up wallet

---

## ✅ Step 2: Switch to Testnet

**IMPORTANT:** Your wallet must be on **Testnet**!

### **In Sui Wallet:**
1. Open wallet extension
2. Click network dropdown (top right)
3. Select **"Testnet"**
4. ✅ Should show "Testnet" in header

### **In Suiet:**
1. Open extension
2. Click Settings ⚙️
3. Select "Network"
4. Choose **"Testnet"**

### **In Ethos:**
1. Open extension
2. Settings → Network
3. Select **"Testnet"**

---

## ✅ Step 3: Get Testnet SUI

You need testnet SUI tokens to pay for transactions:

### **Method 1: Discord Faucet (Recommended)**
1. Join Sui Discord: https://discord.gg/sui
2. Go to #testnet-faucet channel
3. Type: `!faucet YOUR_WALLET_ADDRESS`
4. Wait 10-30 seconds
5. Check wallet - you should have 1-10 SUI

### **Method 2: Web Faucet**
1. Visit: https://faucet.sui.io
2. Select "Testnet"
3. Paste your wallet address
4. Click "Request"

---

## ✅ Step 4: Refresh and Connect

1. **Refresh the page**: Press F5 or Ctrl+R
2. **Click "Connect Wallet"** button in top right
3. **Select your wallet** from the popup
4. **Approve connection** in wallet extension
5. **Check:** Your address should appear in header

---

## 🐛 Common Issues & Fixes

### **Issue 1: "Connect Wallet" Button Does Nothing**

**Cause:** No wallet extension installed

**Fix:**
- Install Sui Wallet (see Step 1)
- Refresh page after installation
- Try clicking again

---

### **Issue 2: "Network Mismatch" Error**

**Cause:** Wallet is on wrong network (Mainnet or Devnet)

**Fix:**
- Open wallet extension
- Switch to **Testnet**
- Refresh page
- Try connecting again

---

### **Issue 3: Connection Popup Doesn't Appear**

**Cause:** Browser blocked the popup or extension not active

**Fix:**
1. Check if browser blocked popup (look for icon in address bar)
2. Allow popups for localhost:3000
3. Make sure wallet extension is enabled
4. Try in different browser (Chrome works best)

---

### **Issue 4: "Insufficient Gas" Error**

**Cause:** No testnet SUI in wallet

**Fix:**
- Get testnet SUI from faucet (see Step 3)
- Wait for transaction to confirm
- Check balance in wallet

---

### **Issue 5: Wallet Connected But Can't Submit Transactions**

**Cause:** Wrong network or insufficient gas

**Fix:**
1. Verify testnet selected in wallet
2. Check SUI balance (need at least 0.01 SUI)
3. Get more from faucet if needed

---

### **Issue 6: Page Not Loading**

**Cause:** Frontend not running or port conflict

**Fix:**
```bash
# Kill any existing processes
pkill -f "next dev"

# Start fresh
cd frontend
npm run dev

# Should see: "Ready on http://localhost:3000"
```

---

## 🔍 How to Check If It's Working

### **When Connected Successfully:**
- ✅ Wallet address shows in header (top right)
- ✅ Address looks like: `0x5faef464c1d6...`
- ✅ Can click "Register New Document"
- ✅ Network shows "Testnet" in wallet

### **When NOT Connected:**
- ❌ Only shows "Connect Wallet" button
- ❌ Can't access document features
- ❌ No address in header

---

## 💻 Browser Console Check

If still having issues:

1. Open browser console: Press F12
2. Go to "Console" tab
3. Look for errors (red text)

### **Common Console Errors:**

**Error:** "Failed to resolve module"
**Fix:** 
```bash
cd frontend
rm -rf node_modules .next
npm install
npm run dev
```

**Error:** "Network request failed"
**Fix:** Check if Sui RPC is responding:
```bash
curl https://fullnode.testnet.sui.io:443
```

**Error:** "Wallet not found"
**Fix:** Install wallet extension and refresh page

---

## 🧪 Test Your Setup

### **Quick Test:**

1. ✅ Wallet installed?
   - Open Extensions in browser
   - See "Sui Wallet" or "Suiet"

2. ✅ On Testnet?
   - Open wallet
   - Check network dropdown says "Testnet"

3. ✅ Have SUI?
   - Check balance in wallet
   - Should have > 0 SUI

4. ✅ Frontend running?
   - Visit http://localhost:3000
   - Page loads with "Fathom Protocol" header

5. ✅ Can connect?
   - Click "Connect Wallet"
   - Popup appears
   - Approve connection
   - Address shows in header

---

## 🎥 For Demo Video

If wallet connection is still not working:

### **Option 1: Record with Mock Data**
Show the UI and explain:
> "Here's where users would connect their Sui wallet. Once connected, they can register documents and submit queries."

### **Option 2: Use Screenshots**
Take screenshots when wallet IS connected:
- Connected state with address
- Document registration screen
- Query submission

### **Option 3: Explain Architecture**
Focus on:
- Smart contract (deployed and verifiable)
- Encryption (working in browser)
- Architecture diagram
- Code walkthrough

---

## 🆘 Still Stuck?

### **Try This Sequence:**

```bash
# 1. Clean everything
cd frontend
pkill -f "next dev"
rm -rf .next node_modules

# 2. Fresh install
npm install

# 3. Start fresh
npm run dev

# 4. In browser:
# - Install Sui Wallet extension
# - Switch to Testnet
# - Visit http://localhost:3000
# - Click "Connect Wallet"
# - Approve in popup
```

### **Alternative: Use Incognito Mode**

Sometimes extensions conflict. Try:
1. Open Incognito/Private window
2. Enable Sui Wallet extension in incognito
3. Visit http://localhost:3000
4. Try connecting

---

## 📋 Checklist Before Demo

- [ ] Sui Wallet extension installed
- [ ] Wallet switched to Testnet
- [ ] Have testnet SUI (check balance)
- [ ] Frontend running (http://localhost:3000)
- [ ] Can see "Connect Wallet" button
- [ ] Click button → popup appears
- [ ] Approve → address shows in header
- [ ] Can click "Register New Document"

---

## ✅ Expected Behavior

**When working correctly:**

```
1. Visit localhost:3000
   → Page loads with Fathom header

2. Click "Connect Wallet"
   → Wallet popup appears

3. Select "Sui Wallet"
   → Extension opens

4. Click "Connect"
   → Popup closes

5. Header shows:
   → "0x5fae...1a20" (your address)
   → Network: Testnet

6. Can now:
   → Register documents
   → Submit queries
   → See transaction history
```

---

## 🎬 For Recording Your Demo

If wallet is working:
- ✅ Show the connection flow
- ✅ Show your address in header
- ✅ Demonstrate transactions

If wallet isn't working but time is short:
- ✅ Focus on encryption (works without wallet)
- ✅ Show architecture and code
- ✅ Explain the flow verbally
- ✅ Show deployed contract on SuiScan

**Judges care more about your innovation than perfect demo!**

---

## 📞 Quick Help

**Most common fix:**
1. Install Sui Wallet
2. Switch to Testnet
3. Get testnet SUI from faucet
4. Refresh page
5. Click "Connect Wallet"

**That solves 90% of issues!**

---

**Good luck!** 🌊
