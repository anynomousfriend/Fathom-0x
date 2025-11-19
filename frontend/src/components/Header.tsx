'use client'

import { ConnectButton } from '@mysten/dapp-kit'
import { Waves } from 'lucide-react'

export function Header() {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Waves className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Fathom Protocol</h1>
            <p className="text-xs text-gray-600">Verifiable RAG for Private Data</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <ConnectButton />
        </div>
      </div>
    </header>
  )
}
