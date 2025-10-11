import CategoryPage from './CategoryPage'
import { use } from 'react'


export default function CategoryPageWrapper({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  return <CategoryPage slug={slug} />
}
