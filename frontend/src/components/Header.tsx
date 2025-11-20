'use client'

import { ConnectButton } from '@mysten/dapp-kit'
import Link from 'next/link'

export function Header() {
  return (
    <header className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <img src="/logo.svg" alt="Fathom-0x Protocol" className="h-10 w-auto" />
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-cyan-400">Fathom-0x Protocol</h1>
              <p className="text-xs text-muted-foreground font-medium">Privacy-Preserving AI</p>
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="#app-section" className="text-muted-foreground hover:text-primary font-medium transition-colors">
            App
          </Link>
          <Link href="/documents" className="text-muted-foreground hover:text-primary font-medium transition-colors">
            Browse
          </Link>
          <Link href="/query" className="text-muted-foreground hover:text-primary font-medium transition-colors">
            Query
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <ConnectButton />
        </div>
      </div>
    </header>
  )
}
