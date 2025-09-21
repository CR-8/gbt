"use client"

import { usePathname } from 'next/navigation';
import Header from '@/modules/layout/header'
import Footer from '@/modules/layout/footer'
import Nav from "@/modules/layout/nav";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && (
        <div className="absolute top-0 w-full h-28 bg-transparent flex items-center justify-between px-12 z-[999]">
          <Header />
        </div>
      )}
      {children}
      {!isAdminRoute && <Nav/>}
      {!isAdminRoute && <Footer/>}
    </>
  );
}