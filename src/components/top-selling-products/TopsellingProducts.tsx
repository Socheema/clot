import ProductCard from '../product/ProductCard'
import { getBestSellingProducts } from '@/lib/product'

const topSelling = await getBestSellingProducts()

export default function TopSellingProducts() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Top Selling</h2>
        <p>See All</p>
      </div>
      <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory">
        {topSelling.map((p) => (
          <ProductCard
            key={p.id}
            id={p.id}
            name={p.name}
            price={p.price}
            image={p.image}
            discounted_price={p.discounted_price}
          />
        ))}
      </div>
    </div>
  )
}
