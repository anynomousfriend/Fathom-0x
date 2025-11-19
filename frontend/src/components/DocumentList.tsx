'use client'

import { useState } from 'react'
import { FileText, Plus } from 'lucide-react'
import { RegisterDocumentModal } from './RegisterDocumentModal'

interface DocumentListProps {
  selectedDocumentId: string | null
  onSelectDocument: (id: string) => void
}

export function DocumentList({ selectedDocumentId, onSelectDocument }: DocumentListProps) {
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  
  // Mock documents - In production, fetch from blockchain
  const documents = [
    {
      id: '0x1234...',
      name: 'Research Paper.pdf',
      description: 'AI Security Research Paper',
      blobId: 'blob123...',
      createdAt: Date.now() - 86400000,
    },
  ]

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

      {/* Document List */}
      {documents.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p>No documents yet. Register your first document to get started.</p>
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
                    <span>Blob ID: {doc.blobId}</span>
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
        <RegisterDocumentModal onClose={() => setShowRegisterModal(false)} />
      )}
    </div>
  )
}
