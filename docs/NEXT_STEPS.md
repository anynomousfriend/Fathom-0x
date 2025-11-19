# 🚀 Next Steps - What You Need to Do

This file contains the remaining manual steps to complete your Fathom Protocol submission for the DeepSurge Hackathon.

## ⚠️ Critical: Do These Before Submission

### 1. Create GitHub Repository (10 minutes)

```bash
# Create a new repository on GitHub
# Name: fathom-protocol (or fathom)
# Description: Verifiable RAG for Private Data on Walrus
# Public repository

# Then push your code:
git remote add origin https://github.com/YOUR_USERNAME/fathom-protocol.git
git branch -M main
git push -u origin main
```

### 2. Update Personal Information (5 minutes)

Edit these files and replace placeholders:

**README.md:**
- Line 206: Update GitHub link
- Line 207: Update Twitter link
- Line 208: Update email

**PROJECT_SUMMARY.md:**
- "Team" section: Add your name and links

**CONTRIBUTING.md:**
- Line 135: Update email

### 3. Install Required Tools (30 minutes)

#### Sui CLI
```bash
# Install Rust first if needed
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Sui CLI
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui

# Verify installation
sui --version
```

#### Walrus CLI
```bash
# Visit: https://docs.walrus.site/usage/setup.html
# Follow the installation instructions for your platform
# This varies by OS and is updated frequently
```

#### Configure Sui Wallet
```bash
# Create/import wallet
sui client

# Switch to testnet
sui client switch --env testnet

# Get testnet SUI from faucet
# Join Sui Discord: https://discord.gg/sui
# Use #testnet-faucet channel
# Post: !faucet YOUR_ADDRESS
```

### 4. Deploy Smart Contract (15 minutes)

```bash
cd contracts

# Build contract
sui move build

# Deploy to testnet
sui client publish --gas-budget 50000000

# SAVE THESE VALUES:
# - Package ID: 0x...
# - AdminCap Object ID: 0x...
# - FathomConfig Object ID: 0x...

# Verify on explorer
# Visit: https://suiscan.xyz/testnet/object/YOUR_PACKAGE_ID
```

Create `deployed_addresses.json`:
```json
{
  "packageId": "0x...",
  "adminCapId": "0x...",
  "configObjectId": "0x...",
  "network": "testnet",
  "deployedAt": "2024-11-XX",
  "deployer": "0x..."
}
```

### 5. Upload Sample Document to Walrus (10 minutes)

```bash
# Upload the sample document
walrus store assets/sample_document.txt

# SAVE THE BLOB ID: blob_xxx...

# Or create your own document:
echo "Your confidential research paper..." > my_document.txt
walrus store my_document.txt
```

Create `walrus_blob_info.json`:
```json
{
  "blobId": "blob_xxx...",
  "fileName": "sample_document.txt",
  "uploadedAt": "2024-11-XX",
  "url": "https://aggregator.walrus-testnet.walrus.space/v1/blob_xxx..."
}
```

### 6. Configure Oracle Node (10 minutes)

```bash
cd oracle-node

# Create .env file
cp .env.example .env

# Edit .env with your values:
nano .env
```

Fill in:
```env
SUI_RPC_URL=https://fullnode.testnet.sui.io:443
ORACLE_PRIVATE_KEY=suiprivkey1q...  # From: sui keytool export
WALRUS_AGGREGATOR_URL=https://aggregator.walrus-testnet.walrus.space
CONTRACT_PACKAGE_ID=0x...  # From deployment
CONFIG_OBJECT_ID=0x...     # From deployment
```

Test oracle:
```bash
# Install dependencies
pip install -r requirements.txt

# Run oracle
python3 oracle_node.py

# Should see: "🌊 Initializing Fathom Oracle Node..."
```

### 7. Configure Frontend (10 minutes)

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local
cp .env.example .env.local

# Edit .env.local
nano .env.local
```

Fill in:
```env
NEXT_PUBLIC_SUI_NETWORK=testnet
NEXT_PUBLIC_SUI_RPC_URL=https://fullnode.testnet.sui.io:443
NEXT_PUBLIC_PACKAGE_ID=0x...      # From deployment
NEXT_PUBLIC_CONFIG_OBJECT_ID=0x... # From deployment
NEXT_PUBLIC_WALRUS_AGGREGATOR_URL=https://aggregator.walrus-testnet.walrus.space
```

Test frontend:
```bash
npm run dev
# Visit: http://localhost:3000
```

### 8. End-to-End Test (15 minutes)

1. **Start Oracle** (in one terminal):
   ```bash
   cd oracle-node
   python3 oracle_node.py
   ```

2. **Start Frontend** (in another terminal):
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test Flow**:
   - Open http://localhost:3000
   - Connect Sui Wallet
   - Register document with Walrus Blob ID
   - Submit a query
   - Wait for oracle to process
   - Verify answer appears with signature

### 9. Create Visual Assets (30 minutes)

#### Logo (512x512 PNG)
- Use Canva: https://www.canva.com
- Search: "Tech Logo" or "Ocean Logo"
- Colors: Blue (#2563eb), Cyan (#06b6d4)
- Save as: `assets/logo.png`

#### Screenshots
Capture these:
1. Landing page: `assets/screenshot-landing.png`
2. Document list: `assets/screenshot-documents.png`
3. Query form: `assets/screenshot-query.png`
4. Verified answer: `assets/screenshot-answer.png`

Update README.md to reference these images.

#### Architecture Diagram
- Use Draw.io: https://app.diagrams.net
- Create flow: User → Sui → Oracle → Walrus
- Save as: `assets/architecture-diagram.png`
- Update README.md with the image

### 10. Record Demo Video (45 minutes)

#### Script (5 minutes)
```
[0:00-0:30] Introduction
"Hi, I'm [Name] presenting Fathom Protocol - verifiable RAG for private data"

