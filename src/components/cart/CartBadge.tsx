'use client';

import { useCart } from '@/lib/hooks/useCart';
import { ShoppingBasket } from 'lucide-react';

export function CartBadge() {
  const { totalItems, toggleCart } = useCart();

  return (
    <button onClick={toggleCart} className="relative">
      <ShoppingBasket size={24} />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
          {totalItems > 9 ? '9+' : totalItems}
        </span>
      )}
    </button>
  );
}
