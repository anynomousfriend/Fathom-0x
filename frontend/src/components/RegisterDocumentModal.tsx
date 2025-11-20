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
  const [forceMockMode, setForceMockMode] = useState(false)
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
      console.log('Encrypting file...')
      
      const { encryptedData, key, iv } = await encryptFile(selectedFile)
      setEncryptionKey(key)
      setEncryptedBlob(encryptedData)
      setIv(iv)
      
      console.log('File encrypted', {
        originalSize: selectedFile.size,
        encryptedSize: encryptedData.size,
        keyLength: key.length
      })

      // Step 2: Upload encrypted data to Walrus
      setUploadStep('uploading')
      console.log('Uploading to Walrus...', forceMockMode ? '(Mock Mode)' : '')
      
      const result = await uploadToWalrus(encryptedData, {
        originalName: selectedFile.name,
        encrypted: 'true',
        iv: iv
      }, forceMockMode)

      console.log('Uploaded to Walrus', result)

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
      console.error('Upload error:', err)
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
            console.log('Document registered:', result)
            
            // Store encryption key and IV in localStorage (in production, use secure key management)
            if (encryptionKey) {
              const keys = JSON.parse(localStorage.getItem('fathom_keys') || '{}')
              keys[formData.blobId] = { key: encryptionKey, iv: iv }
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
            console.error('Registration failed:', error)
            setError('Failed to register document on blockchain')
            setLoading(false)
            setUploadStep('complete')
          },
        }
      )
    } catch (err: any) {
      console.error('Submit error:', err)
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
    
    console.log('Encrypted file downloaded')
  }

  const handleManualBlobId = () => {
    const blobId = prompt('Enter the Blob ID from Walrus CLI upload:')
    if (blobId && blobId.trim()) {
      setFormData(prev => ({
        ...prev,
        blobId: blobId.trim()
      }))
      console.log('Manual Blob ID set:', blobId)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-foreground">Register Encrypted Document</h2>
            {forceMockMode && (
              <span className="px-3 py-1 bg-orange-500/20 border border-orange-500/50 text-orange-600 dark:text-orange-400 text-xs font-semibold rounded-full">
                MOCK MODE
              </span>
            )}
            {isMockMode && !forceMockMode && (
              <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/50 text-yellow-600 dark:text-yellow-400 text-xs font-semibold rounded-full">
                DEMO MODE
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-primary transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="p-6 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between">
            {/* Step 1 */}
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                uploadStep !== 'select' ? 'bg-primary text-white' : 'bg-primary text-white'
              }`}>
                {uploadStep !== 'select' ? <CheckCircle className="w-5 h-5" /> : '1'}
              </div>
              <span className="ml-2 text-sm font-medium text-foreground">Select File</span>
            </div>

            <div className="flex-1 h-0.5 bg-border mx-4" />

            {/* Step 2 */}
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                uploadStep === 'complete' || uploadStep === 'registering' ? 'bg-primary text-white' : 
                uploadStep === 'encrypting' || uploadStep === 'uploading' ? 'bg-primary text-white' : 
                'bg-muted text-muted-foreground'
              }`}>
                {uploadStep === 'complete' || uploadStep === 'registering' ? <CheckCircle className="w-5 h-5" /> : '2'}
              </div>
              <span className="ml-2 text-sm font-medium text-foreground">Encrypt & Upload</span>
            </div>

            <div className="flex-1 h-0.5 bg-border mx-4" />

            {/* Step 3 */}
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                uploadStep === 'registering' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
              }`}>
                3
              </div>
              <span className="ml-2 text-sm font-medium text-foreground">Register</span>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-6 mt-6 bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Step 1: File Selection */}
          {uploadStep === 'select' && (
            <>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
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
                  className="w-full border-2 border-dashed border-border rounded-lg p-8 hover:border-primary hover:bg-primary/10 transition-colors flex flex-col items-center"
                >
                  <Upload className="w-12 h-12 text-muted-foreground mb-2" />
                  <span className="text-sm font-medium text-foreground">
                    {selectedFile ? selectedFile.name : 'Click to select file'}
                  </span>
                  {selectedFile && (
                    <span className="text-xs text-muted-foreground mt-1">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </span>
                  )}
                </button>
                <p className="text-xs text-muted-foreground mt-2">
                  Supported: PDF, TXT, DOC, DOCX (Max 10MB)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Document Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                  placeholder="e.g., Research Paper.pdf"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none bg-background text-foreground"
                  placeholder="Brief description of the document"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Lock className="w-5 h-5 text-primary mt-0.5" />
                  <div className="text-sm text-foreground flex-1">
                    <p className="font-medium mb-1">Privacy First</p>
                    <p>Your document will be encrypted client-side before upload. Only you have the decryption key.</p>
                  </div>
                </div>
              </div>

              {/* Mock Mode Toggle */}
              <div className="flex items-center justify-between p-4 bg-muted/30 border border-border rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Mock Mode (Demo)</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Enable to skip real Walrus upload and use simulated blob ID for testing
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={forceMockMode}
                    onChange={(e) => setForceMockMode(e.target.checked)}
                    className="sr-only peer"
                    disabled={loading}
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted font-medium text-foreground"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleEncryptAndUpload}
                  disabled={!selectedFile || loading}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground font-medium flex items-center justify-center space-x-2"
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
                <Loader2 className="w-16 h-16 text-primary animate-spin" />
                <div className="text-center">
                  <p className="text-lg font-medium text-foreground">
                    {uploadStep === 'encrypting' ? 'Encrypting your document...' : 'Uploading to Walrus...'}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
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
                      <div className="w-6 h-6 text-orange-600 mt-0.5 font-bold flex-shrink-0">!</div>
                      <div className="flex-1">
                        <p className="font-bold text-orange-900 mb-3 text-lg">MOCK MODE - Document NOT Uploaded to Walrus</p>
                        <div className="text-sm text-orange-900 space-y-2">
                          <p className="font-semibold">• Document encrypted with AES-256 ✓</p>
                          <p className="font-semibold">• HTTP upload FAILED - Using simulated Blob ID</p>
                          <p className="font-semibold">• This is a DEMO blob ID (not on real Walrus network)</p>
                          <div className="bg-orange-100 border border-orange-300 rounded p-3 mt-3">
                            <p className="font-bold mb-2">To Actually Upload Your Document:</p>
                            <p className="text-xs mb-3">You must use the Walrus CLI to upload the encrypted file. Follow these steps:</p>
                            <div className="space-y-2">
                              <div>
                                <p className="font-semibold text-xs mb-1">1. Download the encrypted file below</p>
                              </div>
                              <div>
                                <p className="font-semibold text-xs mb-1">2. Upload using Walrus CLI:</p>
                                <code className="block bg-white px-2 py-1 rounded text-xs font-mono break-all mt-1">
                                  walrus store "encrypted_{selectedFile?.name || 'document'}.enc" --epochs 5
                                </code>
                              </div>
                              <div>
                                <p className="font-semibold text-xs mb-1">3. Copy the real Blob ID from CLI output</p>
                              </div>
                              <div>
                                <p className="font-semibold text-xs mb-1">4. Click "Enter Blob ID Manually" and paste it</p>
                              </div>
                            </div>
                          </div>
                          <div className="bg-yellow-100 border border-yellow-300 rounded p-2 mt-2">
                            <p className="text-xs font-bold">Remember: Save your encryption key! You'll need it to decrypt the document later.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-green-900 mb-2">Upload Successful</p>
                        <div className="text-sm text-green-800 space-y-1">
                          <p>• Document encrypted with AES-256</p>
                          <p>• Uploaded to Walrus storage</p>
                          <div className="flex items-center gap-2">
                            <p>• Blob ID: {formData.blobId.substring(0, 20)}...</p>
                            <a
                              href={`https://walruscan.com/testnet/blob/${formData.blobId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-700 hover:text-green-900 underline text-xs"
                            >
                              View on Walrus
                            </a>
                          </div>
                        </div>
                        <div className="bg-yellow-50 border border-yellow-300 rounded p-2 mt-3">
                          <p className="text-xs font-bold text-yellow-900">Important: Your encryption key is shown below. Save it now - you'll need it to decrypt this document later!</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <div className="flex items-start space-x-3">
                    <Lock className="w-6 h-6 text-yellow-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-yellow-900 mb-2">Encryption Complete - Manual Upload Required</p>
                      <div className="text-sm text-yellow-800 space-y-2">
                        <p>• Document encrypted with AES-256</p>
                        <p>• Walrus HTTP upload returned 404 - manual CLI upload needed</p>
                        <p>• Follow the instructions below to upload via Walrus CLI</p>
                        <div className="bg-yellow-100 border border-yellow-300 rounded p-2 mt-2 space-y-2">
                          <div>
                            <p className="font-semibold text-xs mb-1">1. Upload Command:</p>
                            <code className="block bg-white px-2 py-1 rounded text-xs font-mono break-all">
                              walrus store "encrypted_{selectedFile?.name || 'document'}.enc" --epochs 5
                            </code>
                          </div>
                          <div>
                            <p className="font-semibold text-xs mb-1">2. Verify Upload (Optional):</p>
                            <code className="block bg-white px-2 py-1 rounded text-xs font-mono break-all">
                              walrus read YOUR_BLOB_ID
                            </code>
                            <p className="text-xs mt-1">Replace YOUR_BLOB_ID with the blob ID from step 1</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Download Encrypted File Section */}
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Download className="w-5 h-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-foreground mb-1">Backup Option</p>
                      <p className="text-sm text-muted-foreground">
                        Download the encrypted file as a backup or to manually upload to Walrus CLI.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={handleDownloadEncrypted}
                      disabled={!encryptedBlob}
                      className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground font-medium flex items-center justify-center space-x-2 text-sm"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Encrypted File</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleManualBlobId}
                      className="flex-1 px-4 py-2 border-2 border-primary text-primary rounded-lg hover:bg-primary/10 font-medium text-sm"
                    >
                      Enter Blob ID Manually
                    </button>
                  </div>
                  
                  <div className="bg-muted/50 border border-border rounded p-3 text-xs text-foreground">
                    <p className="font-medium mb-2">Manual Upload Instructions:</p>
                    <ol className="list-decimal list-inside space-y-2 ml-2 text-muted-foreground">
                      <li>Download the encrypted file above (it will be saved as <code className="bg-muted px-1 rounded text-foreground">encrypted_{selectedFile?.name || 'document'}.enc</code>)</li>
                      <li className="space-y-1">
                        <div>Upload it using Walrus CLI:</div>
                        <code className="block bg-card border border-border px-2 py-1 rounded text-foreground mt-1 font-mono text-xs">
                          walrus store "encrypted_{selectedFile?.name || 'document'}.enc" --epochs 5
                        </code>
                      </li>
                      <li className="space-y-1">
                        <div>Verify the upload by retrieving it (optional but recommended):</div>
                        <code className="block bg-card border border-border px-2 py-1 rounded text-foreground mt-1 font-mono text-xs">
                          walrus read YOUR_BLOB_ID
                        </code>
                        <p className="text-xs mt-1 ml-4">This downloads and verifies the file from Walrus network</p>
                      </li>
                      <li>Copy the Blob ID from the CLI upload output</li>
                      <li>Click "Enter Blob ID Manually" button above and paste it</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Lock className="w-5 h-5 text-secondary mt-0.5" />
                  <div className="text-sm text-foreground">
                    <p className="font-medium mb-1">Important: Save Your Encryption Key</p>
                    <div className="bg-muted/50 border border-border rounded px-3 py-2 mt-2 font-mono text-xs break-all">
                      {encryptionKey}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      This key is required to decrypt your document. Store it securely!
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted font-medium text-foreground"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !formData.blobId}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground font-medium"
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
                <Loader2 className="w-16 h-16 text-primary animate-spin" />
                <div className="text-center">
                  <p className="text-lg font-medium text-foreground">
                    Registering on Sui blockchain...
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Please approve the transaction in your wallet
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Registration Complete */}
          {registeredDocId && txHash && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/30 rounded-lg p-6">
                <div className="flex items-start space-x-3 mb-4">
                  <CheckCircle className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-xl font-bold text-foreground mb-2">Document Registered Successfully</p>
                    <p className="text-sm text-muted-foreground">Your document is now on the blockchain and ready to be queried.</p>
                  </div>
                </div>

                <div className="space-y-3 mt-4">
                  {/* Document ID */}
                  <div className="bg-muted/50 rounded-lg p-3 border border-border">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Document ID:</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-mono text-foreground">{registeredDocId.substring(0, 30)}...</p>
                      <a
                        href={`https://suiscan.xyz/testnet/object/${registeredDocId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary hover:text-primary/80 text-sm font-medium"
                      >
                        <span>View Document</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  {/* Transaction Hash */}
                  <div className="bg-muted/50 rounded-lg p-3 border border-border">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Transaction Hash:</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-mono text-foreground">{txHash.substring(0, 30)}...</p>
                      <a
                        href={`https://suiscan.xyz/testnet/tx/${txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary hover:text-primary/80 text-sm font-medium"
                      >
                        <span>View Transaction</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  {/* Blob ID */}
                  <div className="bg-muted/50 rounded-lg p-3 border border-border">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold text-muted-foreground">Walrus Blob ID:</p>
                      <a
                        href={`https://walruscan.com/testnet/blob/${formData.blobId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary hover:text-primary/80 text-xs font-medium"
                      >
                        <span>View on Walrus</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <p className="text-sm font-mono text-foreground break-all">{formData.blobId}</p>
                  </div>
                </div>
              </div>

              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                <p className="text-sm text-foreground">
                  <span className="font-semibold">What's Next:</span> Your document is now discoverable on the Browse page. Others can query it while the data stays encrypted and private.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:opacity-90 font-semibold"
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
