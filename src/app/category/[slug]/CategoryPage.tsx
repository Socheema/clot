import { getProductsByCategory, getCategoryBySlug } from '@/lib/product'
import ProductCard from '@/components/product/ProductCard'
import BackButton from '@/components/backButton/BackButton'


export default async function CategoryPage({ slug }: { slug: string }) {
  const category = await getCategoryBySlug(slug)
  const products = await getProductsByCategory(slug)

  if (!category) {
    return <div className="p-6 text-gray-400">Category not found.</div>
  }

  return (
    <main className="p-6">




          <BackButton />

          <div className="flex items-center gap-2 mt-4">
            <h3 className="text-lg font-semibold">{category.name}</h3>
            <span className="flex h-5 w-5 rounded-full bg-brand-3 items-center justify-center text-xs text-white">
              {products.length}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            {products.map((p) => (
              <ProductCard key={p.id} id={p.id} name={p.name} price={p.price} image={p.image} discounted_price={p.discounted_price}/>
            ))}
          </div>


    </main>
  )
}
