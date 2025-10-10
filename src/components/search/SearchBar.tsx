'use client'
import { ChevronLeft, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Props {
  query: string
  setQuery: (value: string) => void
  onSearch: (e: React.FormEvent) => void
}

export default function SearchBar({ query, setQuery, onSearch }: Props) {
  const router = useRouter()

  return (
   <div className='flex items-center gap-4'>
       <ChevronLeft size={35} className="text-gray-400 cursor-pointer bg-brand-3 p-2 rounded-full" onClick={() => router.push('/')} />
     <form onSubmit={onSearch} className="flex flex-1 items-center bg-[#2A2433] rounded-full px-4 py-3 gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search"
        className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-gray-400"
      />
      {query && (
        <X
          size={18}
          className="text-gray-400 cursor-pointer"
          onClick={() => setQuery('')}
        />
      )}
    </form>
   </div>
  )
}
