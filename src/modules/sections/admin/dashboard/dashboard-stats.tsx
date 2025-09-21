"use client"

import { useState, useEffect } from 'react'
import { StatsCard } from '@/components/common'
import { ChartAreaInteractive } from "@/components/admin/chart-area-interactive"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Package,
  FileText,
  Trophy,
  AlertTriangle,
  CheckCircle
} from "lucide-react"

interface AdminStats {
  totalUsers: number
  totalEvents: number
  activeEvents: number
  totalRegistrations: number
  newUsersThisMonth: number
  communityMessages: number
  pendingApprovals: number
  systemHealth: string
  totalAchievements: number
  activeUsers: number
  adminUsers: number
  totalStock: number
  stockValue: number
  lowStockItems: number
  totalDocuments: number
  documentsThisMonth: number
  recentActivity: Array<{
    type: string
    message: string
    time: string
    icon: string
  }>
}

interface DashboardStatsProps {
  stats: AdminStats | null
  loading: boolean
}

export function DashboardStats({ stats, loading }: DashboardStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 border rounded-lg">
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Users"
        value={stats?.totalUsers || 0}
        description="Registered users"
        icon={Users}
        trend={{ value: 12, isPositive: true }}
      />
      <StatsCard
        title="Active Events"
        value={stats?.activeEvents || 0}
        description="Currently running"
        icon={Calendar}
        trend={{ value: 8, isPositive: true }}
      />
      <StatsCard
        title="Stock Items"
        value={stats?.totalStock || 0}
        description={`${stats?.lowStockItems || 0} low stock`}
        icon={Package}
        trend={{ value: -2, isPositive: false }}
      />
      <StatsCard
        title="Documents"
        value={stats?.totalDocuments || 0}
        description={`${stats?.documentsThisMonth || 0} this month`}
        icon={FileText}
        trend={{ value: 15, isPositive: true }}
      />
    </div>
  )
}