# Demo Sample Documents

**These files are for live demo purposes.**

## Available Documents

### 1. financial_report.txt
- **Content**: Q3 2024 financial data with revenue, expenses, profit
- **Best Query**: "What was the Q3 revenue?" or "What was the profit margin?"
- **Size**: ~1.2 KB

### 2. patient_record.txt
- **Content**: Sample patient medical record with medications and vitals
- **Best Query**: "What medications is the patient taking?" or "What is the patient's blood pressure?"
- **Size**: ~1.5 KB

### 3. research_paper.txt
- **Content**: Academic research paper abstract with findings
- **Best Query**: "What are the key findings?" or "What methodology was used?"
- **Size**: ~2 KB

### 4. test_document.txt
- **Content**: Simple test document for quick demos
- **Best Query**: "Summarize this document"
- **Size**: ~0.5 KB

## Quick Upload Commands

### Pre-upload before demo:
```bash
cd demo_files

# Upload financial report
walrus store financial_report.txt --epochs 5
# Save Blob ID: _______________

# Upload patient record
walrus store patient_record.txt --epochs 5
# Save Blob ID: _______________

# Upload research paper
walrus store research_paper.txt --epochs 5
# Save Blob ID: _______________
```

### During demo (if HTTP fails):
```bash
# Quick CLI upload
cd demo_files
walrus store financial_report.txt --epochs 5

# Copy the blob ID from output
# Paste into UI: "Enter Blob ID manually"
```

## Recommended Demo Flow

1. **Use financial_report.txt** (most relatable)
2. **Query**: "What was the Q3 revenue?"
3. **Shows**: Clear business value, financial use case

## File Locations
- **Original files**: `demo_files/`
- **After encryption**: Browser will create `encrypted_*.enc` (temporary)
- **On Walrus**: Blob IDs stored on-chain

---

**Keep this folder for demos and testing only.**
