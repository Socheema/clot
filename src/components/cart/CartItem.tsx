import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '@/types/cart';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const price = item.discounted_price || item.price;

  return (
    <div className="flex gap-4 border-b pb-4">
      <div className="relative w-20 h-20">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover rounded"
        />
      </div>

      <div className="flex-1">
        <h4 className="font-semibold">{item.name}</h4>
        {item.color && <p className="text-sm text-gray-500">Color: {item.color}</p>}
        {item.size && <p className="text-sm text-gray-500">Size: {item.size}</p>}
        <p className="font-semibold mt-2">${(price * item.quantity).toFixed(2)}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          className="px-2 py-1 border rounded"
        >
          -
        </button>
        <span className="w-8 text-center">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          className="px-2 py-1 border rounded"
        >
          +
        </button>
        <button
          onClick={() => onRemove(item.id)}
          className="ml-4 text-red-600 hover:text-red-700"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
