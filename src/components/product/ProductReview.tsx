'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Spinner from '@/components/ui/spinner/Spinner'

interface Review {
  id: number
  reviewer_name: string
  reviewer_image_url: string | null
  review_text: string
  rating: number
  created_at: string
}

interface ProductReviewsProps {
  productId: string | number
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMins = Math.floor(diffMs / (1000 * 60))

  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffMins > 0) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
  return 'Just now'
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= rating ? 'text-primary' : 'text-gray-600'}
        >
          ★
        </span>
      ))}
    </div>
  )
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/products/${productId}/reviews`)
        if (!response.ok) throw new Error('Failed to fetch reviews')
        const data = await response.json()
        setReviews(data.reviews || [])
      } catch (error) {
        console.error('Error fetching reviews:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [productId])

  if (loading) {
    return <div className="flex justify-center py-8"><Spinner /></div>
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No reviews yet. Be the first to review this product!
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4">
        Reviews ({reviews.length})
      </h3>

      {reviews.map((review) => (
        <div key={review.id} className="border border-gray-700 rounded-lg p-4">
          {/* Reviewer Info */}
          <div className="flex items-start gap-3 mb-3">
            {review.reviewer_image_url ? (
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image
                  src={review.reviewer_image_url}
                  alt={review.reviewer_name}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">
                  {review.reviewer_name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-white text-sm">
                  {review.reviewer_name}
                </h4>
                <span className="text-xs text-gray-400">
                  {formatTimeAgo(review.created_at)}
                </span>
              </div>
              <StarRating rating={review.rating} />
            </div>
          </div>

          {/* Review Text */}
          <p className="text-gray-300 text-sm leading-relaxed">
            {review.review_text}
          </p>
        </div>
      ))}
    </div>
  )
}
