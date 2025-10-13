'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, Heart, Share2, X, ChevronDown } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import { AddToCartButton } from '@/components/cart/AddToCartButton'
import Spinner from '@/components/ui/spinner/Spinner'
import BackButton from '@/components/backButton/BackButton'
import AddToFavoriteButton from '@/components/ui/spinner/AddToFavoriteButton'
import ProductReviews from '@/components/product/ProductReview'
import { CartBadge } from '@/components/cart/CartBadge'
import { useCart } from '@/lib/hooks/useCart'

interface Product {
  id: string | number
  name: string
  price: number
  discounted_price?: number | null
  images: string[]
  in_stock: boolean
  description?: string
  colors?: Array<{ name: string; hex: string }>
  sizes?: string[]
  rating?: number
  reviews_count?: number
}

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params?.id as string
  const router = useRouter()
  const { addToCart, updateQuantity, hasItem, removeItem } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string } | undefined>(
    undefined,
  )
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [isFavorited, setIsFavorited] = useState(false)
  const [activeModal, setActiveModal] = useState<'color' | 'size' | null>(null)
  const [isAddedToCart, setIsAddedToCart] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`)
        if (!response.ok) throw new Error('Product not found')
        const data = await response.json()

        setProduct(data)
        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0])
        }
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0])
        }
      } catch (error) {
        console.error('Failed to fetch product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    )
  }

  if (!product) {
    return <div className="flex items-center justify-center h-screen">Product not found</div>
  }

  const effectivePrice = product.discounted_price || product.price
  const images = product.images && product.images.length > 0 ? product.images : ['/placeholder.png']

  const handleDecreaseQuantity = () => {
    if (quantity <= 1) {
      // Remove from cart if quantity would be 0
      if (selectedColor && selectedSize) {
        const itemId = `${product.id}-${selectedColor.name}-${selectedSize}`
        removeItem(itemId)
      }
      setQuantity(0)
      setIsAddedToCart(false)
    } else {
      const newQuantity = quantity - 1
      setQuantity(newQuantity)
      // Update cart with new quantity
      if (selectedColor && selectedSize && product.in_stock) {
        const itemId = `${product.id}-${selectedColor.name}-${selectedSize}`
        updateQuantity(itemId, newQuantity)
      }
    }
  }

  const handleIncreaseQuantity = () => {
    const newQuantity = quantity + 1
    setQuantity(newQuantity)

    // Check if product is in cart
    if (selectedColor && selectedSize && product.in_stock) {
      const isInCart = hasItem(product.id, selectedColor.name, selectedSize)

      if (!isInCart) {
        // Add to cart if not already there
        addToCart({
          product_id: product.id,
          name: product.name,
          price: product.price,
          discounted_price: product.discounted_price || undefined,
          image: product.images[0],
          color: selectedColor.name,
          color_hex: selectedColor.hex,
          size: selectedSize,
          in_stock: product.in_stock,
          quantity: newQuantity,
        })
        setIsAddedToCart(true)
      } else {
        // Update quantity if already in cart
        const itemId = `${product.id}-${selectedColor.name}-${selectedSize}`
        updateQuantity(itemId, newQuantity)
        setIsAddedToCart(true)
      }
    }
  }

  return (
    <div className="min-h-screen bg-brand text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 sticky top-0 bg-brand z-10">
        <button onClick={() => router.back()}>
          <BackButton />
        </button>
        <button>
          <div className="icon-btn">
            <CartBadge />
          </div>
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto flex-1">
        {/* Product Images */}
        <div className="relative w-full">
          <div className="relative w-full aspect-square bg-brand-3">
            <Image
              src={images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Image Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 p-4 overflow-x-auto snap-x snap-mandatory no-scrollbar">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-16 h-16 rounded flex-shrink-0 transition-colors ${
                    selectedImage === idx ? 'border border-primary' : ''
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${idx + 1}`}
                    fill
                    className="object-cover rounded"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col px-4 space-y-4 py-4">
          {/* Name and Price */}
          <div>
            <h2 className="text-sm font-semibold mb-2">{product.name}</h2>
            <div className="flex items-baseline gap-3">
              <span className="text-xl font-bold text-white">${effectivePrice.toFixed(2)}</span>
              {product.discounted_price && product.discounted_price > 0 && (
                <span className="text-sm text-gray-400 line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Color Dropdown */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <button
                onClick={() => setActiveModal('color')}
                className="w-full flex items-center justify-between p-4 bg-brand-3 rounded-full "
              >
                <span className="text-sm text-gray-400">Color</span>
                <div className="flex items-center">
                  {selectedColor && (
                    <div className="flex items-center gap-6">
                      <div
                        className="w-4 h-4 rounded-full border border-brand-3"
                        style={{ backgroundColor: selectedColor.hex }}
                      />
                      <ChevronDown size={18} className="text-gray-400" />
                    </div>
                  )}
                </div>
              </button>
            </div>
          )}

          {/* Size Dropdown */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <button
                onClick={() => setActiveModal('size')}
                className="w-full flex items-center justify-between p-4 bg-brand-3 rounded-full "
              >
                {' '}
                <span className="text-sm text-gray-400">Size</span>
                {selectedSize && (
                  <div className="flex items-center gap-6">
                    <span className="text-sm font-medium">{selectedSize}</span>
                    <ChevronDown size={18} className="text-gray-400" />
                  </div>
                )}
              </button>
            </div>
          )}

          {/* Quantity Selector */}
          <div>
            <div className="flex items-center justify-between bg-brand-3 w-full p-3 rounded-full">
              <h3 className="font-semibold text-lg">Quantity</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleDecreaseQuantity}
                  className="flex items-center justify-center  rounded-full text-lg w-8 h-8 font-bold bg-primary transition-colors hover:bg-brand-3 hover:text-primary"
                >
                  −
                </button>
                <span className="text-sm font-semibold w-8 text-center">{quantity}</span>
                <button
                  onClick={handleIncreaseQuantity}
                  className="flex items-center justify-center  rounded-full text-lg w-8 h-8 font-bold bg-primary transition-colors hover:bg-brand-3 hover:text-primary"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {/* Description */}
            {product.description && (
              <div className="text-xs text-gray-300 leading-relaxed">{product.description}</div>
            )}

            {/* Shipping */}
            <div className="flex flex-col gap-2">
              <h2>Shipping & Returns</h2>
              <small>Free standard shipping and free 60-day returns</small>
            </div>

            {/* Rating */}
            <div className="flex flex-col gap-2">
              <h3>Reviews</h3>
              {product.rating && (
                <div className="flex flex-col items-start gap-2">
                  <p className="text-lg"> {product.rating} Ratings</p>
                  <p className="text-gray-400 text-sm">{product.reviews_count} Reviews</p>
                </div>
              )}
              <ProductReviews productId={product.id} />
            </div>
          </div>

          {/* Stock Status */}
          {!product.in_stock && (
            <div className="p-3 bg-red-900/30 border border-red-500 rounded text-red-200 text-sm">
              Out of Stock
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom Section */}
      <div className="sticky bottom-0 bg-brand border-t border-gray-700 p-4">
        {/* Add to Cart Button */}
        <div className="flex items-center justify-between px-4 py-2 bg-primary rounded-full w-full">
          <span className="text-xl font-bold text-white">${effectivePrice.toFixed(2)}</span>

          <AddToFavoriteButton/>

          <div className="flex items-center">
            {isAddedToCart ? (
              <button
                onClick={() => router.push('/cart')}
                className="text-white font-semibold px-6 py-2 rounded-full hover:opacity-90 transition-opacity"
              >
                Checkout
              </button>
            ) : (
              <AddToCartButton
                product={{
                  id: String(product.id),
                  name: product.name,
                  price: product.price,
                  discounted_price: product.discounted_price ?? product.price,
                  images: product.images,
                  in_stock: product.in_stock,
                }}
                selectedColor={selectedColor}
                selectedSize={selectedSize}
                onSuccess={() => setIsAddedToCart(true)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Color Modal */}
      {activeModal === 'color' && product.colors && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-brand w-full rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto animate-slideUp">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Color</h2>
              <button onClick={() => setActiveModal(null)}>
                <X size={24} />
              </button>
            </div>

            <div className="space-y-3">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => {
                    setSelectedColor(color)
                    setActiveModal(null)
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-full transition-all ${
                    selectedColor?.name === color.name
                      ? 'bg-primary'
                      : 'bg-brand-3 hover:bg-brand-2'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{color.name}</span>
                  </div>
                  <div className="flex gap-4">
                    <div
                      className="w-6 h-6 rounded-full border-2 border-brand-3"
                      style={{ backgroundColor: color.hex }}
                    />

                    {selectedColor?.name === color.name && (
                      <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Size Modal */}
      {activeModal === 'size' && product.sizes && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-brand w-full rounded-t-3xl p-4 max-h-[80vh] overflow-y-auto animate-slideUp">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Size</h2>
              <button onClick={() => setActiveModal(null)}>
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setSelectedSize(size)
                    setActiveModal(null)
                  }}
                  className={`py-3 rounded-2xl font-semibold transition-all ${
                    selectedSize === size
                      ? 'bg-primary text-white'
                      : 'bg-brand-3 text-white hover:bg-gray-700'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
