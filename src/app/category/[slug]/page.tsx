import CategoryPage from './CategoryPage'
import { use } from 'react'

// ✅ Keep this as a simple entry point
export default function CategoryPageWrapper({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  return <CategoryPage slug={slug} />
}
