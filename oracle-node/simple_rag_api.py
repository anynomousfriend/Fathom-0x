#!/usr/bin/env python3
"""
Simple RAG API for Fathom-0x Protocol
Provides real document query answering using LLM
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
import json
from dotenv import load_dotenv
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
import base64

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

# Configuration
WALRUS_AGGREGATOR = os.getenv('WALRUS_AGGREGATOR', 'https://aggregator.walrus-testnet.walrus.space')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', '')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', '')

def download_from_walrus(blob_id):
    """Download encrypted document from Walrus"""
    try:
        url = f"{WALRUS_AGGREGATOR}/v1/{blob_id}"
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        return response.content
    except Exception as e:
        print(f"Error downloading from Walrus: {e}")
        return None

def decrypt_document(encrypted_data, key_hex, iv_hex):
    """Decrypt document using AES-256-CBC"""
    try:
        key = bytes.fromhex(key_hex)
        iv = bytes.fromhex(iv_hex)
        
        cipher = Cipher(
            algorithms.AES(key),
            modes.CBC(iv),
            backend=default_backend()
        )
        decryptor = cipher.decryptor()
        
        decrypted = decryptor.update(encrypted_data) + decryptor.finalize()
        
        # Remove padding
        padding_length = decrypted[-1]
        decrypted = decrypted[:-padding_length]
        
        return decrypted.decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"Decryption error: {e}")
        return None

def chunk_text(text, chunk_size=1000, overlap=200):
    """Simple text chunking with overlap"""
    chunks = []
    start = 0
    text_length = len(text)
    
    while start < text_length:
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append(chunk)
        start += (chunk_size - overlap)
    
    return chunks

def simple_semantic_search(chunks, query, top_k=3):
    """Simple keyword-based search (can be enhanced with embeddings)"""
    query_words = set(query.lower().split())
    
    chunk_scores = []
    for i, chunk in enumerate(chunks):
        chunk_words = set(chunk.lower().split())
        # Simple word overlap score
        overlap = len(query_words & chunk_words)
        chunk_scores.append((i, overlap, chunk))
    
    # Sort by score and get top k
    chunk_scores.sort(key=lambda x: x[1], reverse=True)
    return [chunk for _, _, chunk in chunk_scores[:top_k]]

def query_gemini(context, question):
    """Query Google Gemini API"""
    if not GEMINI_API_KEY:
        return None
    
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={GEMINI_API_KEY}"
        
        prompt = f"""Based on the following document context, answer the question accurately and concisely.

Context:
{context}

Question: {question}

Answer:"""
        
        payload = {
            "contents": [{
                "parts": [{
                    "text": prompt
                }]
            }]
        }
        
        response = requests.post(url, json=payload, timeout=30)
        response.raise_for_status()
        
        result = response.json()
        answer = result['candidates'][0]['content']['parts'][0]['text']
        return answer.strip()
    
    except Exception as e:
        print(f"Gemini API error: {e}")
        return None

def query_openai(context, question):
    """Query OpenAI API"""
    if not OPENAI_API_KEY:
        return None
    
    try:
        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {OPENAI_API_KEY}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "gpt-3.5-turbo",
            "messages": [
                {"role": "system", "content": "You are a helpful assistant that answers questions based on provided document context."},
                {"role": "user", "content": f"Context:\n{context}\n\nQuestion: {question}\n\nAnswer:"}
            ],
            "max_tokens": 500,
            "temperature": 0.7
        }
        
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        response.raise_for_status()
        
        result = response.json()
        answer = result['choices'][0]['message']['content']
        return answer.strip()
    
    except Exception as e:
        print(f"OpenAI API error: {e}")
        return None

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'gemini_configured': bool(GEMINI_API_KEY),
        'openai_configured': bool(OPENAI_API_KEY)
    })

@app.route('/query', methods=['POST'])
def query_document():
    """
    Main RAG endpoint
    
    Request body:
    {
        "blob_id": "...",
        "encryption_key": "...",
        "iv": "...",
        "question": "..."
    }
    """
    try:
        data = request.json
        blob_id = data.get('blob_id')
        encryption_key = data.get('encryption_key')
        iv = data.get('iv')
        question = data.get('question')
        
        if not all([blob_id, encryption_key, iv, question]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Step 1: Download from Walrus
        print(f"📥 Downloading blob {blob_id[:20]}...")
        encrypted_data = download_from_walrus(blob_id)
        if not encrypted_data:
            return jsonify({'error': 'Failed to download document from Walrus'}), 500
        
        # Step 2: Decrypt
        print("🔓 Decrypting document...")
        decrypted_text = decrypt_document(encrypted_data, encryption_key, iv)
        if not decrypted_text:
            return jsonify({'error': 'Failed to decrypt document'}), 500
        
        print(f"📄 Document decrypted: {len(decrypted_text)} characters")
        
        # Step 3: Chunk text
        print("✂️  Chunking document...")
        chunks = chunk_text(decrypted_text)
        print(f"📦 Created {len(chunks)} chunks")
        
        # Step 4: Semantic search
        print(f"🔍 Searching for relevant chunks for: '{question}'")
        relevant_chunks = simple_semantic_search(chunks, question, top_k=3)
        context = "\n\n".join(relevant_chunks)
        
        # Step 5: Query LLM
        print("Querying AI model...")
        answer = None
        
        # Try Gemini first (free tier)
        if GEMINI_API_KEY:
            answer = query_gemini(context, question)
        
        # Fallback to OpenAI
        if not answer and OPENAI_API_KEY:
            answer = query_openai(context, question)
        
        if not answer:
            return jsonify({'error': 'No LLM configured. Please set GEMINI_API_KEY or OPENAI_API_KEY'}), 500
        
        print(f"[OK] Answer generated: {len(answer)} characters")
        
        return jsonify({
            'answer': answer,
            'chunks_used': len(relevant_chunks),
            'document_length': len(decrypted_text),
            'model_used': 'gemini' if GEMINI_API_KEY else 'openai'
        })
    
    except Exception as e:
        import traceback
        print(f"[ERROR] Error processing query: {e}")
        print(f"[INFO] Full traceback:")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/query-mock', methods=['POST'])
def query_mock():
    """Mock endpoint for testing without real documents"""
    data = request.json
    question = data.get('question', '')
    
    # Simple keyword-based mock responses
    answer = "This is a mock RAG response. Based on the document analysis, "
    
    if 'conclusion' in question.lower() or 'main' in question.lower():
        answer += "the main conclusion is that the proposed approach shows significant improvements over baseline methods."
    elif 'method' in question.lower():
        answer += "the methodology involves a transformer-based architecture with attention mechanisms."
    elif 'result' in question.lower():
        answer += "the key results show a 15% improvement on benchmark datasets."
    else:
        answer += "the document discusses various aspects of the research topic with detailed analysis and findings."
    
    return jsonify({
        'answer': answer,
        'chunks_used': 3,
        'document_length': 5000,
        'model_used': 'mock'
    })

if __name__ == '__main__':
    print("Starting Fathom RAG API...")
    print(f"Walrus Aggregator: {WALRUS_AGGREGATOR}")
    print(f"Gemini API: {'Configured' if GEMINI_API_KEY else 'Not configured'}")
    print(f"OpenAI API: {'Configured' if OPENAI_API_KEY else 'Not configured'}")
    print("\nGet free API key:")
    print("   Gemini: https://makersuite.google.com/app/apikey")
    print("   OpenAI: https://platform.openai.com/api-keys")
    print("\n[SERVER] Server starting on http://localhost:5000")
    
    app.run(host='0.0.0.0', port=5000, debug=True)
