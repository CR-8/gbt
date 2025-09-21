"use client"

import { useState, useEffect } from 'react'

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

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/stats')
      
      if (!response.ok) {
        throw new Error('Failed to fetch admin stats')
      }
      
      const data = await response.json()
      setStats(data.stats)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      // Fallback data for development
      setStats({
        totalUsers: 156,
        totalEvents: 12,
        activeEvents: 3,
        totalRegistrations: 89,
        newUsersThisMonth: 23,
        communityMessages: 45,
        pendingApprovals: 7,
        systemHealth: "excellent",
        totalAchievements: 34,
        activeUsers: 89,
        adminUsers: 8,
        totalStock: 245,
        stockValue: 15000,
        lowStockItems: 12,
        totalDocuments: 48,
        documentsThisMonth: 7,
        recentActivity: [
          {
            type: "user_registration",
            message: "New user registered: John Doe",
            time: "2 minutes ago",
            icon: "user"
          },
          {
            type: "event_created",
            message: "New event created: Tech Workshop",
            time: "15 minutes ago",
            icon: "calendar"
          },
          {
            type: "document_uploaded",
            message: "Document uploaded: Project Guidelines",
            time: "1 hour ago",
            icon: "file"
          }
        ]
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return { stats, loading, error, refetch: fetchStats }
}