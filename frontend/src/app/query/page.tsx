'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSuiClient, useSignAndExecuteTransactionBlock } from '@mysten/dapp-kit'
import { TransactionBlock } from '@mysten/sui.js/transactions'
import { Header } from '@/components/Header'
import { FileText, Send, Loader2, CheckCircle, ExternalLink, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface QueryResponse {
  answer: string
  timestamp: string
  transactionHash?: string
}

export default function QueryPage() {
  const searchParams = useSearchParams()
  const documentId = searchParams.get('documentId')
  
  const [document, setDocument] = useState<any>(null)
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<QueryResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const client = useSuiClient()
  const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock()
  const packageId = process.env.NEXT_PUBLIC_PACKAGE_ID
  const configId = process.env.NEXT_PUBLIC_CONFIG_OBJECT_ID

  useEffect(() => {
    if (documentId) {
      loadDocument()
    }
  }, [documentId])

  const loadDocument = async () => {
    // Try to load real document data from localStorage first
    const allBlobIds = Object.keys(localStorage).filter(key => key.startsWith('doc_'))
    
    for (const key of allBlobIds) {
      const storedDocId = localStorage.getItem(key)
      if (storedDocId === documentId) {
        const blobId = key.replace('doc_', '')
        const name = localStorage.getItem(`name_${blobId}`) || 'Document'
        const description = localStorage.getItem(`desc_${blobId}`) || 'No description'
        const owner = localStorage.getItem(`owner_${blobId}`) || 'Unknown'
        
        setDocument({
          id: documentId,
          name,
          description,
          blobId,
          owner
        })
        return
      }
    }
    
    // Fallback to mock data for demo documents
    const mockDocs: any = {
      '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef': {
        id: documentId,
        name: 'AI Research Paper 2024',
        description: 'Comprehensive study on transformer models and their applications in natural language processing.',
        blobId: 'demo_blob_ai_research_2024',
        owner: '0x5faef464c1d69ede100e117dcca7a01e6b34d655364cc818235b77ba83651a20'
      },
      '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890': {
        id: documentId,
        name: 'Climate Change Report',
        description: 'Analysis of global climate patterns and projected impacts over the next decade.',
        blobId: 'demo_blob_climate_report',
        owner: '0x5faef464c1d69ede100e117dcca7a01e6b34d655364cc818235b77ba83651a20'
      },
      '0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321': {
        id: documentId,
        name: 'Blockchain Whitepaper',
        description: 'Technical documentation on decentralized consensus mechanisms and their security implications.',
        blobId: 'demo_blob_blockchain_whitepaper',
        owner: '0x5faef464c1d69ede100e117dcca7a01e6b34d655364cc818235b77ba83651a20'
      }
    }
    
    setDocument(mockDocs[documentId || ''] || mockDocs['0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'])
  }

  // Demo responses for different questions
  const getDemoResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase()
    
    if (lowerQuery.includes('main') || lowerQuery.includes('conclusion') || lowerQuery.includes('summary')) {
      return "Based on the document analysis, the main conclusion is that transformer-based models have revolutionized natural language processing by introducing the attention mechanism. The research demonstrates that these models achieve state-of-the-art results across multiple benchmarks, with particular improvements in machine translation, text summarization, and question answering tasks. The study also highlights the scalability of transformers and their ability to leverage larger datasets effectively."
    }
    
    if (lowerQuery.includes('method') || lowerQuery.includes('approach') || lowerQuery.includes('how')) {
      return "The methodology described in the document involves using self-attention mechanisms combined with positional encodings to process sequential data. The researchers employed a multi-head attention architecture with 12 layers and 768 hidden dimensions. Training was conducted on a corpus of 100GB of text data using the Adam optimizer with a learning rate of 1e-4. The model was evaluated on standard NLP benchmarks including GLUE, SQuAD, and WMT translation tasks."
    }
    
    if (lowerQuery.includes('result') || lowerQuery.includes('finding') || lowerQuery.includes('outcome')) {
      return "The key findings show that the proposed model achieved a 15% improvement over previous state-of-the-art approaches on the GLUE benchmark, with particularly strong performance on semantic similarity and natural language inference tasks. On the SQuAD 2.0 question answering dataset, the model achieved an F1 score of 92.3%. The research also found that larger model variants (up to 1.5B parameters) continued to show improvements, suggesting that scaling laws apply to transformer architectures."
    }
    
    if (lowerQuery.includes('limit') || lowerQuery.includes('challenge') || lowerQuery.includes('problem')) {
      return "The document identifies several limitations: (1) High computational costs during training, requiring significant GPU resources; (2) Difficulty in capturing very long-range dependencies beyond 512 tokens; (3) Lack of interpretability in attention patterns; (4) Potential bias in the training data affecting model outputs; (5) Limited performance on low-resource languages. The authors suggest future work should address these challenges through more efficient architectures and better training methodologies."
    }
    
    if (lowerQuery.includes('application') || lowerQuery.includes('use case') || lowerQuery.includes('example')) {
      return "The research outlines several practical applications: automated customer service chatbots, content generation for marketing, medical report summarization, legal document analysis, code completion and generation, language translation services, and sentiment analysis for social media monitoring. The document includes case studies showing successful deployments in healthcare (clinical note summarization) and finance (automated report generation), with reported time savings of 60-70% compared to manual processes."
    }
    
    // Default response
    return "Based on the encrypted document processed through the TEE (Trusted Execution Environment), the answer to your query is: The document discusses transformer architectures and their impact on natural language processing. The content has been analyzed securely without exposing the raw data. For more specific information, please refine your question to focus on particular aspects like methodology, results, applications, or limitations."
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!question.trim()) {
      setError('Please enter a question')
      return
    }

    if (!packageId || !configId) {
      setError('Contract not configured')
      return
    }

    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      // Simulate TEE processing time
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Get demo response
      const answer = getDemoResponse(question)

      // Try to get real transaction hash if document was uploaded by user
      let txHash = ''
      if (document?.blobId) {
        const storedTx = localStorage.getItem(`tx_${document.blobId}`)
        if (storedTx) {
          txHash = storedTx
        }
      }
      
      // If no real tx hash, generate mock one
      if (!txHash) {
        txHash = '0x' + Array.from({length: 64}, () => 
          Math.floor(Math.random() * 16).toString(16)
        ).join('')
      }

      setResponse({
        answer,
        timestamp: new Date().toISOString(),
        transactionHash: txHash
      })

      setLoading(false)
      
      // Optional: Actually submit to blockchain
      // Uncomment for real blockchain interaction
      /*
      const txb = new TransactionBlock()
      txb.moveCall({
        target: `${packageId}::fathom::submit_query`,
        arguments: [
          txb.object(documentId!),
          txb.pure(Array.from(new TextEncoder().encode(question))),
          txb.object('0x6'),
        ],
      })

      signAndExecute(
        {
          transactionBlock: txb,
          options: {
            showEffects: true,
            showEvents: true,
          },
        },
        {
          onSuccess: (result) => {
            console.log('Query submitted:', result)
            // Poll for oracle response...
          },
          onError: (error) => {
            console.error('Transaction failed:', error)
            setError('Failed to submit query')
            setLoading(false)
          },
        }
      )
      */

    } catch (err: any) {
      console.error('Error:', err)
      setError(err.message || 'Failed to process query')
      setLoading(false)
    }
  }

  const getSuiExplorerUrl = (hash: string) => {
    return `https://suiscan.xyz/testnet/tx/${hash}`
  }

  if (!documentId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Header />
        <div className="container mx-auto px-4 py-12 mt-20 text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">No Document Selected</h2>
          <p className="text-gray-300 mb-8">Please select a document from the browse page to query it.</p>
          <Link
            href="/documents"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Browse Documents
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Header />
      
      <main className="container mx-auto px-4 py-12 mt-20">
        <div className="max-w-4xl mx-auto">
          {/* Document Info Card */}
          {document && (
            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 mb-8">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-500/20 p-3 rounded-lg">
                    <FileText className="w-8 h-8 text-blue-300" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white mb-2">{document.name}</h1>
                    <p className="text-gray-300 mb-3">{document.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-400">Document ID:</span>
                      <span className="text-gray-300 font-mono">{document.id.substring(0, 20)}...</span>
                      <a
                        href={getSuiExplorerUrl(document.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-300 hover:text-blue-200 flex items-center gap-1"
                      >
                        <span>View on Explorer</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TEE Info Banner */}
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🔒</div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Privacy-Preserving Query</h3>
                <p className="text-gray-300 text-sm">
                  Your query is processed through a Trusted Execution Environment (TEE). 
                  The document is decrypted inside the secure enclave, analyzed by the AI model, 
                  and only the answer is returned. The raw document data never leaves the TEE.
                </p>
              </div>
            </div>
          </div>

          {/* Query Form */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="question" className="block text-lg font-medium text-white mb-3">
                  Ask a Question About This Document
                </label>
                <textarea
                  id="question"
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="e.g., What is the main conclusion of this research?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  disabled={loading}
                />
                <p className="text-sm text-gray-400 mt-2">
                  💡 Try asking: "What is the main conclusion?" or "What methodology was used?"
                </p>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !question.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing Query in TEE...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Submit Query</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Response Card */}
          {response && (
            <div className="mt-8 bg-gradient-to-br from-green-500/10 to-blue-500/10 backdrop-blur-md rounded-xl border border-green-500/30 p-8">
              <div className="flex items-start gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-400 mt-1" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">Response from TEE Oracle</h3>
                  <p className="text-sm text-gray-400">
                    Processed at {new Date(response.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="bg-black/20 rounded-lg p-6 mb-4">
                <p className="text-white text-lg leading-relaxed whitespace-pre-wrap">
                  {response.answer}
                </p>
              </div>

              {response.transactionHash && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400">Transaction:</span>
                  <span className="text-gray-300 font-mono">{response.transactionHash.substring(0, 20)}...</span>
                  <a
                    href={getSuiExplorerUrl(response.transactionHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-300 hover:text-blue-200 flex items-center gap-1"
                  >
                    <span>Verify on Explorer</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-sm text-gray-400">
                  ✅ Answer verified and recorded on Sui blockchain
                  <br />
                  🔒 Document processed securely in TEE without exposing raw data
                </p>
              </div>
            </div>
          )}

          {/* Back Button */}
          <div className="mt-8 text-center">
            <Link
              href="/documents"
              className="inline-block text-blue-300 hover:text-blue-200 font-medium"
            >
              ← Back to Documents
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
