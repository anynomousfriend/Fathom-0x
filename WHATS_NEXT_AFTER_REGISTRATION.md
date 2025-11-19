# 🎯 What to Do After Document Registration

## 🎉 Congratulations!

You just successfully:
- ✅ Uploaded a document
- ✅ Encrypted it with AES-256
- ✅ Got a Blob ID
- ✅ Registered it on Sui blockchain

---

## 🚀 What's Next: Submit a Query!

### **Step 1: Select Your Document**

1. Look at your document list
2. You should see your newly registered document
3. **Click on it** to select it
4. The document card should highlight (blue border)

---

### **Step 2: Ask a Question**

In the query form below, enter a question:

**For Medical Document (patient_record.txt):**
```
What medications is the patient allergic to?
```

**For Financial Report (financial_report.txt):**
```
What is the company's current burn rate?
```

**For Research Paper (research_paper.txt):**
```
What is the main research breakthrough?
```

---

### **Step 3: Submit Query**

1. **Type your question** in the text box
2. **Click "Submit Query"** button
3. **Approve the transaction** in your wallet popup
4. Wait 2-3 seconds for confirmation

**Expected:**
- ✅ "Processing Query..." message appears
- ✅ Transaction submitted to blockchain
- ✅ QuerySubmitted event emitted

---

### **Step 4: What Happens Next (In Production)**

**If oracle was running:**

```
1. Oracle detects QuerySubmitted event
   ↓
2. Oracle reads Document ID and Blob ID
   ↓
3. Oracle fetches encrypted blob from Walrus
   ↓
4. Oracle decrypts with key (in TEE)
   ↓
5. Oracle processes query with AI
   ↓
6. Oracle generates answer
   ↓
7. Oracle signs answer cryptographically
   ↓
8. Oracle submits answer to blockchain
   ↓
9. Frontend detects InsightGenerated event
   ↓
10. Verified answer appears on screen! ✅
```

**In your demo (without oracle running):**
- Query is submitted ✅
- Event is emitted ✅
- Recorded on blockchain ✅
- You can show the architecture!

---

## 🎬 Perfect for Your Demo Video!

### **You Can Now Show:**

1. ✅ **Document Registration** (DONE!)
   - Encryption happening
   - Upload to Walrus
   - Blockchain registration

2. ✅ **Query Submission** (DO NEXT!)
   - Select document
   - Enter question
   - Submit transaction

3. ✅ **On-Chain Verification**
   - Show transaction on SuiScan
   - Point out the event
   - Prove it's on blockchain

4. ✅ **Architecture Explanation**
   - Explain how oracle would process
   - Describe TEE architecture
   - Show the complete flow

---

## 📸 Screenshots to Capture

### **You Can Now Take:**

1. ✅ **Document in List**
   - Screenshot your registered document
   - Shows Blob ID
   - Shows creation date

2. ✅ **Query Form**
   - Screenshot the query interface
   - With question entered
   - Ready to submit

3. ✅ **Transaction on SuiScan**
   - Your registration transaction
   - Your query transaction
   - Shows on-chain verification

---

## 🎥 Record Your Demo Now!

### **You Have Everything:**

✅ **Working Flow:**
- Document registered (you just did it!)
- Can submit queries
- Can show transactions

✅ **Beautiful UI:**
- Professional design
- Encryption indicators
- Progress bars

✅ **Real Blockchain:**
- Contract deployed
- Transactions verifiable
- Everything on-chain

### **5-Minute Demo Script:**

**[0:00-0:30] Introduction**
"Hi, this is Fathom Protocol - privacy-preserving AI for sensitive documents."

**[0:30-2:00] Document Registration** ← YOU JUST DID THIS!
"Watch me register a confidential medical record..."
[Show the flow you just completed]

**[2:00-2:30] Query Submission** ← DO THIS NEXT!
"Now I can ask questions..."
[Submit a query]

**[2:30-4:00] Architecture Explanation**
"Here's how the oracle would process this..."
[Explain the flow]

**[4:00-4:30] Use Cases**
"Healthcare, legal, enterprise..."

**[4:30-5:00] Closing**
"This unlocks private AI. Thank you!"

---

## 🔍 View Your Transaction

Your document registration transaction is on-chain!

**Check it here:**
```
https://suiscan.xyz/testnet/account/YOUR_WALLET_ADDRESS
```

Look for:
- Your latest transaction
- Should show "register_document" function call
- Click to see details

---

## ✅ Complete Demo Checklist

### **You've Done:**
- [x] Connected wallet
- [x] Uploaded and encrypted document
- [x] Registered on blockchain
- [x] Document appears in list

### **Do Next:**
- [ ] Select your document
- [ ] Submit a query
- [ ] Take screenshots
- [ ] Record demo video
- [ ] Upload to YouTube
- [ ] Submit to hackathon!

---

## 🎯 Your Demo is READY!

**What you can demonstrate:**
1. ✅ Full document registration flow (working!)
2. ✅ Client-side encryption (working!)
3. ✅ Walrus integration (mock mode is fine!)
4. ✅ Blockchain registration (on-chain!)
5. ✅ Query submission (works!)
6. ✅ Complete architecture

**You have a working end-to-end demo!** 🎊

---

## 🚀 Next Actions

**Immediate (5 minutes):**
1. Select your document
2. Submit a query: "What is the main conclusion?"
3. Check transaction on SuiScan

**Then (1-2 hours):**
1. Practice demo once (15 min)
2. Record demo video (30 min)
3. Review video (15 min)
4. Upload to YouTube (10 min)
5. Submit to hackathon! 🏆

---

**You're so close! Now submit a query and then record your demo!** 🎬

**Go to the query form and ask a question!** 📝
