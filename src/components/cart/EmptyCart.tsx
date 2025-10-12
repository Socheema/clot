'use client'
import { useCart } from '@/lib/hooks/useCart'
import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'

export default function EmptyCart() {
  const { items } = useCart()

  return (
    <>
      {items.length === 0 && (
        <div className="text-center py-12">
          <ShoppingBag size={64} className="mx-auto mb-4 opacity-50" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some items to get started</p>
          <Link href="/" className="bg-primary text-white px-6 py-3 rounded-full">
            Continue Shopping
          </Link>
        </div>
      )}
    </>
  )
}
