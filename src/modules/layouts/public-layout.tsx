"use client"

import { usePathname } from 'next/navigation'
import Header from './header'
import Footer from './footer'
import Nav from "./nav"

interface PublicLayoutProps {
  children: React.ReactNode
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <>
      <div className="absolute top-0 w-full h-28 bg-transparent flex items-center justify-between px-12 z-[999]">
        <Header />
      </div>
      {children}
      <Nav />
      <Footer />
    </>
  )
}