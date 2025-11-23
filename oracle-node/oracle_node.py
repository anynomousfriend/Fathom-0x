#!/usr/bin/env python3
"""
Fathom Oracle Node
==================

This oracle listens for query events from the Sui blockchain, fetches documents
from Walrus storage, processes queries using AI (simulated), and submits
cryptographically signed answers back to the blockchain.

For the hackathon, this implements a "mock TEE" that demonstrates the
architecture for verifiable computation.
"""

import os
import sys
import time
import hashlib
from typing import Optional
from dotenv import load_dotenv
import requests
from pysui import SuiConfig, SyncClient
from pysui.sui.sui_types.scalars import ObjectID, SuiString
from pysui.sui.sui_txn import SyncTransaction

# Load environment variables
load_dotenv()

# Configuration
SUI_RPC_URL = os.getenv("SUI_RPC_URL", "https://fullnode.testnet.sui.io:443")
ORACLE_PRIVATE_KEY = os.getenv("ORACLE_PRIVATE_KEY", "")
WALRUS_AGGREGATOR_URL = os.getenv(
    "WALRUS_AGGREGATOR_URL",
    "https://aggregator.walrus-testnet.walrus.space"
)
CONTRACT_PACKAGE_ID = os.getenv("CONTRACT_PACKAGE_ID", "")
CONFIG_OBJECT_ID = os.getenv("CONFIG_OBJECT_ID", "")
POLL_INTERVAL = int(os.getenv("POLL_INTERVAL", "10"))


