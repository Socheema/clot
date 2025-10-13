'use client'

import Image from 'next/image'
import { Heart, PlusCircleIcon } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'
import { useCart } from '@/lib/hooks/useCart'

interface ProductCardProps {
  id: string | number
  name: string
  price: number
  image: string
  discounted_price?: number | null
  images?: string[]
  in_stock?: boolean
}

export default function ProductCard({
  id,
  name,
  price,
  image,
  discounted_price,
  images = [],
  in_stock = true,
}: ProductCardProps) {
  // Validate and sanitize image URL
  const getValidImageUrl = (img: string | null | undefined): string => {
    if (!img || typeof img !== 'string' || img.trim() === '') {
      return '/placeholder.png'
    }
    const trimmed = img.trim()
    if (
      trimmed.startsWith('http://') ||
      trimmed.startsWith('https://') ||
      trimmed.startsWith('/')
    ) {
      return trimmed
    }
    return '/placeholder.png'
  }

  const validImage = getValidImageUrl(image)
  const { addToCart } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsAdding(true)
    try {
      addToCart({
        product_id: id,
        name: name,
        price: price,
        discounted_price: discounted_price || undefined,
        image: validImage,
        color: 'Default',
        color_hex: '#000000',
        size: 'One Size',
        in_stock: in_stock,
        quantity: 1,
      })

      toast.success('Added to cart!')
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('An unexpected error occurred.')
      }
    } finally {
      setIsAdding(false)
    }
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFavorited(!isFavorited)
    toast.success(isFavorited ? 'Removed from favorites' : 'Added to favorites')
  }

  return (
    <Link href={`/product/${id}`}>
      <div className="relative flex flex-col items-center justify-center min-w-[160px] min-h-[286px] rounded-lg group overflow-hidden transition-all duration-300 cursor-pointer">
        {/* Product Image */}
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
        <div className="bg-brand-3 p-2 w-[160px] rounded-b-lg">
          <div className="flex flex-col gap-1">
            {name && (
              <p className="text-white text-[10px] truncate font-medium">{name}</p>
            )}
            {price !== undefined && (
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-semibold text-white">
                  $
                  {discounted_price && discounted_price > 0
                    ? discounted_price.toFixed(2)
                    : price.toFixed(2)}
                </span>
                {discounted_price && discounted_price > 0 && (
                  <span className="text-[11px] font-semibold text-gray-400 line-through">
                    ${price.toFixed(2)}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Heart Icon - Top Right */}
        <button
          onClick={handleFavorite}
          className="absolute top-6 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 bg-icon-btn backdrop-blur p-1.5 rounded-full hover:bg-white"
        >
          <Heart
            size={18}
            className={isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'}
          />
        </button>

        {/* Quick Add Button - Bottom Right */}
        <button
          onClick={handleQuickAdd}
          disabled={isAdding}
          className="absolute right-3 bottom-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 bg-white/80 backdrop-blur p-1.5 rounded-full hover:bg-white disabled:opacity-50"
        >
          <PlusCircleIcon size={18} className="text-primary" />
        </button>
      </div>
    </Link>
  )
}
