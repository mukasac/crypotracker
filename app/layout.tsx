import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CryptoTracker - Smart Trading Made Easy',
  description: 'Join the waitlist for smarter crypto trading with AI-powered insights',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}>
          <main className="relative flex min-h-screen flex-col">
            {children}
            <Analytics />
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}