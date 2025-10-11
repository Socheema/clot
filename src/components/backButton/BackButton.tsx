"use client"

import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function BackButton() {
  const router = useRouter()

  return (
    <button>
      <ChevronLeft
        size={40}
        className="p-2 rounded-full text-gray-400 cursor-pointer bg-brand-3"
        onClick={() => router.back()}
      />
    </button>
  )
}
