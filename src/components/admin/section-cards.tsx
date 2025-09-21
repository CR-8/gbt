"use client"

import { IconTrendingUp } from "@tabler/icons-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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
}

export function SectionCards() {
  const router = useRouter()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data.stats)
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
        // Set mock data for demonstration
        setStats({
          totalUsers: 150,
          totalEvents: 25,
          activeEvents: 5,
          totalRegistrations: 320,
          newUsersThisMonth: 23,
          communityMessages: 0,
          pendingApprovals: 3,
          systemHealth: 'Good',
          totalAchievements: 18,
          activeUsers: 142,
          adminUsers: 8,
          totalStock: 245,
          stockValue: 1250000,
          lowStockItems: 12,
          totalDocuments: 48,
          documentsThisMonth: 7
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="@container/card cursor-pointer">
            <CardHeader>
              <CardDescription>Loading...</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                --
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-5">
      <Card className="@container/card cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/admin/stock')}>
        <CardHeader>
          <CardDescription>Stock Management</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats?.totalStock || 0}
          </CardTitle>
          <CardAction>
            <Badge variant={stats?.lowStockItems && stats.lowStockItems > 0 ? "destructive" : "outline"}>
              {stats?.lowStockItems || 0} low stock
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Value: ₹{stats?.stockValue?.toLocaleString() || 0} <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Robot inventory and components
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/admin/team')}>
        <CardHeader>
          <CardDescription>Team Management</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats?.totalUsers || 0}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +{stats?.newUsersThisMonth || 0} this month
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Active members: {stats?.activeUsers || 0} <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Club members and roles
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/admin/events')}>
        <CardHeader>
          <CardDescription>Event Management</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats?.totalEvents || 0}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              {stats?.activeEvents || 0} active
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Registrations: {stats?.totalRegistrations || 0} <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Events and workshops
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/admin/documents')}>
        <CardHeader>
          <CardDescription>Document Management</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats?.totalDocuments || 0}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +{stats?.documentsThisMonth || 0} this month
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Official documents <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Forms and file resources
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/admin/blogs')}>
        <CardHeader>
          <CardDescription>Blog Management</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats?.totalAchievements || 0}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              Active
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Published posts <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Content and articles</div>
        </CardFooter>
      </Card>
    </div>
  )
}
