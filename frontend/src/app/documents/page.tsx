'use client'

import { useState, useEffect } from 'react'
import { useSuiClient } from '@mysten/dapp-kit'
import { Header } from '@/components/Header'
import { FileText, Search, ExternalLink, User } from 'lucide-react'
import Link from 'next/link'

interface Document {
  id: string
  name: string
  description: string
  blobId: string
  owner: string
  createdAt: string
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const client = useSuiClient()
  const packageId = process.env.NEXT_PUBLIC_PACKAGE_ID

  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    try {
      setLoading(true)
      
      // Start with demo documents
      const mockDocuments: Document[] = [
        {
          id: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
          name: 'AI Research Paper 2024',
          description: 'Comprehensive study on transformer models and their applications in natural language processing.',
          blobId: 'demo_blob_ai_research_2024',
          owner: '0x5faef464c1d69ede100e117dcca7a01e6b34d655364cc818235b77ba83651a20',
          createdAt: '2024-01-15T10:30:00Z'
        },
        {
          id: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
          name: 'Climate Change Report',
          description: 'Analysis of global climate patterns and projected impacts over the next decade.',
          blobId: 'demo_blob_climate_report',
          owner: '0x5faef464c1d69ede100e117dcca7a01e6b34d655364cc818235b77ba83651a20',
          createdAt: '2024-01-20T14:45:00Z'
        },
        {
          id: '0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321',
          name: 'Blockchain Whitepaper',
          description: 'Technical documentation on decentralized consensus mechanisms and their security implications.',
          blobId: 'demo_blob_blockchain_whitepaper',
          owner: '0x5faef464c1d69ede100e117dcca7a01e6b34d655364cc818235b77ba83651a20',
          createdAt: '2024-02-01T09:15:00Z'
        }
      ]
      
      // Load user's uploaded documents from localStorage
      const allDocs = [...mockDocuments]
      const storedKeys = Object.keys(localStorage).filter(key => key.startsWith('doc_'))
      
      for (const key of storedKeys) {
        const blobId = key.replace('doc_', '')
        const docId = localStorage.getItem(key)
        
        // Check if we have the document metadata
        const name = localStorage.getItem(`name_${blobId}`) || 'User Document'
        const description = localStorage.getItem(`desc_${blobId}`) || 'User uploaded document'
        const owner = localStorage.getItem(`owner_${blobId}`) || 'Unknown'
        
        if (docId) {
          allDocs.push({
            id: docId,
            name,
            description,
            blobId,
            owner,
            createdAt: new Date().toISOString()
          })
        }
      }
      
      setDocuments(allDocs)
      setLoading(false)
    } catch (error) {
      console.error('Error loading documents:', error)
      setLoading(false)
    }
  }

  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const getSuiExplorerUrl = (objectId: string) => {
    return `https://suiscan.xyz/testnet/object/${objectId}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Header />
      
      <main className="container mx-auto px-4 py-12 mt-20">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            📚 Browse Documents
          </h1>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            Explore encrypted documents and query them privately using our TEE-powered oracle.
            All documents are stored on Walrus and registered on Sui blockchain.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search documents by name or description..."
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-600 bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Documents Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading documents...</p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-white text-lg">No documents found</p>
            <p className="text-gray-400 mt-2">Try a different search or upload a new document</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 hover:bg-white/15 transition-all hover:shadow-xl hover:scale-105"
              >
                {/* Document Icon */}
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-blue-500/20 p-3 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-300" />
                  </div>
                  <a
                    href={getSuiExplorerUrl(doc.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-300 hover:text-blue-200 transition-colors"
                    title="View on Sui Explorer"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>

                {/* Document Info */}
                <h3 className="text-xl font-bold text-white mb-2">{doc.name}</h3>
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">{doc.description}</p>

                {/* Owner Info */}
                <div className="flex items-center gap-2 mb-4 text-sm">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-400">Owner:</span>
                  <span className="text-gray-300 font-mono">{formatAddress(doc.owner)}</span>
                </div>

                {/* Blob ID */}
                <div className="bg-black/20 rounded-lg p-2 mb-4">
                  <p className="text-xs text-gray-400 mb-1">Blob ID:</p>
                  <p className="text-xs text-gray-300 font-mono break-all">
                    {doc.blobId.substring(0, 30)}...
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link
                    href={`/query?documentId=${doc.id}`}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-center"
                  >
                    Query Document
                  </Link>
                  <a
                    href={getSuiExplorerUrl(doc.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                    title="View on Explorer"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {/* Timestamp */}
                <p className="text-xs text-gray-500 mt-3 text-center">
                  {new Date(doc.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-xl transition-all"
          >
            Upload Your Own Document
          </Link>
        </div>
      </main>
    </div>
  )
}
