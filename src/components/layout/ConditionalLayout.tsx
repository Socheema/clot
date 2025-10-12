'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import BottomNav from '@/components/layout/BottomNav';
import { ReactNode } from 'react';

// Define props interface for the component
interface ConditionalLayoutProps {
  children: ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();

  const showNavbar =
    !pathname.includes('/admin') &&
    !pathname.includes('/login') &&
    !pathname.includes('/cart') &&
    !pathname.includes('/checkout') &&
    !pathname.includes('/payment') &&
    !pathname.includes('/account') &&
    !pathname.includes('/signup') &&
    !pathname.includes('/product/'); // Add this line

  const showFooter =
    !pathname.includes('/admin') &&
    !pathname.includes('/login') &&
    !pathname.includes('/product/1') &&
    !pathname.includes('/signup');

  return (
    <>
      {showNavbar && <Navbar />}
      {children}
      {showFooter && <BottomNav />}
    </>
  );
}
