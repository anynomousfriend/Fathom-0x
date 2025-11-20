#!/usr/bin/env python3
"""
Mock Oracle Node for Fathom Protocol Demo
==========================================

This is a simplified mock oracle that simulates the TEE oracle functionality
for demonstration purposes. It doesn't require the full pysui SDK or TEE hardware.

Features:
- Listens for QuerySubmitted events (simulated)
- Generates mock AI responses based on document type
- Shows the complete flow without requiring TEE hardware

For demo purposes only - production would use real TEE attestation.
"""

import json
import time
import random
from datetime import datetime
from typing import Dict, List

# Mock document database (simulates decrypted content)
MOCK_DOCUMENTS = {
    "financial_report": {
        "content": """
        Q4 2024 Financial Report
        
        Revenue: $10.5M (up 25% YoY)
        Net Profit: $2.1M (up 30% YoY)
        Operating Expenses: $8.4M
        
        Key Highlights:
        - Strong growth in enterprise segment
        - Successfully launched new product line
        - Expanded to 3 new markets
        - Customer retention rate: 95%
        
        Outlook: Projected 20% growth in Q1 2025
        """,
        "type": "financial"
    },
    "patient_record": {
        "content": """
        Patient Medical Record
        
        Patient ID: 12345
        Name: [REDACTED for demo]
        Age: 45
        
        Medical History:
        - Hypertension (diagnosed 2020)
        - Type 2 Diabetes (diagnosed 2018)
        - No known allergies
        
        Current Medications:
        - Metformin 500mg twice daily
        - Lisinopril 10mg once daily
        
        Recent Visits:
        - 2024-12-01: Routine checkup - stable condition
        - 2024-11-15: Blood work - HbA1c 6.8%
        
        Recommendations: Continue current medications, follow-up in 3 months
        """,
        "type": "medical"
    },
    "research_paper": {
        "content": """
        Privacy-Preserving Machine Learning in Healthcare
        
        Abstract:
        This paper presents a novel approach to privacy-preserving machine learning
        using Trusted Execution Environments (TEEs) and blockchain technology.
        
        Key Findings:
        1. TEE-based inference maintains 99.8% accuracy vs unprotected models
        2. Blockchain integration ensures audit trails and data provenance
        3. Cryptographic attestation provides verifiable privacy guarantees
        
        Methodology:
        - Deployed models in Intel SGX enclaves
        - Used homomorphic encryption for data preprocessing
        - Validated on healthcare datasets (HIPAA-compliant)
        
        Conclusion:
        TEE-blockchain integration enables secure, privacy-preserving AI for
        sensitive data while maintaining model performance and auditability.
        """,
        "type": "research"
    }
}

# Mock AI responses based on common query types
MOCK_RESPONSES = {
    "financial": {
        "summary": "This financial report shows strong Q4 2024 performance with $10.5M revenue (25% YoY growth) and $2.1M net profit (30% growth). Key highlights include enterprise segment expansion, new product launches, and 95% customer retention.",
        "key_points": "The key points are: 1) Revenue of $10.5M with 25% year-over-year growth, 2) Net profit of $2.1M with 30% growth, 3) Successful expansion into 3 new markets, 4) High customer retention at 95%, and 5) Positive outlook with 20% projected growth for Q1 2025.",
        "conclusion": "The main conclusion is that the company demonstrated strong financial performance in Q4 2024 with significant revenue and profit growth, successful market expansion, and a positive outlook for continued growth.",
        "metrics": "Key metrics from this report: Revenue: $10.5M (+25% YoY), Net Profit: $2.1M (+30% YoY), Operating Expenses: $8.4M, Customer Retention: 95%, Projected Q1 2025 Growth: 20%.",
    },
    "medical": {
        "summary": "This is a patient medical record for a 45-year-old individual with hypertension and type 2 diabetes. Currently on Metformin and Lisinopril with stable condition and good control (HbA1c 6.8%).",
        "conditions": "The patient has two main chronic conditions: Hypertension (diagnosed in 2020) and Type 2 Diabetes (diagnosed in 2018). There are no known drug allergies.",
        "medications": "Current medications include Metformin 500mg taken twice daily for diabetes management, and Lisinopril 10mg taken once daily for blood pressure control.",
        "status": "The patient's current health status is stable. Recent blood work shows HbA1c at 6.8%, which indicates good diabetes control. Routine checkup on December 1st, 2024 confirmed stable condition.",
    },
    "research": {
        "summary": "This research paper presents a novel approach to privacy-preserving machine learning using TEEs and blockchain. The study demonstrates that TEE-based inference maintains 99.8% accuracy while providing cryptographic privacy guarantees.",
        "findings": "The key findings are: 1) TEE-based inference maintains 99.8% accuracy compared to unprotected models, 2) Blockchain integration ensures complete audit trails and data provenance, and 3) Cryptographic attestation provides verifiable privacy guarantees.",
        "methodology": "The research methodology involved deploying ML models in Intel SGX enclaves, using homomorphic encryption for data preprocessing, and validating the approach on HIPAA-compliant healthcare datasets.",
        "conclusion": "The main conclusion is that TEE-blockchain integration successfully enables secure, privacy-preserving AI for sensitive data while maintaining both model performance and full auditability.",
    }
}

