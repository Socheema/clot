'use client'

import { useCart } from '@/lib/hooks/useCart'
import { useState } from 'react'
import { toast } from 'sonner'
import { PlusCircleIcon } from 'lucide-react'

type Product = {
  id: string | number
  name: string
  price: number
  discounted_price: number
  images: string[]
  in_stock: boolean
}

type Color = {
  name: string
  hex: string
}

interface AddToCartButtonProps {
  product: Product
  selectedColor?: Color
  selectedSize?: string
  onSuccess?: () => void
}

export function AddToCartButton({
  product,
  selectedColor,
  selectedSize,
  onSuccess
}: AddToCartButtonProps) {
  const { addToCart, hasItem } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = async () => {
    if (!selectedColor) {
      toast.error('Please select a color')
      return
    }
    if (!selectedSize) {
      toast.error('Please select a size')
      return
    }

    setIsAdding(true)
    try {
      addToCart({
        product_id: product.id,
        name: product.name,
        price: product.price,
        discounted_price: product.discounted_price,
        image: product.images[0],
        color: selectedColor.name,
        color_hex: selectedColor.hex,
        size: selectedSize,
        in_stock: product.in_stock,
      })

      toast.success('Added to cart!')

      // Call the success callback after 2 seconds
      setTimeout(() => {
        if (onSuccess) {
          onSuccess()
        }
      }, 2000)
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

  const isInCart = hasItem(product.id, selectedColor?.name, selectedSize)

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding || !product.in_stock}
      className="w-full bg-primary text-white py-2 px-2 rounded-full font-semibold flex items-center justify-center gap-2"
    >
      <PlusCircleIcon size={18} />
      {isAdding ? 'Adding...' : isInCart ? 'Added to Cart' : 'Add to Cart'}
    </button>
  )
}
