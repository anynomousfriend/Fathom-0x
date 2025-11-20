'use client'

import { useState, useRef } from 'react'
import { X, Upload, Lock, CheckCircle, Loader2, Download, ExternalLink } from 'lucide-react'
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
  const [encryptedBlob, setEncryptedBlob] = useState<Blob | null>(null)
  const [iv, setIv] = useState<string>('')
  const [isMockMode, setIsMockMode] = useState(false)
  const [registeredDocId, setRegisteredDocId] = useState<string>('')
  const [txHash, setTxHash] = useState<string>('')
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
      setEncryptedBlob(encryptedData)
      setIv(iv)
      
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

      // Check if result has mock mode indicator (mock blob IDs start with 'mock_')
      const isMock = result.blobId.startsWith('mock_')
      setIsMockMode(isMock)

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
      // Stay on complete step to allow manual upload
      setUploadStep('complete')
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

            // Store transaction hash and document ID for verification
            const digest = result.digest
            setTxHash(digest)
            
            // Extract created object ID from result
            const createdObjects = result.effects?.created || []
            if (createdObjects.length > 0) {
              const docId = createdObjects[0].reference.objectId
              setRegisteredDocId(docId)
              localStorage.setItem(`doc_${formData.blobId}`, docId)
              // Store document metadata for browse page
              localStorage.setItem(`name_${formData.blobId}`, formData.name)
              localStorage.setItem(`desc_${formData.blobId}`, formData.description)
              localStorage.setItem(`owner_${formData.blobId}`, result.effects?.executedEpoch || 'current-user')
            }
            
            localStorage.setItem(`tx_${formData.blobId}`, digest)

            setLoading(false)
            // Don't auto-close - let user see the explorer links
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

  const handleDownloadEncrypted = () => {
    if (!encryptedBlob) return

    const url = URL.createObjectURL(encryptedBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = `encrypted_${selectedFile?.name || 'document'}.enc`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    console.log('✅ Encrypted file downloaded')
  }

  const handleManualBlobId = () => {
    const blobId = prompt('Enter the Blob ID from Walrus CLI upload:')
    if (blobId && blobId.trim()) {
      setFormData(prev => ({
        ...prev,
        blobId: blobId.trim()
      }))
      console.log('✅ Manual Blob ID set:', blobId)
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
              {formData.blobId ? (
                isMockMode ? (
                  <div className="bg-orange-50 border-2 border-orange-400 rounded-lg p-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 text-orange-600 mt-0.5 text-2xl">⚠️</div>
                      <div className="flex-1">
                        <p className="font-bold text-orange-900 mb-2 text-lg">⚠️ MOCK MODE ACTIVE</p>
                        <div className="text-sm text-orange-900 space-y-2">
                          <p className="font-semibold">• Document encrypted with AES-256 ✅</p>
                          <p className="font-semibold">• HTTP upload FAILED - Using simulated Blob ID ⚠️</p>
                          <p className="font-semibold">• This is a DEMO blob ID (not on real Walrus network)</p>
                          <div className="bg-orange-100 border border-orange-300 rounded p-3 mt-3">
                            <p className="font-bold mb-1">🚨 Important:</p>
                            <p className="text-xs">This mock Blob ID will work for demo purposes, but the document is NOT stored on Walrus. For real storage, use the manual upload option below.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
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
                )
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <div className="flex items-start space-x-3">
                    <Lock className="w-6 h-6 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-900 mb-2">⚠️ Encryption Complete - Manual Upload Required</p>
                      <div className="text-sm text-yellow-800 space-y-1">
                        <p>• Document encrypted with AES-256 ✅</p>
                        <p>• HTTP upload failed - use manual upload below 📤</p>
                        <p>• Your data is secure and ready to upload via CLI</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Download Encrypted File Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Download className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-blue-900 mb-1">💾 Backup Option</p>
                      <p className="text-sm text-blue-800">
                        Download the encrypted file as a backup or to manually upload to Walrus CLI.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={handleDownloadEncrypted}
                      disabled={!encryptedBlob}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium flex items-center justify-center space-x-2 text-sm"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Encrypted File</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleManualBlobId}
                      className="flex-1 px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium text-sm"
                    >
                      Enter Blob ID Manually
                    </button>
                  </div>
                  
                  <div className="bg-white border border-blue-200 rounded p-3 text-xs text-blue-800">
                    <p className="font-medium mb-1">📝 Manual Upload Instructions:</p>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                      <li>Download the encrypted file above</li>
                      <li>Upload it using Walrus CLI: <code className="bg-blue-100 px-1 rounded">walrus store file.enc --epochs 5</code></li>
                      <li>Copy the Blob ID from the output</li>
                      <li>Click "Enter Blob ID Manually" and paste it</li>
                    </ol>
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
                  disabled={loading || !formData.blobId}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium"
                >
                  {loading ? 'Registering on Blockchain...' : !formData.blobId ? 'Enter Blob ID First' : 'Register Document'}
                </button>
              </div>
            </>
          )}

          {/* Step 4: Registering */}
          {uploadStep === 'registering' && !registeredDocId && (
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

          {/* Step 5: Registration Complete */}
          {registeredDocId && txHash && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-300 rounded-lg p-6">
                <div className="flex items-start space-x-3 mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-xl font-bold text-green-900 mb-2">🎉 Document Registered Successfully!</p>
                    <p className="text-sm text-green-800">Your document is now on the blockchain and ready to be queried.</p>
                  </div>
                </div>

                <div className="space-y-3 mt-4">
                  {/* Document ID */}
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <p className="text-xs font-semibold text-gray-600 mb-1">Document ID:</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-mono text-gray-800">{registeredDocId.substring(0, 30)}...</p>
                      <a
                        href={`https://suiscan.xyz/testnet/object/${registeredDocId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        <span>View Document</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  {/* Transaction Hash */}
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <p className="text-xs font-semibold text-gray-600 mb-1">Transaction Hash:</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-mono text-gray-800">{txHash.substring(0, 30)}...</p>
                      <a
                        href={`https://suiscan.xyz/testnet/tx/${txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        <span>View Transaction</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  {/* Blob ID */}
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <p className="text-xs font-semibold text-gray-600 mb-1">Walrus Blob ID:</p>
                    <p className="text-sm font-mono text-gray-800 break-all">{formData.blobId}</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <span className="font-semibold">✅ What's Next:</span> Your document is now discoverable on the Browse page. Others can query it while the data stays encrypted and private.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-semibold"
              >
                Done - Go to Browse Page
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
