import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from "@vercel/analytics/react"
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

import Providers from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'meal spark',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <ClerkProvider>
          <html lang="en" data-theme='cmyk'>
            <body className={`${inter.className} antialiased`}>
              {children}
              <Analytics />
            </body>
          </html>
      </ClerkProvider>
    </Providers>
  )
}
