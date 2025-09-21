"use client"

import { AdminLayout } from '@/modules/layouts'
import { DashboardStats, QuickActions, RecentActivity } from '@/modules/sections/admin/dashboard'
import { ChartAreaInteractive } from "@/components/admin/chart-area-interactive"
import { useAdminStats } from '@/modules/hooks'

export default function AdminPage() {
  const { stats, loading, error } = useAdminStats()

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s what&apos;s happening with your robotics club.
          </p>
        </div>

        <DashboardStats stats={stats} loading={loading} />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="md:col-span-2">
            <ChartAreaInteractive />
          </div>
          <div className="space-y-4">
            <QuickActions />
            <RecentActivity stats={stats} loading={loading} />
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}