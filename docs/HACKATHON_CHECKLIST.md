# 🏆 DeepSurge Hackathon Submission Checklist

Use this checklist to ensure you've completed everything needed for a winning submission!

## 🏁 Phase 1: The Setup ✅

### Repository Structure
- [x] Git repository initialized
- [x] Professional folder structure created
  - [x] `contracts/` - Sui Move code
  - [x] `oracle-node/` - Python oracle
  - [x] `frontend/` - Next.js app
  - [x] `scripts/` - Deployment scripts
  - [x] `assets/` - Media files
- [x] LICENSE file added (MIT)
- [x] `.gitignore` configured properly
- [ ] Remote repository created (GitHub/GitLab)
- [ ] Repository made public

### Documentation
- [x] README.md created with:
  - [x] Project title and tagline
  - [x] Track declaration (AI x Data)
  - [x] Architecture diagram
  - [x] Technology explanations
  - [x] Quick start guide
  - [ ] Demo video link (add after recording)
  - [ ] Team information (update with your details)
  - [ ] Contact information (update with your details)
- [x] DEPLOYMENT_GUIDE.md created
- [x] ARCHITECTURE.md created
- [x] CONTRIBUTING.md created

## 🛠 Phase 2: The Core Build ✅

### Walrus Integration
- [x] Blob upload script created (`scripts/upload_blob.js`)
- [ ] Walrus CLI installed locally
- [ ] Test document uploaded to Walrus Testnet
- [ ] Blob ID saved for configuration

### Smart Contract (Sui Move)
- [x] Contract code written (`contracts/sources/fathom.move`)
- [x] Move.toml configured
- [ ] Contract compiled successfully (`sui move build`)
- [ ] Contract deployed to Sui Testnet
- [ ] Package ID saved
- [ ] AdminCap ID saved
- [ ] FathomConfig ID saved
- [ ] Contract verified on SuiScan Explorer
- [ ] `deployed_addresses.json` created with IDs

### Oracle Node (Python)
- [x] Oracle script written (`oracle-node/oracle_node.py`)
- [x] Requirements.txt created
- [x] .env.example created
- [ ] Dependencies installed
- [ ] .env file configured with real values
- [ ] Oracle tested and runs without errors
- [ ] Can fetch from Walrus successfully
- [ ] Can sign messages
- [ ] Can submit transactions to Sui

## 🖥 Phase 3: The Frontend ✅

### Setup
- [x] Next.js project scaffolded
- [x] Dependencies configured
- [x] Tailwind CSS setup
- [x] TypeScript configured

### Components
- [x] Header with wallet connect
- [x] Hero/landing page
- [x] Document list component
- [x] Register document modal
- [x] Query form
- [x] Answer display with verification badge
- [x] Providers for Sui integration

### Configuration
- [x] .env.example created
- [ ] .env.local created with real values
- [ ] Package ID configured
- [ ] Config object ID configured

### Testing
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Development server runs (`npm run dev`)
- [ ] Can connect wallet
- [ ] Can view documents
- [ ] Can submit queries
- [ ] Can receive and display answers
- [ ] All UI components work properly

## 🎬 Phase 4: Submission Assets

### Logo & Branding
- [ ] 512x512 PNG logo created
- [ ] Logo added to `assets/` folder
- [ ] Logo added to README
- [ ] Favicon created for frontend

### Screenshots
- [ ] Landing page screenshot
- [ ] Wallet connection screenshot
- [ ] Document list screenshot
- [ ] Query submission screenshot
- [ ] Verified answer screenshot
- [ ] All screenshots added to `assets/`
- [ ] Screenshots added to README

### Architecture Diagram
- [ ] Flow diagram created showing:
  - [ ] User interaction
  - [ ] Sui contract coordination
  - [ ] Oracle processing
  - [ ] Walrus storage
- [ ] Diagram added to `assets/`
- [ ] Diagram embedded in README

### Demo Video (Max 5 minutes)
- [ ] Script written covering:
  - [ ] Problem statement (30s)
  - [ ] Solution overview (30s)
  - [ ] Live demo (3min)
  - [ ] Technology stack (30s)
  - [ ] Conclusion (30s)
- [ ] Video recorded with:
  - [ ] Clear audio
  - [ ] 1080p resolution
  - [ ] Shows both oracle terminal and browser
  - [ ] Explains what's happening
  - [ ] Demonstrates full flow
- [ ] Video edited and polished
- [ ] Video uploaded (YouTube/Vimeo unlisted)
- [ ] Video link added to README

