# How to Find Your Document Object ID

After you register a document on the blockchain, you'll get a **Document Object ID** that you can use to submit queries. Here are three ways to find it:

---

## Method 1: Via SuiScan Explorer (Easiest)

### Step 1: Find Your Registration Transaction

1. Go to **SuiScan Testnet Explorer**:
 ```
 https://suiscan.xyz/testnet/account/YOUR_WALLET_ADDRESS
 ```
 Replace `YOUR_WALLET_ADDRESS` with your actual wallet address

2. Look for your recent transaction with:
 - **Function**: `register_document`
 - **Time**: When you just registered the document

3. **Click on the transaction** to view details

### Step 2: Find the Created Document Object

1. Scroll down to the **"Object Changes"** or **"Created Objects"** section

2. Look for an object with type:
 ```
 YOUR_PACKAGE_ID::fathom::Document
 ```

3. **Copy the Object ID** - it looks like:
 ```
 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
 ```

4. This is your **Document Object ID**!

### Step 3: Use It for Queries

Now you can use this Object ID to submit queries programmatically or manually test the contract.

---

## Method 2: Via Browser Console (For Developers)

### Step 1: Open Browser DevTools

1. On your Fathom-0x Protocol frontend, press **F12** or right-click **Inspect**
2. Go to the **Console** tab

### Step 2: Check the Registration Transaction

When you register a document, the transaction result is logged. Look for:

```javascript
 Document registered: {
 digest: "...",
 effects: {
 created: [
 {
 reference: {
 objectId: "0x123..." // This is your Document ID!
 }
 }
 ]
 }
}
```

### Step 3: Copy the Object ID

The `objectId` field in the created objects array is your Document Object ID.

---

## Method 3: Via Sui CLI (For Advanced Users)

If you have the Sui CLI installed, you can query your owned objects:

### Step 1: List Your Owned Objects

```bash
sui client objects --json
```

### Step 2: Filter for Document Type

Look for objects with type:
```
YOUR_PACKAGE_ID::fathom::Document
```

### Step 3: Get Document Details

```bash
sui client object YOUR_DOCUMENT_ID
```

This will show you all the document details including:
- Blob ID
- Name
- Description
- Created timestamp

---

## Method 4: Via Frontend (Now Automatic!)

After implementing the document fetching feature, the frontend now automatically:

1. Fetches all your registered documents from the blockchain
2. Displays them in the document list
3. Shows the Object ID when you hover or click

**No manual lookup needed!** Just register a document and it will appear in your list.

---

## Visual Guide

### What to Look For:

**In SuiScan Transaction Details:**
```
Object Changes
└── Created Objects
 └── Type: 0xabc...::fathom::Document
 └── Object ID: 0x123...456... COPY THIS!
```

**In Browser Console:**
```javascript
Document registered: {
 effects: {
 created: [
 { reference: { objectId: "0x123...456..." } } COPY THIS!
 ]
 }
}
```

---

## Common Use Cases

### For Demo/Testing:

Once you have the Document Object ID, you can:

1. **Submit queries via frontend** - Just select the document from the list
2. **Test via Sui CLI**:
 ```bash
 sui client call \
 --package YOUR_PACKAGE_ID \
 --module fathom \
 --function submit_query \
 --args YOUR_DOCUMENT_ID "What is this about?" 0x6
 ```
3. **Build custom integrations** - Use the Document ID in your own apps

### For Hackathon Demo:

1. Register a document
2. Find the Object ID using Method 1 (SuiScan)
3. Take a screenshot showing:
 - The transaction on SuiScan
 - The created Document object
 - The Object ID
4. Show how you can query it in your demo!

---

## Verification

To verify you have the correct Document Object ID, you can:

1. **Check via SuiScan**:
 ```
 https://suiscan.xyz/testnet/object/YOUR_DOCUMENT_ID
 ```

2. **Check the object details** - it should show:
 - Type: `Document`
 - Owner: Your wallet address
 - Fields: name, description, walrus_blob_id, etc.

---

## Troubleshooting

**Problem: Can't find the Document Object**

- Make sure the transaction succeeded (check for success status)
- Verify you're looking at the correct wallet address
- Check that you're on Testnet (not Mainnet or Devnet)

**Problem: Object ID doesn't work in queries**

- Verify the Object ID format (should start with `0x`)
- Make sure you're the owner of the document
- Check that the object type is `Document` (not `Query` or other types)

**Problem: Frontend not showing documents**

- Wait 5-10 seconds for auto-refresh
- Check browser console for errors
- Verify `NEXT_PUBLIC_PACKAGE_ID` is set correctly in `.env.local`

---

## Example

Let's say you just registered "Financial Report.pdf":

1. Transaction on SuiScan shows:
 - Created Object: `0xabc123def456...`
 - Type: `0x789...::fathom::Document`

2. You copy the Object ID: `0xabc123def456...`

3. Now you can:
 - See it in your frontend document list
 - Submit queries to it
 - Share it in your demo

---

**Your documents are now live on the blockchain!**
