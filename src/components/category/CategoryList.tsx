'use client'
import { useState } from 'react'
import CategoryChip from './CategoryChip'
import CategoryPanel from './CategoryPanel'
import { useRouter } from 'next/navigation'

interface Category {
  id: number
  name: string
  image: string
  slug: string
}

interface Props {
  categories: Category[]
}

export default function CategoryList({ categories }: Props) {
  const [active, setActive] = useState<string | null>(null)
  const [isCategoryPanelOpen, setIsCategoryPanelOpen] = useState(false)
  const router = useRouter()

  const handleSelect = (slug: string) => {
    setActive(slug)
    router.push(`/category/${slug}`)
    setIsCategoryPanelOpen(false)
  }

  return (
    <div className="flex flex-col gap-4 relative w-full">
      <div className="flex items-center justify-between">
        <p className="font-semibold">Categories</p>
        <p
          onClick={() => setIsCategoryPanelOpen(true)}
          className="text-sm text-white cursor-pointer hover:underline"
        >
          See All
        </p>
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar py-2 snap-x snap-mandatory">
        {categories.map((cat) => (
          <CategoryChip
            key={cat.id}
            name={cat.name}
            image={cat.image}
            isActive={active === cat.slug}
            onClick={() => handleSelect(cat.slug)}
          />
        ))}
      </div>

      {isCategoryPanelOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity animate-fadeIn"
            onClick={() => setIsCategoryPanelOpen(false)}
          />

          {/* Slide-up panel */}
          <div className="absolute inset-x-0 top-0 z-50 animate-slideUp overflow-y-auto snap-y snap-mandatory no-scrollbar">
            <CategoryPanel
              categories={categories}
              onClose={() => setIsCategoryPanelOpen(false)}
              onSelect={handleSelect}
            />
          </div>
        </>
      )}
    </div>
  )
}