class MockOracle:
    """Mock Oracle that simulates TEE processing"""
    
    def __init__(self):
        self.query_count = 0
        self.start_time = datetime.now()
        print("🚀 Mock Oracle Node Starting...")
        print("=" * 60)
        print("⚠️  DEMO MODE: This is a mock oracle for demonstration")
        print("    Real implementation would use TEE hardware + pysui SDK")
        print("=" * 60)
    
    def detect_document_type(self, doc_name: str) -> str:
        """Detect document type from name"""
        name_lower = doc_name.lower()
        if "financial" in name_lower or "report" in name_lower:
            return "financial"
        elif "patient" in name_lower or "medical" in name_lower:
            return "medical"
        elif "research" in name_lower or "paper" in name_lower:
            return "research"
        return "financial"  # default
    
    def detect_query_intent(self, query: str) -> str:
        """Detect what the user is asking about"""
        query_lower = query.lower()
        
        # Check for specific intents
        if any(word in query_lower for word in ["summary", "summarize", "about", "overview"]):
            return "summary"
        elif any(word in query_lower for word in ["key points", "main points", "highlights", "important"]):
            return "key_points" if "financial" else "findings" if "research" else "conditions"
        elif any(word in query_lower for word in ["conclusion", "result", "outcome"]):
            return "conclusion"
        elif any(word in query_lower for word in ["metrics", "numbers", "data", "statistics"]):
            return "metrics" if "financial" else "findings"
        elif any(word in query_lower for word in ["medication", "drugs", "treatment", "prescription"]):
            return "medications"
        elif any(word in query_lower for word in ["status", "condition", "health", "current"]):
            return "status"
        elif any(word in query_lower for word in ["method", "how", "approach", "process"]):
            return "methodology"
        
        return "summary"  # default to summary
    
    def generate_answer(self, query: str, doc_name: str, doc_type: str) -> str:
        """Generate a mock answer based on query and document type"""
        intent = self.detect_query_intent(query)
        
        # Get appropriate response
        if doc_type in MOCK_RESPONSES and intent in MOCK_RESPONSES[doc_type]:
            return MOCK_RESPONSES[doc_type][intent]
        elif doc_type in MOCK_RESPONSES and "summary" in MOCK_RESPONSES[doc_type]:
            return MOCK_RESPONSES[doc_type]["summary"]
        
        # Fallback generic response
        return f"Based on the document '{doc_name}', {query.lower()}. This is a privacy-preserving response generated securely within the TEE environment."
    
    def simulate_tee_processing(self, query_data: Dict) -> Dict:
        """Simulate TEE processing with mock attestation"""
        
        # Extract query details
        query_id = query_data.get("query_id", f"query_{self.query_count}")
        document_id = query_data.get("document_id", "unknown")
        document_name = query_data.get("document_name", "document.txt")
        query_text = query_data.get("query", "")
        
        print(f"\n{'='*60}")
        print(f"📥 Processing Query #{self.query_count + 1}")
        print(f"{'='*60}")
        print(f"Query ID: {query_id}")
        print(f"Document: {document_name} (ID: {document_id[:16]}...)")
        print(f"Question: {query_text}")
        
        # Simulate TEE operations
        print(f"\n🔐 Simulating TEE Operations:")
        time.sleep(0.5)
        print(f"  ✓ TEE enclave initialized")
        time.sleep(0.3)
        print(f"  ✓ Document decrypted inside TEE")
        time.sleep(0.3)
        print(f"  ✓ AI model loaded in secure memory")
        time.sleep(0.5)
        print(f"  ✓ Query processed with privacy guarantees")
        
        # Detect document type and generate answer
        doc_type = self.detect_document_type(document_name)
        answer = self.generate_answer(query_text, document_name, doc_type)
        
        print(f"\n🤖 AI Response Generated:")
        print(f"  Type: {doc_type.upper()}")
        print(f"  Length: {len(answer)} characters")
        print(f"  Preview: {answer[:100]}...")
        
        # Simulate encryption
        time.sleep(0.3)
        print(f"\n🔒 Encrypting Response:")
        print(f"  ✓ AES-256 encryption applied")
        encrypted_answer = self._mock_encrypt(answer)
        print(f"  ✓ Encrypted size: {len(encrypted_answer)} bytes")
        
        # Generate mock attestation
        attestation = self._generate_mock_attestation(query_id, document_id)
        print(f"\n🛡️  TEE Attestation Generated:")
        print(f"  ✓ Attestation hash: {attestation['hash'][:32]}...")
        print(f"  ✓ Timestamp: {attestation['timestamp']}")
        
        self.query_count += 1
        
        # Return result
        result = {
            "query_id": query_id,
            "document_id": document_id,
            "encrypted_answer": encrypted_answer,
            "attestation": attestation,
            "processed_at": datetime.now().isoformat(),
            "answer_preview": answer[:200] + "..." if len(answer) > 200 else answer
        }
        
        print(f"\n✅ Query Processed Successfully!")
        print(f"{'='*60}\n")
        
        return result
    
    def _mock_encrypt(self, text: str) -> str:
        """Mock encryption (just base64 for demo)"""
        import base64
        return base64.b64encode(text.encode()).decode()
    
    def _generate_mock_attestation(self, query_id: str, document_id: str) -> Dict:
        """Generate mock TEE attestation"""
        import hashlib
        
        attestation_data = f"{query_id}:{document_id}:{time.time()}"
        attestation_hash = hashlib.sha256(attestation_data.encode()).hexdigest()
        
        return {
            "hash": attestation_hash,
            "timestamp": datetime.now().isoformat(),
            "tee_type": "Mock TEE (Intel SGX simulation)",
            "version": "1.0.0-demo",
            "query_id": query_id,
            "document_id": document_id
        }
    
    def process_pending_queries(self):
        """Simulate checking for pending queries"""
        # For demo, we'll generate some sample queries
        sample_queries = [
            {
                "query_id": "0x" + "a" * 64,
                "document_id": "0x" + "b" * 64,
                "document_name": "financial_report.txt",
                "query": "What are the key financial metrics?"
            },
            {
                "query_id": "0x" + "c" * 64,
                "document_id": "0x" + "d" * 64,
                "document_name": "patient_record.txt",
                "query": "What medications is the patient currently taking?"
            },
            {
                "query_id": "0x" + "e" * 64,
                "document_id": "0x" + "f" * 64,
                "document_name": "research_paper.pdf",
                "query": "What are the main conclusions of this research?"
            }
        ]
        
        return sample_queries
    
    def run_demo_mode(self):
        """Run in demo mode with sample queries"""
        print("\n🎬 Starting Demo Mode")
        print("Processing sample queries to demonstrate functionality...\n")
        
        sample_queries = self.process_pending_queries()
        results = []
        
        for query_data in sample_queries:
            result = self.simulate_tee_processing(query_data)
            results.append(result)
            time.sleep(1)  # Pause between queries
        
        # Print summary
        print(f"\n{'='*60}")
        print(f"📊 Demo Summary")
        print(f"{'='*60}")
        print(f"Total Queries Processed: {self.query_count}")
        print(f"Oracle Uptime: {datetime.now() - self.start_time}")
        print(f"Average Processing Time: ~2 seconds")
        print(f"\n✅ All sample queries processed successfully!")
        print(f"{'='*60}\n")
        
        return results
    
    def run_interactive_mode(self):
        """Run in interactive mode for live testing"""
        print("\n🎮 Interactive Mode")
        print("Enter query details to test oracle processing")
        print("Type 'exit' to quit\n")
        
        while True:
            try:
                print("\n" + "─" * 60)
                doc_name = input("📄 Document name (or 'exit'): ").strip()
                if doc_name.lower() == 'exit':
                    break
                
                query_text = input("❓ Your question: ").strip()
                if not query_text:
                    print("❌ Query cannot be empty")
                    continue
                
                query_data = {
                    "query_id": f"0x{random.randbytes(32).hex()}",
                    "document_id": f"0x{random.randbytes(32).hex()}",
                    "document_name": doc_name,
                    "query": query_text
                }
                
                result = self.simulate_tee_processing(query_data)
                
                print(f"\n📤 Result:")
                print(f"  Answer Preview: {result['answer_preview']}")
                
            except KeyboardInterrupt:
                print("\n\n👋 Exiting interactive mode...")
                break
            except Exception as e:
                print(f"❌ Error: {e}")

def main():
    """Main entry point"""
    import sys
    
    oracle = MockOracle()
    
    # Check command line arguments
    if len(sys.argv) > 1 and sys.argv[1] == "--interactive":
        oracle.run_interactive_mode()
    else:
        oracle.run_demo_mode()
    
    print("\n👋 Mock Oracle Shutdown Complete")

if __name__ == "__main__":
    main()
