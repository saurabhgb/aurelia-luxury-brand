import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import Navbar from '@/components/Navbar'
import CartDrawer from '@/components/CartDrawer'
import ChatWindow from '@/components/ChatWindow'

export const metadata: Metadata = {
  title: 'AURELIA | Luxury Fashion',
  description: 'Premium minimalist luxury fashion e-commerce.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Navbar />
          <main>{children}</main>
          <CartDrawer />
          <ChatWindow />
        </CartProvider>
      </body>
    </html>
  )
}
