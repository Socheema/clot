'use client'
import React from 'react'

interface Category {
  id: number
  name: string
  image: string
  slug: string
}

interface CategoryPanelProps {
  categories: Category[]
  onClose: () => void
  onSelect: (slug: string) => void
}

export default function CategoryPanel({ categories, onClose, onSelect }: CategoryPanelProps) {
  return (
    <div className="relative bg-brand  rounded-t-3xl text-white w-full p-4 h-[calc(100vh-200px)] overflow-y-auto">
      {/* Close handle */}
      <div className="flex justify-center mb-4">
        <div onClick={onClose} className="w-10 h-1.5 bg-gray-500 rounded-full cursor-pointer" />
      </div>

      <h2 className="text-lg font-semibold mb-4">All Categories</h2>

      <div className="flex flex-col gap-3 w-full">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className="flex gap-4 text-center items-center justify-start bg-brand-3 py-1 px-2 rounded-md w-full"
            onClick={() => onSelect(cat.slug)}
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-16 h-16 rounded-full object-cover mb-2 bg-brand-1"
            />
            <span className="text-sm">{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
