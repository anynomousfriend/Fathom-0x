'use client'

import { useState, useEffect } from 'react'
import { useSuiClient } from '@mysten/dapp-kit'
import { Header } from '@/components/Header'
import { FileText, Search, ExternalLink, User, Download } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { DecryptDocumentModal } from '@/components/DecryptDocumentModal'

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
  const [selectedDocForDecrypt, setSelectedDocForDecrypt] = useState<Document | null>(null)
  const client = useSuiClient()
  const packageId = process.env.NEXT_PUBLIC_PACKAGE_ID

  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    try {
      setLoading(true)
      
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
      
      const allDocs = [...mockDocuments]
      const storedKeys = Object.keys(localStorage).filter(key => key.startsWith('doc_'))
      
      for (const key of storedKeys) {
        const blobId = key.replace('doc_', '')
        const docId = localStorage.getItem(key)
        
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

  const getWalrusScanUrl = (blobId: string) => {
    return `https://walruscan.com/testnet/blob/${blobId}`
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12 mt-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Browse Documents
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore encrypted documents and query them privately using our TEE-powered oracle.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search documents by name or description..."
              className="w-full pl-12 pr-4 py-4 rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-foreground text-lg">Loading documents...</p>
          </div>
        ) : filteredDocuments.length === 0 ? (
            <Card className="text-center py-12 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <CardTitle>No documents found</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mt-2">Try a different search or upload a new document</p>
                </CardContent>
            </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="bg-card/80 backdrop-blur-md border-border/50 hover:border-primary/50 transition-all flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <a
                      href={getSuiExplorerUrl(doc.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      title="View on Sui Explorer"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                  <CardTitle>{doc.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{doc.description}</p>
                  <div className="flex items-center gap-2 mb-4 text-sm">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Owner:</span>
                    <span className="text-foreground font-mono">{formatAddress(doc.owner)}</span>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-2 border border-border/30">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs text-muted-foreground">Blob ID:</p>
                      <a
                        href={getWalrusScanUrl(doc.blobId)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                        title="View on Walrus Scan"
                      >
                        <span>View on Walrus</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <p className="text-xs text-foreground font-mono break-all">
                      {doc.blobId.substring(0, 30)}...
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-stretch gap-2">
                    <Button asChild>
                        <Link href={`/query?documentId=${doc.id}`}>Query Document</Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedDocForDecrypt(doc)}
                      className="flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Decrypt & Download
                    </Button>
                    <p className="text-xs text-muted-foreground mt-3 text-center">
                    {new Date(doc.createdAt).toLocaleDateString()}
                    </p>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
            <Button asChild>
                <Link href="/">Upload Your Own Document</Link>
            </Button>
        </div>
      </main>

      {/* Decrypt Modal */}
      {selectedDocForDecrypt && (
        <DecryptDocumentModal
          document={selectedDocForDecrypt}
          onClose={() => setSelectedDocForDecrypt(null)}
        />
      )}
    </div>
  )
}
