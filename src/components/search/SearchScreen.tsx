'use client'
import { useState } from 'react'
import SearchBar from './SearchBar'
import SearchCategoryList from './SearchCategoryList'
import { useRouter } from 'next/navigation'
import Image from 'next/image'


interface Category {
  id: number
  name: string
  image: string
  slug: string
}

interface Props {
  categories: Category[]
}

export default function SearchScreen({ categories }: Props) {
  const [query, setQuery] = useState('')
  const router = useRouter()
   const [results, setResults] = useState<any[]>([])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?query=${query}`)
    }
    setResults([])
  }

  const noResults = query.length > 0 && results.length === 0

  return (
    <div className="min-h-screen bg-brand text-white px-4 py-6 fixed top-18 left-0 right-0 z-50 h-[cal(100vh-72px)] overflow-y-auto">
      {/* Search Bar */}
      <SearchBar query={query} setQuery={setQuery} onSearch={handleSearch} />

      {/* Shop by Categories */}
      {!query && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">Shop by Categories</h2>
          <SearchCategoryList categories={categories} />
        </div>
      )}
  {/* Empty state */}
      {noResults && (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="relative w-24 h-24 mb-6">
            <Image
              src="/icons/search.png" // add your own image here
              alt="No results"
              fill
              className="object-contain opacity-90"
            />
          </div>

          <h2 className="text-lg font-medium mb-2">
            Sorry, we couldn’t find any matching result for your search.
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            Try searching with different keywords.
          </p>

          <button
            onClick={() => setQuery('')}
            className="bg-primary text-brand rounded-full px-6 py-2 font-semibold"
          >
            Try Again
          </button>
        </div>
      )}

    </div>
  )
}