[0:30-1:00] Problem
"Current AI systems require uploading sensitive data to centralized servers..."

[1:00-2:30] Live Demo
- Show wallet connection
- Register document
- Submit query
- Show oracle terminal processing
- Display verified answer

[2:30-3:30] Technology Stack
"Walrus provides decentralized storage, Sui coordinates verification..."

[3:30-4:00] Future Plans
"Next steps include full TEE integration with Nautilus..."

[4:00-4:30] Conclusion
"Thank you! Questions welcome."
```

#### Recording (30 minutes)
- Use OBS Studio (free): https://obsproject.com
- Split screen: Terminal (left) + Browser (right)
- Record in 1080p
- Clear audio (use good microphone)

#### Upload (10 minutes)
- YouTube (unlisted): https://studio.youtube.com
- Or Vimeo: https://vimeo.com
- Add title: "Fathom Protocol - DeepSurge Hackathon Demo"
- Add description with GitHub link
- Copy video URL

### 11. Update README (10 minutes)

Update README.md with:
- [ ] Add actual Package ID
- [ ] Add demo video link (line after "Demo Video")
- [ ] Add screenshot images
- [ ] Update team section with your info
- [ ] Update contact information

```bash
# Commit changes
git add -A
git commit -m "docs: Add deployment info and demo assets"
git push
```

### 12. Submit to DeepSurge (15 minutes)

1. **Login**: Visit hackathon platform
2. **Create Submission**:
   - Project Name: **Fathom Protocol**
   - Tagline: **Verifiable RAG for Private Data on Walrus**
   - Track: **AI x Data**
   - Description: Copy from README introduction
   - GitHub: Your repository URL
   - Demo Video: YouTube/Vimeo URL
   - Website: GitHub URL (or deployed frontend)
   - Upload screenshots (3-5 images)

3. **Review**:
   - [ ] All links work
   - [ ] Video plays
   - [ ] Screenshots display
   - [ ] Information is accurate

4. **SUBMIT!** 🎉

### 13. Verification (5 minutes)

After submission:
- [ ] Test all links in incognito mode
- [ ] Verify video plays
- [ ] Check submission appears in list
- [ ] Save confirmation email

## ⏰ Time Estimate

| Task | Time | Priority |
|------|------|----------|
| GitHub setup | 10 min | HIGH |
| Install tools | 30 min | HIGH |
| Deploy contract | 15 min | HIGH |
| Upload to Walrus | 10 min | HIGH |
| Configure oracle | 10 min | HIGH |
| Configure frontend | 10 min | HIGH |
| End-to-end test | 15 min | HIGH |
| Create assets | 30 min | MEDIUM |
| Record video | 45 min | HIGH |
| Update README | 10 min | MEDIUM |
| Submit | 15 min | HIGH |
| Verify | 5 min | HIGH |
| **TOTAL** | **3-4 hours** | |

## 💡 Pro Tips

1. **Test Early**: Don't wait until submission day to deploy
2. **Record Multiple Takes**: Video is crucial, make it good
3. **Show Enthusiasm**: Judges want to see your passion
4. **Explain Clearly**: Assume judges aren't blockchain experts
5. **Keep Calm**: Technical issues happen, have backups ready

## 🆘 If You Get Stuck

### Can't deploy contract?
- Check you have testnet SUI
- Increase gas: `--gas-budget 100000000`
- Ask in Sui Discord #dev-help

### Walrus not working?
- Check Walrus docs: https://docs.walrus.site
- Verify CLI installation
- Ask in Walrus Discord

### Oracle not processing?
- Double-check .env values
- Verify contract addresses
- Check oracle logs for errors

### Short on time?
Priority order:
1. Deploy contract (required)
2. Record video (required)
3. Submit (required)
4. Everything else (nice to have)

## ✅ Final Checklist

Before submission:
- [ ] Contract deployed and verified
- [ ] Oracle runs without errors
- [ ] Frontend connects to wallet
- [ ] Demo video recorded and uploaded
- [ ] README updated with real info
- [ ] GitHub repo is public
- [ ] All links tested
- [ ] Submitted to platform

## 🎉 After Submission

1. Tweet about your project
2. Share in Discord communities
3. Write a blog post (optional)
4. Relax - you did it! 🌊

---

**Deadline: November 23, 2024**

**You've got this! The hard work is done, now execute! 🚀**
