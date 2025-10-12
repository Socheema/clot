'use client';

import { useCart } from '@/lib/hooks/useCart';
import Link from 'next/link';
import EmptyCart from './EmptyCart';
import CartItem from './CartItem';

export default function Cart() {
  const { items, updateQuantity, removeItem, subtotal, totalItems } = useCart();

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart ({totalItems})</h1>

      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onUpdateQuantity={updateQuantity}
            onRemove={removeItem}
          />
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
