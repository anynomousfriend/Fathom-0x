'use client'

import { useState, useRef } from 'react'
import { X, Upload, Lock, CheckCircle, Loader2 } from 'lucide-react'
import { encryptFile, generateFingerprint } from '@/lib/encryption'
import { uploadToWalrus } from '@/lib/walrus'
import { useSignAndExecuteTransactionBlock } from '@mysten/dapp-kit'
import { TransactionBlock } from '@mysten/sui.js/transactions'

interface RegisterDocumentModalProps {
  onClose: () => void
}

export function RegisterDocumentModal({ onClose }: RegisterDocumentModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    blobId: '',
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [encryptionKey, setEncryptionKey] = useState<string>('')
  const [uploadStep, setUploadStep] = useState<'select' | 'encrypting' | 'uploading' | 'registering' | 'complete'>('select')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock()
  const packageId = process.env.NEXT_PUBLIC_PACKAGE_ID
  const configId = process.env.NEXT_PUBLIC_CONFIG_OBJECT_ID

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      if (!formData.name) {
        setFormData(prev => ({ ...prev, name: file.name }))
      }
    }
  }

  const handleEncryptAndUpload = async () => {
    if (!selectedFile) return

    setLoading(true)
    setError(null)

    try {
      // Step 1: Encrypt the file
      setUploadStep('encrypting')
      console.log('🔒 Encrypting file...')
      
      const { encryptedData, key, iv } = await encryptFile(selectedFile)
      setEncryptionKey(key)
      
      console.log('✅ File encrypted', {
        originalSize: selectedFile.size,
        encryptedSize: encryptedData.size,
        keyLength: key.length
      })

      // Step 2: Upload encrypted data to Walrus
      setUploadStep('uploading')
      console.log('📤 Uploading to Walrus...')
      
      const result = await uploadToWalrus(encryptedData, {
        originalName: selectedFile.name,
        encrypted: 'true',
        iv: iv
      })

      console.log('✅ Uploaded to Walrus', result)

      // Step 3: Update form with blob ID
      setFormData(prev => ({
        ...prev,
        blobId: result.blobId
      }))

      setUploadStep('complete')
      setLoading(false)

    } catch (err: any) {
      console.error('❌ Upload error:', err)
      setError(err.message || 'Failed to encrypt and upload file')
      setLoading(false)
      setUploadStep('select')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.blobId) {
      setError('Please upload a file first')
      return
    }

    if (!packageId || !configId) {
      setError('Contract not configured')
      return
    }

    setLoading(true)
    setError(null)
    setUploadStep('registering')

    try {
      const txb = new TransactionBlock()

      txb.moveCall({
        target: `${packageId}::fathom::register_document`,
        arguments: [
          txb.object(configId),
          txb.pure(Array.from(new TextEncoder().encode(formData.blobId))),
          txb.pure(Array.from(new TextEncoder().encode(formData.name))),
          txb.pure(Array.from(new TextEncoder().encode(formData.description))),
          txb.object('0x6'), // Clock
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
            console.log('✅ Document registered:', result)
            
            // Store encryption key in localStorage (in production, use secure key management)
            if (encryptionKey) {
              const keys = JSON.parse(localStorage.getItem('fathom_keys') || '{}')
              keys[formData.blobId] = { key: encryptionKey }
              localStorage.setItem('fathom_keys', JSON.stringify(keys))
            }

            setLoading(false)
            setTimeout(() => onClose(), 1500)
          },
          onError: (error) => {
            console.error('❌ Registration failed:', error)
            setError('Failed to register document on blockchain')
            setLoading(false)
            setUploadStep('complete')
          },
        }
      )
    } catch (err: any) {
      console.error('❌ Submit error:', err)
      setError(err.message || 'Failed to register document')
      setLoading(false)
      setUploadStep('complete')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-bold">Register Encrypted Document</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            {/* Step 1 */}
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                uploadStep !== 'select' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
              }`}>
                {uploadStep !== 'select' ? <CheckCircle className="w-5 h-5" /> : '1'}
              </div>
              <span className="ml-2 text-sm font-medium">Select File</span>
            </div>

            <div className="flex-1 h-0.5 bg-gray-300 mx-4" />

            {/* Step 2 */}
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                uploadStep === 'complete' || uploadStep === 'registering' ? 'bg-green-500 text-white' : 
                uploadStep === 'encrypting' || uploadStep === 'uploading' ? 'bg-blue-500 text-white' : 
                'bg-gray-300 text-gray-600'
              }`}>
                {uploadStep === 'complete' || uploadStep === 'registering' ? <CheckCircle className="w-5 h-5" /> : '2'}
              </div>
              <span className="ml-2 text-sm font-medium">Encrypt & Upload</span>
            </div>

            <div className="flex-1 h-0.5 bg-gray-300 mx-4" />

            {/* Step 3 */}
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                uploadStep === 'registering' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                3
              </div>
              <span className="ml-2 text-sm font-medium">Register</span>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-6 mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Step 1: File Selection */}
          {uploadStep === 'select' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Document
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".pdf,.txt,.doc,.docx"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center"
                >
                  <Upload className="w-12 h-12 text-gray-400 mb-2" />
                  <span className="text-sm font-medium text-gray-600">
                    {selectedFile ? selectedFile.name : 'Click to select file'}
                  </span>
                  {selectedFile && (
                    <span className="text-xs text-gray-500 mt-1">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </span>
                  )}
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  📄 Supported: PDF, TXT, DOC, DOCX (Max 10MB)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Research Paper.pdf"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Brief description of the document"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Lock className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-medium mb-1">🔒 Privacy First</p>
                    <p>Your document will be encrypted client-side before upload. Only you have the decryption key.</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleEncryptAndUpload}
                  disabled={!selectedFile || loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium flex items-center justify-center space-x-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Encrypt & Upload</span>
                </button>
              </div>
            </>
          )}

          {/* Step 2: Encrypting/Uploading */}
          {(uploadStep === 'encrypting' || uploadStep === 'uploading') && (
            <div className="py-12">
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
                <div className="text-center">
                  <p className="text-lg font-medium text-gray-900">
                    {uploadStep === 'encrypting' ? '🔒 Encrypting your document...' : '📤 Uploading to Walrus...'}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    {uploadStep === 'encrypting' 
                      ? 'Your document is being encrypted with AES-256' 
                      : 'Uploading encrypted data to decentralized storage'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Upload Complete */}
          {uploadStep === 'complete' && (
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-900 mb-2">✅ Upload Successful!</p>
                    <div className="text-sm text-green-800 space-y-1">
                      <p>• Document encrypted with AES-256</p>
                      <p>• Uploaded to Walrus storage</p>
                      <p>• Blob ID: {formData.blobId.substring(0, 20)}...</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Lock className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-900">
                    <p className="font-medium mb-1">🔑 Important: Save Your Encryption Key</p>
                    <div className="bg-white border border-yellow-300 rounded px-3 py-2 mt-2 font-mono text-xs break-all">
                      {encryptionKey}
                    </div>
                    <p className="mt-2 text-xs">
                      This key is required to decrypt your document. Store it securely!
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium"
                >
                  {loading ? 'Registering on Blockchain...' : 'Register Document'}
                </button>
              </div>
            </>
          )}

          {/* Step 4: Registering */}
          {uploadStep === 'registering' && (
            <div className="py-12">
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
                <div className="text-center">
                  <p className="text-lg font-medium text-gray-900">
                    📝 Registering on Sui blockchain...
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Please approve the transaction in your wallet
                  </p>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
