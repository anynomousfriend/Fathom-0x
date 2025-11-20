'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { QueryForm } from '@/components/QueryForm'
import { AnswerDisplay } from '@/components/AnswerDisplay'
import { DocumentList } from '@/components/DocumentList'
import { LandingPage } from '@/components/LandingPage'
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
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <Header />

      <LandingPage />

      <div id="app-section" className="scroll-mt-20 bg-gradient-to-b from-slate-50 to-white">
        <main className="container mx-auto px-4 py-16">
          {!account ? (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">🔐</span>
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Connect Wallet to Get Started</h2>
                <p className="text-slate-600 mb-8">Connect your Sui wallet to start uploading documents and querying with privacy-preserving AI.</p>
                <div className="inline-block p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-sm text-slate-500 mb-2">Click "Connect Wallet" above to begin</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Document Selection */}
              <section className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 hover:shadow-xl transition-shadow">
                <h2 className="text-2xl font-bold mb-6 text-slate-900 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-lg font-bold shadow-lg shadow-blue-500/30">1</span>
                  Your Documents
                </h2>
                <DocumentList
                  selectedDocumentId={selectedDocumentId}
                  onSelectDocument={setSelectedDocumentId}
                />
              </section>

              {/* Query Interface */}
              {selectedDocumentId && (
                <section className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 hover:shadow-xl transition-shadow">
                  <h2 className="text-2xl font-bold mb-6 text-slate-900 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 text-white flex items-center justify-center text-lg font-bold shadow-lg shadow-cyan-500/30">2</span>
                    Ask a Question
                  </h2>
                  <QueryForm
                    documentId={selectedDocumentId}
                    onAnswerReceived={setLatestAnswer}
                  />
                </section>
              )}

              {/* Answer Display */}
              {latestAnswer && (
                <section className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 hover:shadow-xl transition-shadow">
                  <h2 className="text-2xl font-bold mb-6 text-slate-900 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center text-lg font-bold shadow-lg shadow-emerald-500/30">3</span>
                    Verified Answer
                  </h2>
                  <AnswerDisplay answer={latestAnswer} />
                </section>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-slate-900 to-slate-800 text-slate-300 py-12 mt-16 border-t border-slate-700">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <img src="/logo.svg" alt="Fathom Protocol" className="h-12 w-auto" />
          </div>
          <p className="mb-2 font-bold text-xl text-white">Fathom Protocol</p>
          <p className="text-sm text-slate-400 mb-4">Privacy-Preserving AI on Blockchain</p>
          <p className="text-xs text-slate-500">Built with Sui Network • Walrus Storage • TEE Oracles</p>
        </div>
      </footer>
    </div>
  )
}