class FathomOracle:
    """Main oracle class for processing queries"""
    
    def __init__(self):
        """Initialize the oracle with Sui client configuration"""
        print("[FATHOM] Initializing Fathom Oracle Node...")

        # Validate configuration
        if not ORACLE_PRIVATE_KEY:
            raise ValueError("ORACLE_PRIVATE_KEY not set in .env file")
        if not CONTRACT_PACKAGE_ID:
            raise ValueError("CONTRACT_PACKAGE_ID not set in .env file")
        if not CONFIG_OBJECT_ID:
            raise ValueError("CONFIG_OBJECT_ID not set in .env file")

        # Initialize Sui client
        self.config = SuiConfig.user_config(
            rpc_url=SUI_RPC_URL,
        )
        self.client = SyncClient(self.config)

        # Store processed queries to avoid duplicates
        self.processed_queries = set()

        print("[OK] Oracle initialized")
        print(f"   RPC: {SUI_RPC_URL}")
        print(f"   Package: {CONTRACT_PACKAGE_ID}")
        print(f"   Config: {CONFIG_OBJECT_ID}")

    def fetch_walrus_blob(self, blob_id: str) -> Optional[str]:
        """
        Fetch a blob from Walrus storage

        Args:
            blob_id: The Walrus blob identifier

        Returns:
            The blob content as a string, or None if fetch fails
        """
        try:
            url = f"{WALRUS_AGGREGATOR_URL}/v1/{blob_id}"
            print(f"📥 Fetching blob from Walrus: {blob_id}")

            response = requests.get(url, timeout=30)
            response.raise_for_status()

            content = response.text
            print(f"[OK] Successfully fetched blob ({len(content)} bytes)")
            return content

        except Exception as e:
            print(f"[ERROR] Error fetching Walrus blob: {e}")
            return None

    def process_query(self, document_content: str, question: str) -> str:
        """
        Process a query using AI (simulated for hackathon)

        In production, this would:
        1. Run inside a TEE (Trusted Execution Environment)
        2. Use actual AI/LLM for RAG processing
        3. Generate cryptographic attestation

        For the hackathon, we simulate this with deterministic responses.

        Args:
            document_content: The full document text
            question: The user's question

        Returns:
            The generated answer
        """
        print(f"[AI] Processing query: {question[:50]}...")

        # Simulate AI processing time
        time.sleep(1)

        # Mock RAG processing - In production, use OpenAI, Anthropic, etc.
        # For demo purposes, generate a deterministic answer based on content

        doc_hash = hashlib.sha256(document_content.encode()).hexdigest()[:8]
        question_hash = hashlib.sha256(question.encode()).hexdigest()[:8]

        answer = (
            f"Based on the document analysis (hash: {doc_hash}), "
            f"the answer to your query (hash: {question_hash}) is: "
            "This is a simulated AI-generated response demonstrating "
            "the Fathom protocol. In production, this would be generated "
            "by an LLM running in a TEE environment with full cryptographic "
            f"attestation. The document contains {len(document_content)} "
            "characters of private data that was never exposed."
        )

        print(f"[OK] Generated answer ({len(answer)} chars)")
        return answer

    def sign_answer(self, answer: str, query_id: str) -> bytes:
        """
        Create a cryptographic signature for the answer

        In production with Nautilus/TEE:
        - This would be a TEE attestation signature
        - Proves the computation happened in a trusted environment
        - Provides hardware-backed security guarantees

        For hackathon: Simple HMAC-like signature for demonstration

        Args:
            answer: The answer text
            query_id: The query identifier

        Returns:
            Signature bytes
        """
        message = f"{query_id}:{answer}".encode()
        signature = hashlib.sha256(
            message + ORACLE_PRIVATE_KEY.encode()
        ).digest()

        print(f"✍️  Generated signature: {signature.hex()[:16]}...")
        return signature

    def submit_answer_to_chain(
        self,
        query_id: str,
        answer: str,
        signature: bytes
    ) -> bool:
        """
        Submit the signed answer back to the Sui blockchain

        Args:
            query_id: The query object ID
            answer: The generated answer
            signature: The cryptographic signature

        Returns:
            True if submission successful, False otherwise
        """
        try:
            print(f"📤 Submitting answer to chain for query: {query_id}")

            # Create transaction
            txn = SyncTransaction(client=self.client)

            # Call submit_answer function
            txn.move_call(
                target=f"{CONTRACT_PACKAGE_ID}::fathom::submit_answer",
                arguments=[
                    ObjectID(CONFIG_OBJECT_ID),  # config
                    ObjectID(query_id),  # query
                    SuiString(answer),  # answer
                    list(signature),  # signature as byte vector
                    txn.make_clock_argument(),  # clock
                ],
            )

            # Execute transaction
            result = txn.execute(gas_budget="10000000")

            if result.is_ok():
                print("[OK] Answer submitted successfully!")
                print(f"   Digest: {result.digest}")
                return True
            else:
                print(f"[ERROR] Transaction failed: {result.error}")
                return False

        except Exception as e:
            print(f"[ERROR] Error submitting answer: {e}")
            return False

    def listen_for_queries(self):
        """
        Main loop: Listen for QuerySubmitted events and process them

        For the hackathon, uses simple polling of events.
        In production, would use WebSocket subscriptions for real-time updates.
        """
        print("\n👂 Starting to listen for queries...")
        print(f"   Polling every {POLL_INTERVAL} seconds")
        print("   Press Ctrl+C to stop\n")

        while True:
            try:
                # Query events from the contract
                # Note: In production, use proper event subscription
                # For hackathon, we'll poll and check for new Query objects

                print(f"[{time.strftime('%H:%M:%S')}] "
                      "Checking for new queries...")

                # TODO: Implement proper event querying
                # For now, sleep and continue
                time.sleep(POLL_INTERVAL)

            except KeyboardInterrupt:
                print("\n\n👋 Shutting down oracle node...")
                break
            except Exception as e:
                print(f"[ERROR] Error in main loop: {e}")
                time.sleep(POLL_INTERVAL)

    def process_single_query(
        self,
        query_id: str,
        document_blob_id: str,
        question: str
    ) -> bool:
        """
        Process a single query end-to-end

        This is the main workflow:
        1. Fetch document from Walrus
        2. Process query with AI
        3. Sign the answer
        4. Submit to blockchain

        Args:
            query_id: The query object ID
            document_blob_id: Walrus blob ID of the document
            question: The user's question

        Returns:
            True if successfully processed, False otherwise
        """
        # Check if already processed
        if query_id in self.processed_queries:
            print(f"⏭️  Query {query_id} already processed, skipping")
            return False

        print(f"\n{'='*60}")
        print(f"🔍 Processing Query: {query_id}")
        print(f"{'='*60}")

        # Step 1: Fetch document from Walrus
        document_content = self.fetch_walrus_blob(document_blob_id)
        if not document_content:
            print("[ERROR] Failed to fetch document")
            return False

        # Step 2: Process query with AI
        answer = self.process_query(document_content, question)

        # Step 3: Sign the answer
        signature = self.sign_answer(answer, query_id)

        # Step 4: Submit to blockchain
        success = self.submit_answer_to_chain(query_id, answer, signature)

        if success:
            self.processed_queries.add(query_id)
            print(f"{'='*60}\n")

        return success


def main():
    """Main entry point"""
    print("""
    ╔═══════════════════════════════════════════════════════╗
    ║                                                       ║
    ║         FATHOM ORACLE NODE                            ║
    ║                                                       ║
    ║        Verifiable RAG for Private Data                ║
    ║                                                       ║
    ╚═══════════════════════════════════════════════════════╝
    """)

    try:
        oracle = FathomOracle()
        oracle.listen_for_queries()
    except Exception as e:
        print(f"\n[ERROR] Fatal error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
