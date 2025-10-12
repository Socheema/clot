'use client';

import { useCart } from '@/lib/hooks/useCart';
import { Trash2, Plus, Minus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';


export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag size={64} className="mx-auto mb-4 opacity-50" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some items to get started</p>
        <Link href="/" className="bg-primary text-white px-6 py-3 rounded-full">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart ({totalItems})</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 bg-white p-4 rounded-lg">
            <Image
              src={item.image}
              alt={item.name}
              width={100}
              height={100}
              className="rounded-lg"
            />

            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-500">
                {item.color} • {item.size}
              </p>
              <p className="font-bold mt-2">
                ${(item.discounted_price || item.price).toFixed(2)}
              </p>
            </div>

            <div className="flex flex-col items-end justify-between">
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500"
              >
                <Trash2 size={20} />
              </button>

              <div className="flex items-center gap-2 border rounded-full px-3 py-1">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="text-gray-500"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="text-gray-900"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg">
        <div className="flex justify-between mb-4">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-bold">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="text-gray-600">Shipping</span>
          <span className="text-green-600">FREE</span>
        </div>
        <div className="border-t pt-4 flex justify-between text-xl font-bold">
          <span>Total</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        <Link
          href="/checkout"
          className="w-full bg-primary text-white py-4 rounded-full font-semibold mt-6 block text-center"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
