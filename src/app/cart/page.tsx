'use client'

import { useCart } from '@/lib/hooks/useCart'
import { Trash2, Plus, Minus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { CartBadge } from '@/components/cart/CartBadge'
import BackButton from '@/components/backButton/BackButton'
import { useEffect } from 'react'

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, totalItems } = useCart()

  useEffect(() => {
    console.log('Cart items:', items)
  }, [items])

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center py-12">
        <ShoppingBag size={64} className="mx-auto mb-4 opacity-50" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some items to get started</p>
        <Link href="/" className="bg-primary text-white px-6 py-3 rounded-full">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto p-4">
      <div className="sticky top-0 flex items-center justify-between bg-brand px-1 py-4 shadow z-10">
        <BackButton />
        <h2 className="text-xl font-bold">Cart</h2>
        <div className="icon-btn">
          <CartBadge />
        </div>
      </div>

      <div className="flex flex-col gap-2 overflow-y-auto snap-y snap-mandatory no-scrollbar">
        <div className="space-y-2 rounded-lg">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-2 bg-brand-3 p-1 rounded-lg ">
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.name || 'Product'}
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
              <div className="flex flex-col gap-4 w-full">
                <div className="flex item-center justify-between">
                  <h3 className=" self-center font-semibold text-xs truncate max-w-[100px]">
                    {item.name || 'Product'}
                  </h3>

                  <div className="flex items-center gap-4">
                    <p className="text-xs text-white font-bold">
                      ${(item.discounted_price || item.price).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors bg-primary rounded-full p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex item-center justify-between ">
                  <div className="flex items-center gap-2">
                    <p className="flex text-sm text-white/50  text-[10px] ">
                      Size - <span className="text-white font-semibold">{item.size}</span>
                    </p>
                    <p className=" flex text-sm text-white/50  text-[10px] ">
                      Color - <span className="text-white font-semibold"> {item.color}</span>
                    </p>
                  </div>
                  <div className="flex items-center rounded-full">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                      className="text-white hover:text-brand bg-primary rounded-full p-1"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="text-white hover:text-brand bg-primary rounded-full p-1"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 right-0 left-0 p-4 rounded-lg bg-brand-3">
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal ({totalItems} items)</span>
            <span className="font-bold">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span className="text-primary font-semibold">FREE</span>
          </div>
          <div className="border-t pt-4 flex justify-between text-xl font-bold">
            <span>Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
        </div>

        <Link
          href="/checkout"
          className="w-full bg-primary text-white py-4 rounded-full font-semibold mt-6 block text-center hover:bg-primary/90 transition-colors"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  )
}