### README Final Review
- [ ] Header with logo and tagline
- [ ] Badges added (license, network, etc.)
- [ ] Track clearly stated
- [ ] Problem explained clearly
- [ ] Solution described concisely
- [ ] Architecture diagram embedded
- [ ] "How it uses Walrus" section (2-3 sentences)
- [ ] "How it uses Sui" section (2-3 sentences)  
- [ ] "How it uses Nautilus" section (2-3 sentences)
- [ ] Quick start guide with actual commands
- [ ] Demo walkthrough section
- [ ] Security model explained
- [ ] Screenshots embedded
- [ ] Demo video embedded
- [ ] Roadmap/future plans
- [ ] Team information complete
- [ ] Contact information complete
- [ ] All placeholder text replaced

## 🚀 Phase 5: DeepSurge Submission

### Pre-Submission Testing
- [ ] Clone repo in new location to test setup
- [ ] Follow DEPLOYMENT_GUIDE.md from scratch
- [ ] Verify all links work in incognito mode
- [ ] Test on different browser
- [ ] Ask friend to review
- [ ] Check video plays correctly
- [ ] Verify GitHub repo is public

### Git Repository
- [ ] All files committed
- [ ] Pushed to main branch
- [ ] Repository description set
- [ ] Topics/tags added (sui, walrus, nautilus, web3, ai)
- [ ] Repository URL copied

### Submission Platform
- [ ] Registered/logged into DeepSurge platform
- [ ] "Submit Project" started
- [ ] Project name: "Fathom Protocol"
- [ ] Tagline: "Verifiable RAG for Private Data on Walrus"
- [ ] Track selected: "AI x Data"
- [ ] Description filled (from README)
- [ ] GitHub URL added and verified
- [ ] Demo video URL added and verified
- [ ] Website URL added (if deployed, else GitHub)
- [ ] Screenshots uploaded (3-5 images)
- [ ] Tags added: sui, walrus, nautilus, rag, privacy, ai
- [ ] Team members added
- [ ] All required fields completed
- [ ] Preview checked thoroughly
- [ ] **SUBMITTED!** 🎉

## 📋 Post-Submission

### Verification (within 1 hour)
- [ ] Received submission confirmation email
- [ ] Project appears in submission list
- [ ] All links work when clicked from submission
- [ ] Video plays in submission
- [ ] Screenshots display correctly

### Optional Enhancements
- [ ] Deploy frontend to Vercel/Netlify
- [ ] Create Twitter thread about project
- [ ] Write blog post explaining architecture
- [ ] Create LinkedIn post
- [ ] Share in relevant Discord servers
- [ ] Prepare for Q&A with judges

## 🎯 Quality Checklist

### Code Quality
- [ ] No obvious bugs
- [ ] Code is well-commented
- [ ] Error handling implemented
- [ ] Console logs removed/minimized
- [ ] No sensitive data in code
- [ ] TypeScript types properly used

### Documentation Quality
- [ ] No spelling errors
- [ ] Consistent formatting
- [ ] Code blocks properly formatted
- [ ] Links all work
- [ ] Images display correctly
- [ ] Professional tone maintained

### Demo Quality
- [ ] Video is clear and audible
- [ ] Demonstrates key features
- [ ] Shows actual working code
- [ ] Explains technical aspects
- [ ] Shows end-to-end flow
- [ ] Enthusiasm and passion evident

## 🏅 Winning Factors

### Technical Excellence
- [x] Uses all three technologies (Walrus, Sui, Nautilus concept)
- [x] Novel use case (private RAG)
- [x] Working implementation
- [ ] Clean, professional code
- [ ] Good architecture

### Innovation
- [x] Solves real problem
- [x] Unique approach
- [x] Clear value proposition
- [ ] Potential for real-world use

### Presentation
- [ ] Clear communication
- [ ] Professional materials
- [ ] Engaging demo
- [ ] Complete documentation
- [ ] Attention to detail

## 📞 Emergency Contacts

### If Something Goes Wrong
- Sui Discord: https://discord.gg/sui
- Walrus Documentation: https://docs.walrus.site
- DeepSurge Support: [Check hackathon platform]

### Common Last-Minute Issues
1. **Video won't upload**: Try different platform (YouTube vs Vimeo)
2. **GitHub not updating**: Force push with `git push -f origin main`
3. **Submission form error**: Screenshot everything and contact support
4. **Links broken**: Double-check all URLs in incognito mode
5. **Deadline approaching**: Submit what you have, perfect later if allowed

## ✨ Final Thoughts

Remember:
- ✅ A working demo beats perfect code
- ✅ Clear explanation beats complex features
- ✅ Enthusiasm beats perfection
- ✅ Submit before deadline, no matter what

You've got this! 🌊🚀

---

**Submission Deadline:** November 23, 2024 (Check exact time!)

**Track:** AI x Data

**Good luck from the Fathom team!** 🌊
