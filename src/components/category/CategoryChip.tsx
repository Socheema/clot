'use client'
import Image from 'next/image'

interface CategoryChipProps {
  name: string
  image?: string | null 
  isActive?: boolean
  onClick?: () => void
}

export default function CategoryChip({
  name,
  image,
  isActive = false,
  onClick,
}: CategoryChipProps) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-2 focus:outline-none w-[80px] `}>
      {image ? (
        <Image
          src={image}
          alt={name}
          width={56}
          height={56}
          className="object-contain rounded-full"
        />
      ) : (
        <div className="w-[50px] h-[50px] rounded-full bg-gray-600" />
      )}

      <p className="text-[12px] capitalize items-center w-full truncate">{name}</p>
    </button>
  )
}
