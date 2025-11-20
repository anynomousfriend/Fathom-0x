'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { QueryForm } from '@/components/QueryForm'
import { AnswerDisplay } from '@/components/AnswerDisplay'
import { DocumentList } from '@/components/DocumentList'
import { LandingPage } from '@/components/LandingPage'
import { useCurrentAccount } from '@mysten/dapp-kit'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MatrixRain } from '@/components/MatrixRain'

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
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <div className="relative">
        <MatrixRain />
        <LandingPage />
      </div>

      <div id="app-section" className="scroll-mt-20">
        <main className="container mx-auto px-4 py-16">
          {!account ? (
            <Card className="text-center py-20 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <CardTitle className="text-3xl font-bold mb-4">Connect Wallet to Get Started</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-8">Connect your Sui wallet to start uploading documents and querying with privacy-preserving AI.</p>
                <div className="inline-block p-4 bg-background/50 rounded-xl border border-border/50 shadow-sm">
                  <p className="text-sm text-muted-foreground mb-2">Click "Connect Wallet" above to begin</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {/* Document Selection */}
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center text-lg font-bold shadow-lg shadow-primary/30">1</span>
                    Your Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <DocumentList
                    selectedDocumentId={selectedDocumentId}
                    onSelectDocument={setSelectedDocumentId}
                  />
                </CardContent>
              </Card>

              {/* Query Interface */}
              {selectedDocumentId && (
                <Card className="bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 text-white flex items-center justify-center text-lg font-bold shadow-lg shadow-cyan-500/30">2</span>
                      Ask a Question
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <QueryForm
                      documentId={selectedDocumentId}
                      onAnswerReceived={setLatestAnswer}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Answer Display */}
              {latestAnswer && (
                <Card className="bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center text-lg font-bold shadow-lg shadow-emerald-500/30">3</span>
                      Verified Answer
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AnswerDisplay answer={latestAnswer} />
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-background/80 backdrop-blur-sm text-muted-foreground py-12 mt-16 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <img src="/logo.svg" alt="Fathom-0x Protocol" className="h-12 w-auto" />
          </div>
          <p className="mb-2 font-bold text-xl text-foreground">Fathom-0x Protocol</p>
          <p className="text-sm mb-4">Privacy-Preserving AI on Blockchain</p>
          <p className="text-xs text-muted-foreground/50">Built with Sui Network • Walrus Storage • TEE Oracles</p>
        </div>
      </footer>
    </div>
  )
}
