import { getCategories } from '@/lib/product'
import CategoryList from '@/components/category/CategoryList'
import TopSellingProducts from '@/components/top-selling-products/TopsellingProducts'
import NewProduct from '@/components/new-products/NewProducts'



export default async function HomePage() {
  const categories = await getCategories()
  return (
    <main className="flex flex-col gap-6 p-6">
      <CategoryList categories={categories} />
      <TopSellingProducts />
      <NewProduct />
    </main>
  )
}
