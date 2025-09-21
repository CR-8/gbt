"use client"

import { usePathname } from 'next/navigation'
import { AdminLayout } from '@/modules/layouts/admin-layout'
import { PublicLayout } from '@/modules/layouts/public-layout'

interface LayoutWrapperProps {
  children: React.ReactNode
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')

  if (isAdminRoute) {
    return children // Admin pages handle their own layout
  }

  return <PublicLayout>{children}</PublicLayout>
}