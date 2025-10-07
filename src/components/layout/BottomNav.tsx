'use client'

import { Home, Grid, Heart, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { FC } from 'react'

interface NavLinks {
  href: string
  icon: FC<{ size?: number | string }>
  label: string
}

const navItems: NavLinks[] = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/categories', icon: Grid, label: 'Categories' },
  { href: '/favorites', icon: Heart, label: 'Favorites' },
  { href: '/profile', icon: User, label: 'Profile' },
]

const BottomNav: FC = () => {
  const rawPath = usePathname()
  const pathname = rawPath ?? '/'

  return (
    <nav className="fixed bottom-0 left-0 right-0 flex justify-around py-3 md:hidden shadow-card bg-background/90 backdrop-blur-md z-50">
      {navItems?.map(({ href, icon: Icon, label }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center text-xs ${
              active ? 'text-primary' : 'text-white/50'
            }`}
          >
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

export default BottomNav
