'use client'

import { useState, useEffect } from 'react'
import { X, Download, Lock, Key, FileText, CheckCircle, Loader2, ExternalLink } from 'lucide-react'
import { decryptData } from '@/lib/encryption'

interface DecryptDocumentModalProps {
  document: {
    id: string
    name: string
    blobId: string
  }
  onClose: () => void
}

export function DecryptDocumentModal({ document, onClose }: DecryptDocumentModalProps) {
  const [encryptionKey, setEncryptionKey] = useState<string>('')
  const [iv, setIv] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [decryptedFile, setDecryptedFile] = useState<Blob | null>(null)
  const [step, setStep] = useState<'input' | 'downloading' | 'decrypting' | 'success'>('input')

  // Auto-load key from localStorage if available
  useEffect(() => {
    const keys = JSON.parse(localStorage.getItem('fathom_keys') || '{}')
    if (keys[document.blobId]) {
      setEncryptionKey(keys[document.blobId].key || '')
      setIv(keys[document.blobId].iv || '')
    }
  }, [document.blobId])

  const handleDecrypt = async () => {
    if (!encryptionKey.trim()) {
      setError('Please enter the encryption key')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Step 1: Download encrypted file from Walrus
      setStep('downloading')
      console.log('Downloading from Walrus:', document.blobId)
      
      const walrusAggregator = process.env.NEXT_PUBLIC_WALRUS_AGGREGATOR || 'https://aggregator.walrus-testnet.walrus.space'
      const response = await fetch(`${walrusAggregator}/v1/${document.blobId}`)
      
      if (!response.ok) {
        throw new Error(`Failed to download from Walrus: ${response.status}`)
      }

      const encryptedData = await response.arrayBuffer()
      console.log('Downloaded encrypted data:', encryptedData.byteLength, 'bytes')

      // Step 2: Decrypt the data
      setStep('decrypting')
      console.log('Decrypting data...')
      
      const encryptedBuffer = Buffer.from(encryptedData)
      const decryptedBuffer = decryptData(encryptedBuffer, encryptionKey, iv || '')
      
      // Convert Buffer to ArrayBuffer for Blob
      const arrayBuffer = decryptedBuffer.buffer.slice(
        decryptedBuffer.byteOffset,
        decryptedBuffer.byteOffset + decryptedBuffer.byteLength
      ) as ArrayBuffer
      const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' })
      setDecryptedFile(blob)
      
      console.log('Decryption successful:', blob.size, 'bytes')
      
      setStep('success')
      setLoading(false)

    } catch (err: any) {
      console.error('Decryption error:', err)
      setError(err.message || 'Failed to download or decrypt document')
      setLoading(false)
      setStep('input')
    }
  }

  const handleDownload = () => {
    if (!decryptedFile) return

    const url = URL.createObjectURL(decryptedFile)
    const link = window.document.createElement('a')
    link.href = url
    link.download = document.name
    window.document.body.appendChild(link)
    link.click()
    window.document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    console.log('Decrypted file downloaded')
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card">
          <h2 className="text-xl font-bold text-foreground">Decrypt & Download Document</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-primary transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Document Info */}
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <FileText className="w-6 h-6 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-foreground">{document.name}</p>
                <div className="text-sm text-muted-foreground mt-2 space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Blob ID: {document.blobId.substring(0, 30)}...</span>
                    <a
                      href={`https://walruscan.com/testnet/blob/${document.blobId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 text-xs flex items-center gap-1"
                    >
                      <span>View on Walrus</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="space-y-4">
              <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
              
              {/* Manual Download Instructions on Error */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Download className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-yellow-900 mb-2">Manual Download & Decrypt</p>
                    <p className="text-sm text-yellow-800 mb-3">
                      If automatic download fails, you can manually download and decrypt using CLI commands:
                    </p>
                    
                    <div className="space-y-3">
                      {/* Step 1: Download from Walrus */}
                      <div>
                        <p className="text-xs font-semibold text-yellow-900 mb-1">Step 1: Download from Walrus</p>
                        <code className="block bg-white px-3 py-2 rounded text-xs font-mono break-all border border-yellow-300">
                          walrus read {document.blobId} --out "encrypted_{document.name}.enc" --context testnet
                        </code>
                      </div>
                      
                      {/* Step 2: Decrypt with OpenSSL */}
                      {encryptionKey && (
                        <div>
                          <p className="text-xs font-semibold text-yellow-900 mb-1">Step 2: Decrypt with OpenSSL</p>
                          <code className="block bg-white px-3 py-2 rounded text-xs font-mono break-all border border-yellow-300">
                            openssl enc -d -aes-256-cbc -in "encrypted_{document.name}.enc" -out "{document.name}" -K {encryptionKey} {iv ? `-iv ${iv}` : ''}
                          </code>
                        </div>
                      )}
                      
                      {/* Encryption Key Reminder */}
                      {!encryptionKey && (
                        <div className="bg-yellow-100 border border-yellow-300 rounded p-2">
                          <p className="text-xs text-yellow-900">
                            <span className="font-semibold">Note:</span> You'll need your encryption key for Step 2. Make sure you saved it when registering the document.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Input Step */}
          {step === 'input' && (
            <>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Encryption Key
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground font-mono text-sm"
                      placeholder="Enter the 64-character encryption key"
                      value={encryptionKey}
                      onChange={(e) => setEncryptionKey(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    This is the key that was provided when you registered the document
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Initialization Vector (IV) - Optional
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground font-mono text-sm"
                      placeholder="Enter IV if you have it (32 hex characters)"
                      value={iv}
                      onChange={(e) => setIv(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Leave empty if not provided separately
                  </p>
                </div>
              </div>

              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Lock className="w-5 h-5 text-primary mt-0.5" />
                  <div className="text-sm text-foreground">
                    <p className="font-medium mb-1">How it works:</p>
                    <ol className="list-decimal list-inside space-y-1 text-muted-foreground ml-2">
                      <li>We'll download the encrypted file from Walrus</li>
                      <li>Decrypt it locally using your encryption key</li>
                      <li>Download the decrypted file to your device</li>
                    </ol>
                    <p className="mt-2 text-xs">Your key never leaves your browser</p>
                  </div>
                </div>
              </div>

              {/* Manual Recovery Options - Always Visible */}
              <details className="bg-muted/30 border border-border rounded-lg p-4">
                <summary className="cursor-pointer font-semibold text-foreground flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Manual Recovery Options (CLI)
                </summary>
                <div className="mt-4 space-y-3 text-sm">
                  <p className="text-muted-foreground">
                    If the automatic download doesn't work, use these CLI commands:
                  </p>
                  
                  {/* Step 1: Download from Walrus */}
                  <div>
                    <p className="text-xs font-semibold text-foreground mb-1">Step 1: Download from Walrus</p>
                    <code className="block bg-card border border-border px-3 py-2 rounded text-xs font-mono break-all">
                      walrus read {document.blobId} --out "encrypted_{document.name}.enc" --context testnet
                    </code>
                  </div>
                  
                  {/* Step 2: Decrypt with OpenSSL */}
                  {encryptionKey && iv ? (
                    <div>
                      <p className="text-xs font-semibold text-foreground mb-1">Step 2: Decrypt with OpenSSL</p>
                      <code className="block bg-card border border-border px-3 py-2 rounded text-xs font-mono break-all">
                        openssl enc -d -aes-256-cbc -in "encrypted_{document.name}.enc" -out "{document.name}" -K {encryptionKey} -iv {iv}
                      </code>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                      <p className="text-xs text-yellow-900">
                        <span className="font-semibold">Note:</span> Enter your encryption key above to see the full OpenSSL decrypt command.
                      </p>
                    </div>
                  )}
                  
                  <div className="bg-primary/10 border border-primary/30 rounded p-2">
                    <p className="text-xs text-foreground">
                      <span className="font-semibold">Important:</span> Save your encryption key! You'll need it to decrypt files downloaded via CLI.
                    </p>
                  </div>
                </div>
              </details>

              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted font-medium text-foreground"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDecrypt}
                  disabled={loading || !encryptionKey.trim()}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground font-medium flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Decrypt & Download</span>
                </button>
              </div>
            </>
          )}

          {/* Downloading/Decrypting Steps */}
          {(step === 'downloading' || step === 'decrypting') && (
            <div className="py-12">
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="w-16 h-16 text-primary animate-spin" />
                <div className="text-center">
                  <p className="text-lg font-medium text-foreground">
                    {step === 'downloading' ? 'Downloading from Walrus...' : 'Decrypting document...'}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {step === 'downloading' 
                      ? 'Fetching encrypted data from decentralized storage' 
                      : 'Decrypting with AES-256-CBC'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Success Step */}
          {step === 'success' && decryptedFile && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/30 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-xl font-bold text-foreground mb-2">Decryption Successful</p>
                    <p className="text-sm text-muted-foreground">Your document has been decrypted and is ready to download.</p>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <span className="text-foreground">Downloaded from Walrus</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <span className="text-foreground">Decrypted with your key</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <span className="text-foreground">File size: {(decryptedFile.size / 1024).toFixed(2)} KB</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                <p className="text-sm text-foreground">
                  <span className="font-semibold">Privacy Preserved:</span> The decryption happened entirely in your browser. The encryption key never left your device.
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted font-medium text-foreground"
                >
                  Close
                </button>
                <button
                  onClick={handleDownload}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:opacity-90 font-semibold flex items-center justify-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Decrypted File</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
