'use client'

import { useState } from 'react'
import { FileText, Plus, Loader2, Copy, Check } from 'lucide-react'
import { RegisterDocumentModal } from './RegisterDocumentModal'
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
        className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2 text-gray-600 hover:text-blue-600"
      >
        <Plus className="w-5 h-5" />
        <span className="font-medium">Register New Document</span>
      </button>

      {/* Loading State */}
      {isLoading ? (
        <div className="text-center py-12">
          <Loader2 className="w-12 h-12 mx-auto mb-4 text-blue-500 animate-spin" />
          <p className="text-gray-600">Loading your documents...</p>
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
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
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  selectedDocumentId === doc.id ? 'bg-blue-600' : 'bg-gray-200'
                }`}>
                  <FileText className={`w-6 h-6 ${
                    selectedDocumentId === doc.id ? 'text-white' : 'text-gray-600'
                  }`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                  <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                    <div className="flex items-center space-x-2">
                      <span>Blob ID: {doc.blobId.substring(0, 20)}...</span>
                      <button
                        onClick={(e) => copyBlobId(doc.blobId, e)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        title="Copy full Blob ID"
                      >
                        {copiedBlobId === doc.blobId ? (
                          <Check className="w-3 h-3 text-green-600" />
                        ) : (
                          <Copy className="w-3 h-3 text-gray-600" />
                        )}
                      </button>
                    </div>
                    <span>•</span>
                    <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {selectedDocumentId === doc.id && (
                  <div className="flex-shrink-0">
                    <div className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
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
    </div>
  )
}
