import Image from 'next/image'
import React, { FC } from 'react'
import { HeroProps } from './HeroCard'
import HeroCard from './HeroCard'

const topSellingProducts: HeroProps[] = [
  {
    backgroundSrc: '/top-selling/shirt-1.png',
    description: 'Nike Air Max 270 React',
    price: 150,
    discountedPrice: 120,
  },
  {
    backgroundSrc: '/top-selling/shirt-2.png',
    description: 'Adidas Ultraboost 21',
    price: 180,
    discountedPrice: 140,
  },
  {
    backgroundSrc: '/top-selling/shirt-3.png',
    description: 'Puma RS-X3',
    price: 130,
    discountedPrice: 100,
  },
  {
    backgroundSrc: '/top-selling/shirt-4.png',
    description: 'Reebok Zig Kinetica',
    price: 160,
    discountedPrice: 130,
  },
  {
    backgroundSrc: '/top-selling/shirt-5.png',
    description: 'New Balance 990v5',
    price: 170,
    discountedPrice: 135,
  },
]

const Hero: FC = () => {
  return (
    <div className="flex flex-col gap-4 items-center ">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <p className="font-bold">Top selling</p>
        <p className="text-sm cursor-pointer hover:underline">See All</p>
      </div>

      {/* Scrollable List */}
      <div className="flex items-center gap-3 w-full overflow-x-auto no-scrollbar px-2 snap-x snap-mandatory">
        {topSellingProducts.map((product, index) => (
          <HeroCard
            key={index}
            description={product.description}
            price={product.price}
            discountedPrice={product.discountedPrice}
            backgroundSrc={product.backgroundSrc}
          />
        ))}
      </div>
    </div>
  )
}

export default Hero
