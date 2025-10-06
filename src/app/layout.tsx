import type { Metadata } from 'next'
import './globals.css'
import QueryProvider from '@/providers/QueryProvider'
import { Inter, Playfair_Display } from 'next/font/google'
// import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'
import BottomNav from '@/components/layout/BottomNav'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-display' })

export const metadata = {
  title: 'Clot | Premium E-commerce',
  description: 'Shop the best fashion products with Clot',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <QueryProvider>
          <Navbar />
          <main>{children}</main>
          <BottomNav />
        </QueryProvider>
      </body>
    </html>
  )
}
