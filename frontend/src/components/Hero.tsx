'use client'

import { Shield, Lock, CheckCircle, Waves } from 'lucide-react'

export function Hero() {
  return (
    <div className="max-w-4xl mx-auto text-center py-16 space-y-8">
      {/* Main Heading */}
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-accent rounded-2xl flex items-center justify-center">
            <Waves className="w-12 h-12 text-white" />
          </div>
        </div>
        <h1 className="text-5xl font-bold text-foreground">
          Welcome to Fathom
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Verifiable RAG for Private Data on Walrus
        </p>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <div className="p-6 bg-card rounded-xl shadow-sm border border-border">
          <Lock className="w-10 h-10 text-primary mb-4 mx-auto" />
          <h3 className="font-semibold text-lg mb-2 text-foreground">Private Data</h3>
          <p className="text-sm text-muted-foreground">
            Your documents stay encrypted on Walrus. Never exposed to centralized servers.
          </p>
        </div>

        <div className="p-6 bg-card rounded-xl shadow-sm border border-border">
          <Shield className="w-10 h-10 text-primary mb-4 mx-auto" />
          <h3 className="font-semibold text-lg mb-2 text-foreground">Verifiable AI</h3>
          <p className="text-sm text-muted-foreground">
            Every answer comes with cryptographic proof from our oracle network.
          </p>
        </div>

        <div className="p-6 bg-card rounded-xl shadow-sm border border-border">
          <CheckCircle className="w-10 h-10 text-primary mb-4 mx-auto" />
          <h3 className="font-semibold text-lg mb-2 text-foreground">On-Chain Audit</h3>
          <p className="text-sm text-muted-foreground">
            All queries and answers recorded on Sui for complete transparency.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="pt-8">
        <div className="bg-primary/10 border border-primary/30 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-foreground">Get Started</h2>
          <p className="text-foreground mb-6">
            Connect your Sui wallet to start querying private documents with verifiable AI.
          </p>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>• Store documents on Walrus (decentralized)</p>
            <p>• Query through Sui smart contracts</p>
            <p>• Get verified answers from TEE-based oracles</p>
          </div>
        </div>
      </div>

      {/* Architecture Diagram */}
      <div className="pt-8">
        <h3 className="text-xl font-semibold mb-4 text-foreground">How It Works</h3>
        <div className="bg-card rounded-xl shadow-sm border border-border p-8">
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-2 text-foreground font-semibold text-xl">
                1
              </div>
              <p className="font-medium text-foreground">User</p>
              <p className="text-xs text-muted-foreground">Ask Question</p>
            </div>

            <div className="text-2xl text-muted-foreground">→</div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2 text-foreground font-semibold text-xl">
                2
              </div>
              <p className="font-medium text-foreground">Sui Contract</p>
              <p className="text-xs text-muted-foreground">Emit Event</p>
            </div>

            <div className="text-2xl text-muted-foreground">→</div>

            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-2 text-foreground font-semibold text-xl">
                3
              </div>
              <p className="font-medium text-foreground">Oracle</p>
              <p className="text-xs text-muted-foreground">Process Query</p>
            </div>

            <div className="text-2xl text-muted-foreground">→</div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2 text-foreground font-semibold text-xl">
                4
              </div>
              <p className="font-medium text-foreground">Walrus</p>
              <p className="text-xs text-muted-foreground">Fetch Data</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
