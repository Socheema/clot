'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBasket, ChevronDown, Search, User } from 'lucide-react'
import { usePathname } from 'next/navigation'
import type { FC } from 'react'



interface NavLink {
  name: string
  href: string
}

const Navbar: FC = () => {
  const rawPath = usePathname()
  // usePathname can be null in some rendering contexts, so fallback to '/'
  const pathname = rawPath ?? '/'

  const navLinks: NavLink[] = [
    { name: 'Home', href: '/' },
    { name: 'Categories', href: '/categories' },
    { name: 'Favorites', href: '/favorites' },
  ]

  return (
    <nav className="w-full p-4 text-text flex flex-col md:px-8 gap-4 sticky top-0 left-0 right-0 z-50 shadow-card bg-background/90 backdrop-blur-md">
      {/* MOBILE VIEW */}
      <div className="flex flex-col gap-6 w-full md:hidden">
        <div className="flex items-center justify-between gap-4">
          <Link href="/">
            <Image src="/logo/clot.png" alt="Clot Logo" width={40} height={40} />
          </Link>
          <Link href="/" className="flex items-center rounded-[18px] bg-brand-2 gap-1 py-2 px-4">
            <p className="text-[14px]">Men</p>
            <ChevronDown size={16} />
          </Link>
          <Link
            href="/"
            className="icon-btn"
          >
            <ShoppingBasket size={20} />
          </Link>
        </div>

        <form
          action=""
          className="flex items-center justify-center w-full rounded-[18px] h-[40px] bg-brand-2 "
        >
          <Search size={16} className="ml-3 text-text-muted" />
          <input
            type="text"
            placeholder="Search for products, brands and more"
            className="w-full bg-background border-none px-2 text-sm focus:outline-none placeholder:text-[12px]"
          />
        </form>
      </div>

      {/* DESKTOP VIEW */}
      <div className="hidden md:flex items-center justify-between w-full">
        <Link href="/">
          <Image src="/logo/clot.png" alt="Clot Logo" width={50} height={50} />
        </Link>

        <div className="flex items-center gap-8">
          {navLinks.map(({ href, name }) => {
            const isActive = pathname === href

            return (
              <Link
                key={href}
                href={href}
                // make the link a group and position relative so the underline (absolute) can be placed
                className={`relative group flex items-center text-lg uppercase px-2 py-1 transition-colors duration-200 ${
                  isActive ? 'text-primary' : 'text-white/60 hover:text-white'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span>{name}</span>

                {/* Animated underline:
                    - starts with scale-x-0 (hidden)
                    - grows to scale-x-100 on group hover (left->right) because origin-left
                    - shrinks back to 0 (right->left) when hover ends
                */}
                <span
                  className={
                    'absolute left-0 bottom-0 h-[2px] w-full bg-primary transform origin-left transition-transform duration-400 ease-in-out ' +
                    (isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100')
                  }
                  aria-hidden="true"
                />
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-6">
          <form
            action=""
            className="flex items-center justify-center w-full rounded-[18px] h-[40px] bg-brand-2"
          >
            <Search size={16} className="ml-2 text-text-muted" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-background border-none px-2 text-sm focus:outline-none placeholder:text-[12px]"
            />
          </form>

          <Link href="/">
            <User size={20} className="text-text-muted hover:text-white" />
          </Link>

          <Link href="/">
            <ShoppingBasket className="hover:text-primary transition-colors" />
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
