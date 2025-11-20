'use client'

import { ConnectButton } from '@mysten/dapp-kit'
import { Waves } from 'lucide-react'
import Link from 'next/link'

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <img src="/logo.svg" alt="Fathom Protocol" className="h-10 w-auto" />
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">Fathom Protocol</h1>
              <p className="text-xs text-slate-600 font-medium">Privacy-Preserving AI</p>
            </div>
          </Link>
        </div>

        <nav className="flex items-center space-x-6">
          <Link href="/" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
            Upload
          </Link>
          <Link href="/documents" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
            Browse Documents
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <ConnectButton className="!bg-gradient-to-r !from-blue-600 !to-cyan-600 hover:!from-blue-700 hover:!to-cyan-700 !shadow-lg !shadow-blue-500/25" />
        </div>
      </div>
    </header>
  )
}
