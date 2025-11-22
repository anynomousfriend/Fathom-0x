#!/bin/bash

clear

cat << 'BANNER'
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║        [FATHOM] FATHOM-0x PROTOCOL - TEE DEMO LAUNCHER [SECURE]          ║
║                                                              ║
║          Privacy-Preserving RAG with Trusted Execution       ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝

BANNER

echo ""
echo "Choose your demo mode:"
echo ""
echo "  1️⃣  Visual Demo (Auto-play, ~30 seconds)"
echo "  2️⃣  Interactive Demo (Press Enter to advance) ⭐ RECOMMENDED"
echo "  3️⃣  Test Everything (Verify all components)"
echo "  4️⃣  Read Quick Reference"
echo ""
read -p "Enter choice (1-4): " choice

case $choice in
  1)
    echo ""
    echo "🎬 Starting Visual Demo..."
    echo ""
    ./START_TEE_DEMO.sh
    ;;
  2)
    echo ""
    echo "🎬 Starting Interactive Demo..."
    echo ""
    echo "[TIP] TIP: Press Enter to advance through each step"
    echo "        Great for live presentations!"
    echo ""
    read -p "Press Enter to begin..."
    ./START_TEE_DEMO.sh --live
    ;;
  3)
    echo ""
    echo "[TEST] Running System Tests..."
    echo ""
    ./TEST_EVERYTHING.sh
    ;;
  4)
    echo ""
    echo "📖 Opening Quick Reference..."
    echo ""
    if command -v less &> /dev/null; then
      less QUICK_REFERENCE.md
    else
      cat QUICK_REFERENCE.md
    fi
    ;;
  *)
    echo ""
    echo "[ERROR] Invalid choice. Running interactive demo by default..."
    echo ""
    ./START_TEE_DEMO.sh --live
    ;;
esac

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                      Demo Complete! [OK]                        ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "📚 Documentation:"
echo "   • DEMO_SUMMARY.md         - Complete overview"
echo "   • TEE_DEMO_README.md      - Master guide"
echo "   • QUICK_REFERENCE.md      - Quick reference card"
echo ""
echo "[START] Next Steps:"
echo "   • Practice narration"
echo "   • Read Q&A preparation in TEE_DEMO_README.md"
echo "   • Test full stack: cd frontend && npm run dev"
echo ""
echo "💪 You're ready to present!"
echo ""
