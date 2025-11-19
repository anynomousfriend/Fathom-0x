'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { QueryForm } from '@/components/QueryForm'
import { AnswerDisplay } from '@/components/AnswerDisplay'
import { DocumentList } from '@/components/DocumentList'
import { Hero } from '@/components/Hero'
import { useCurrentAccount } from '@mysten/dapp-kit'

export default function Home() {
  const account = useCurrentAccount()
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null)
  const [latestAnswer, setLatestAnswer] = useState<{
    question: string
    answer: string
    signature: string
    timestamp: number
  } | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {!account ? (
          <Hero />
        ) : (
          <div className="space-y-8">
            {/* Document Selection */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Your Documents</h2>
              <DocumentList
                selectedDocumentId={selectedDocumentId}
                onSelectDocument={setSelectedDocumentId}
              />
            </section>

            {/* Query Interface */}
            {selectedDocumentId && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Ask a Question</h2>
                <QueryForm
                  documentId={selectedDocumentId}
                  onAnswerReceived={setLatestAnswer}
                />
              </section>
            )}

            {/* Answer Display */}
            {latestAnswer && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Verified Answer</h2>
                <AnswerDisplay answer={latestAnswer} />
              </section>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>🌊 Fathom Protocol - Built for DeepSurge Hackathon</p>
          <p className="mt-2">Powered by Sui Network, Walrus Storage, and Nautilus Chain</p>
        </div>
      </footer>
    </div>
  )
}
