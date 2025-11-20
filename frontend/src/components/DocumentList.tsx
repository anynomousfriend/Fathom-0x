'use client'

import { useState } from 'react'
import { FileText, Plus, Loader2, Copy, Check, Download } from 'lucide-react'
import { RegisterDocumentModal } from './RegisterDocumentModal'
import { DecryptDocumentModal } from './DecryptDocumentModal'
import { useSuiClientQuery, useCurrentAccount } from '@mysten/dapp-kit'

interface DocumentListProps {
  selectedDocumentId: string | null
  onSelectDocument: (id: string) => void
}

interface Document {
  id: string
  name: string
  description: string
  blobId: string
  createdAt: number
  owner: string
}

export function DocumentList({ selectedDocumentId, onSelectDocument }: DocumentListProps) {
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [copiedBlobId, setCopiedBlobId] = useState<string | null>(null)
  const [selectedDocForDecrypt, setSelectedDocForDecrypt] = useState<Document | null>(null)
  const account = useCurrentAccount()
  const packageId = process.env.NEXT_PUBLIC_PACKAGE_ID

  // Fetch owned Document objects from blockchain
  const { data: ownedObjects, isLoading, refetch } = useSuiClientQuery(
    'getOwnedObjects',
    {
      owner: account?.address || '',
      filter: {
        StructType: `${packageId}::fathom::Document`,
      },
      options: {
        showContent: true,
        showType: true,
      },
    },
    {
      enabled: !!account?.address && !!packageId,
      refetchInterval: 5000, // Refetch every 5 seconds to pick up new documents
    }
  )

  // Parse documents from blockchain data
  const documents: Document[] = ownedObjects?.data
    .map((obj: any) => {
      if (!obj.data?.content?.fields) return null
      
      const fields = obj.data.content.fields
      return {
        id: obj.data.objectId,
        name: fields.name || 'Untitled Document',
        description: fields.description || 'No description',
        blobId: fields.walrus_blob_id || '',
        createdAt: parseInt(fields.created_at || '0'),
        owner: fields.owner || '',
      }
    })
    .filter((doc): doc is Document => doc !== null) || []

  // Trigger refetch when modal closes (to pick up newly registered documents)
  const handleModalClose = () => {
    setShowRegisterModal(false)
    setTimeout(() => refetch(), 1000) // Refetch after 1 second delay
  }

  // Copy blob ID to clipboard
  const copyBlobId = async (blobId: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent document selection
    try {
      await navigator.clipboard.writeText(blobId)
      setCopiedBlobId(blobId)
      setTimeout(() => setCopiedBlobId(null), 2000) // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy blob ID:', err)
    }
  }

  return (
    <div className="space-y-4">
      {/* Register New Document Button */}
      <button
        onClick={() => setShowRegisterModal(true)}
        className="w-full border-2 border-dashed border-border rounded-xl p-6 hover:border-primary hover:bg-primary/10 transition-colors flex items-center justify-center space-x-2 text-muted-foreground hover:text-primary"
      >
        <Plus className="w-5 h-5" />
        <span className="font-medium">Register New Document</span>
      </button>

      {/* Loading State */}
      {isLoading ? (
        <div className="text-center py-12">
          <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading your documents...</p>
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="font-medium mb-2">No documents yet</p>
          <p className="text-sm">Register your first document to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {documents.map((doc) => (
            <button
              key={doc.id}
              onClick={() => onSelectDocument(doc.id)}
              className={`text-left p-6 rounded-xl border-2 transition-all ${
                selectedDocumentId === doc.id
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-border/80 bg-card'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  selectedDocumentId === doc.id ? 'bg-primary' : 'bg-muted'
                }`}>
                  <FileText className={`w-6 h-6 ${
                    selectedDocumentId === doc.id ? 'text-primary-foreground' : 'text-muted-foreground'
                  }`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground">{doc.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{doc.description}</p>
                  <div className="flex items-center flex-wrap gap-2 mt-3 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <span>Blob ID: {doc.blobId.substring(0, 20)}...</span>
                      <button
                        onClick={(e) => copyBlobId(doc.blobId, e)}
                        className="p-1 hover:bg-muted rounded transition-colors"
                        title="Copy full Blob ID"
                      >
                        {copiedBlobId === doc.blobId ? (
                          <Check className="w-3 h-3 text-primary" />
                        ) : (
                          <Copy className="w-3 h-3 text-muted-foreground" />
                        )}
                      </button>
                      <a
                        href={`https://walruscan.com/testnet/blob/${doc.blobId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 flex items-center gap-1"
                        title="View on Walrus Scan"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span>View</span>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                    <span>•</span>
                    <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  {/* Decrypt Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedDocForDecrypt(doc)
                    }}
                    className="mt-2 w-full text-xs px-3 py-1.5 border border-primary text-primary hover:bg-primary/10 rounded transition-colors flex items-center justify-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>Decrypt & Download</span>
                  </button>
                </div>

                {selectedDocumentId === doc.id && (
                  <div className="flex-shrink-0">
                    <div className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">
                      Selected
                    </div>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Register Modal */}
      {showRegisterModal && (
        <RegisterDocumentModal onClose={handleModalClose} />
      )}

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
