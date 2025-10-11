import Image from 'next/image';
import { PlusCircleIcon, Heart } from 'lucide-react';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  discounted_price?: number;
}

export default function ProductCard({ name, price, image, discounted_price }: ProductCardProps) {
  // Validate and sanitize image URL
  const getValidImageUrl = (img: string | null | undefined): string => {
    if (!img || typeof img !== 'string' || img.trim() === '') {
      return '/products/shirt-1.png';
    }
    const trimmed = img.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
      return trimmed;
    }
    return '/products/shirt-1.png';
  };

  const validImage = getValidImageUrl(image);

  return (
    <div className="relative flex flex-col items-center justify-center min-w-[160px] min-h-[286px] rounded-lg cursor-pointer group overflow-hidden transition-all duration-300">
      <div className="relative h-[220px] w-[159px] overflow-hidden rounded-t-lg bg-[#c0c2c1] flex items-center justify-center">
        <Image
          src={validImage}
          alt={name || 'Product image'}
          width={159}
          height={220}
          priority
          style={{ objectFit: 'cover' }}
          className="transition-transform duration-500 ease-in-out group-hover:scale-105"
        />
      </div>
      {/* Product Info */}
      <div className="bg-brand-3 p-1 w-[161px] rounded-b-lg">
        <div className="flex flex-col gap-1">
          {name && <p className="text-white text-[10px] truncate">{name}</p>}
          {price !== undefined && (
            <div className="flex items-center gap-3">
              <span className="text-[12px] font-semibold text-white">
                ${discounted_price && discounted_price > 0 ? discounted_price.toFixed(2) : price.toFixed(2)}
              </span>
              {discounted_price && discounted_price > 0 && (
                <span className="text-[12px] font-semibold text-gray-400 line-through">
                  ${price.toFixed(2)}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Heart Icon */}
      <div className="icon-btn absolute top-4 right-3 opacity-0 translate-y-[-10px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
        <Heart size={20} />
      </div>
      {/* Plus Icon */}
      <div className="icon-btn absolute right-3 bottom-20 opacity-0 translate-y-[10px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
        <PlusCircleIcon size={20} />
      </div>
    </div>
  );
}

