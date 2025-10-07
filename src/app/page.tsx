'use client'

import CategoryList from '@/components/category/CategoryList'
import Hero from '@/components/hero/Hero'
import NewProduct from '@/components/newProduct/NewProduct'



export default function Home() {
  return (
    <div className="px-4 mt-4 flex flex-col gap-6">
      <CategoryList />
      <Hero />
      <NewProduct/>
    </div>
  )
}
