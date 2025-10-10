import Image from 'next/image'
import React, { FC } from 'react'
import { PlusCircleIcon, Heart } from 'lucide-react'

export type HeroProps = {
  description?: string
  price?: number
  discountedPrice?: number
  backgroundSrc?: string
}

const Hero: FC<HeroProps> = ({ description, price, discountedPrice, backgroundSrc }) => {
  return (
    <section
      className="relative flex flex-col items-center justify-center min-w-[160px] min-h-[286px] rounded-lg cursor-pointer group overflow-hidden transition-all duration-300"
    >
      {/* Background Image */}
      {backgroundSrc && (
        <div className="relative h-[220px] w-[159px] overflow-hidden rounded-t-lg">
          <Image
            src={backgroundSrc}
            alt={description || 'Hero Background'}
            fill
            style={{ objectFit: 'cover' }}
            priority
            className="transition-transform duration-500 ease-in-out group-hover:scale-105"
          />
        </div>
      )}

      {/* Product Info */}
      <div className="bg-brand-3 p-2 w-full rounded-b-lg">
        <div className="flex flex-col gap-2">
          {description && <p className="text-white text-[10px]">{description}</p>}
          {price !== undefined && discountedPrice !== undefined && (
            <div className="flex items-center gap-3">
              <span className="text-[14px] font-semibold text-white">${price}</span>
              <span className="text-[14px] font-semibold text-white/50 line-through">
                ${discountedPrice}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Heart Icon */}
      <div
        className="icon-btn absolute top-4 right-3 opacity-0 translate-y-[-10px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0"
      >
        <Heart size={20} />
      </div>

      {/* Plus Icon */}
      <div
        className="icon-btn absolute right-3 bottom-20 opacity-0 translate-y-[10px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0"
      >
        <PlusCircleIcon size={20} />
      </div>
    </section>
  )
}

export default Hero
