# Demo Workflow with Manual Upload

## Quick Test Steps:

1. **Start Frontend**
   ```bash
   cd frontend && npm run dev
   ```

2. **Open Browser**
   - Navigate to http://localhost:3002
   - Connect Sui wallet

3. **Register Document**
   - Click "Register New Document"
   - Select `test_document.txt`
   - Name: "Test Demo Document"
   - Description: "Testing manual upload feature"
   - Click "Encrypt & Upload"

4. **If HTTP Upload Fails:**
   - Click "Download Encrypted File"
   - File saves to ~/Downloads
   
5. **Upload via CLI**
   ```bash
   cd ~/Downloads
   walrus store encrypted_test_document.txt.enc --epochs 5
   ```

6. **Copy Blob ID and Continue**
   - Click "Enter Blob ID Manually"
   - Paste the Blob ID
   - Click "Register Document"

## Demo Ready! 🎉
