'use client'
import { useRouter } from 'next/navigation'

interface Category {
  id: number
  name: string
  image: string
  slug: string
}

export default function SearchCategoryList({ categories }: { categories: Category[] }) {
  const router = useRouter()

  return (
    <div className="flex flex-col gap-3">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => router.push(`/category/${cat.slug}`)}
          className="flex items-center justify-between bg-[#2A2433] rounded-xl px-4 py-3"
        >
          <div className="flex items-center gap-3">
            <img
              src={cat.image}
              alt={cat.name}
              className="w-10 h-10 rounded-full object-cover bg-gray-800"
            />
            <span className="text-sm">{cat.name}</span>
          </div>
        </button>
      ))}
    </div>
  )
}
