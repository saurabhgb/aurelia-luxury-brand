import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import { AuthProvider } from '@/context/AuthContext'
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
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main>{children}</main>
            <CartDrawer />
            <ChatWindow />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
