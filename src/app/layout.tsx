import type { Metadata } from 'next'
import './globals.css'
import QueryProvider from '@/providers/QueryProvider'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'

import ConditionalLayout from '@/components/layout/ConditionalLayout'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'Clot | Premium E-commerce',
  description: 'Shop the best fashion products with Clot',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className}`} suppressHydrationWarning>
        <QueryProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
             <Toaster position="top-right" />
        </QueryProvider>
      </body>
    </html>
  )
}
