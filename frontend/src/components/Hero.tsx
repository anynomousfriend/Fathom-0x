'use client'

import { Shield, Lock, CheckCircle, Waves } from 'lucide-react'

export function Hero() {
  return (
    <div className="max-w-4xl mx-auto text-center py-16 space-y-8">
      {/* Main Heading */}
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center">
            <Waves className="w-12 h-12 text-white" />
          </div>
        </div>
        <h1 className="text-5xl font-bold text-gray-900">
          Welcome to Fathom
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Verifiable RAG for Private Data on Walrus
        </p>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <div className="p-6 bg-white rounded-xl shadow-sm border">
          <Lock className="w-10 h-10 text-blue-600 mb-4 mx-auto" />
          <h3 className="font-semibold text-lg mb-2">Private Data</h3>
          <p className="text-sm text-gray-600">
            Your documents stay encrypted on Walrus. Never exposed to centralized servers.
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow-sm border">
          <Shield className="w-10 h-10 text-blue-600 mb-4 mx-auto" />
          <h3 className="font-semibold text-lg mb-2">Verifiable AI</h3>
          <p className="text-sm text-gray-600">
            Every answer comes with cryptographic proof from our oracle network.
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow-sm border">
          <CheckCircle className="w-10 h-10 text-blue-600 mb-4 mx-auto" />
          <h3 className="font-semibold text-lg mb-2">On-Chain Audit</h3>
          <p className="text-sm text-gray-600">
            All queries and answers recorded on Sui for complete transparency.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="pt-8">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4">Get Started</h2>
          <p className="text-gray-700 mb-6">
            Connect your Sui wallet to start querying private documents with verifiable AI.
          </p>
          <div className="text-sm text-gray-600 space-y-2">
            <p>✅ Store documents on Walrus (decentralized)</p>
            <p>✅ Query through Sui smart contracts</p>
            <p>✅ Get verified answers from TEE-based oracles</p>
          </div>
        </div>
      </div>

      {/* Architecture Diagram */}
      <div className="pt-8">
        <h3 className="text-xl font-semibold mb-4">How It Works</h3>
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">👤</span>
              </div>
              <p className="font-medium">User</p>
              <p className="text-xs text-gray-500">Ask Question</p>
            </div>

            <div className="text-2xl text-gray-400">→</div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">📝</span>
              </div>
              <p className="font-medium">Sui Contract</p>
              <p className="text-xs text-gray-500">Emit Event</p>
            </div>

            <div className="text-2xl text-gray-400">→</div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">🤖</span>
              </div>
              <p className="font-medium">Oracle</p>
              <p className="text-xs text-gray-500">Process Query</p>
            </div>

            <div className="text-2xl text-gray-400">→</div>

            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">🌊</span>
              </div>
              <p className="font-medium">Walrus</p>
              <p className="text-xs text-gray-500">Fetch Data</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
