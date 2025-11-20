import type { Metadata } from 'next'
import { Space_Grotesk, Archivo } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import { SmoothScroll } from '@/components/SmoothScroll'
import { ThemeProvider } from "@/components/ThemeProvider";

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const archivo = Archivo({ 
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Fathom-0x Protocol - Verifiable RAG for Private Data',
  description: 'Enabling AI to reason over encrypted documents with cryptographic proof of integrity',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${archivo.variable} ${spaceGrotesk.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <SmoothScroll>
              {children}
            </SmoothScroll>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
