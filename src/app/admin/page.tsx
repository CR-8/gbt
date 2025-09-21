"use client"

import { AppSidebar } from "@/components/admin/app-sidebar"
import { SiteHeader } from "@/components/admin/site-header"
import { SectionCards } from "@/components/admin/section-cards"
import { ChartAreaInteractive } from "@/components/admin/chart-area-interactive"
import { DataTable } from "@/components/admin/data-table"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
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

interface User {
  id: string
  name: string
  email: string
  phone: string
  institution: string
  year: string
  registrationDate: string
  status: string
  role: string
  eventsRegistered: number
  avatar: string
}

interface Event {
  id: number
  name: string
  description: string
  startDate: string
  endDate: string
  location: string
  status: string
  registrations: number
  maxCapacity: number
  poster: string
}

// Transform user data for data table
const transformUserDataForTable = (users: User[]) => {
  return users.slice(0, 5).map((user, index) => ({
    id: index + 1,
    header: user.name,
    type: user.role,
    status: user.status,
    target: user.eventsRegistered.toString(),
    limit: "10",
    reviewer: user.institution,
  }))
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch admin stats
        const statsResponse = await fetch('/api/admin/stats')
        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setStats(statsData.stats)
        }

        // Fetch users
        const usersResponse = await fetch('/api/users/get?limit=10')
        if (usersResponse.ok) {
          const usersData = await usersResponse.json()
          setUsers(usersData.users)
        }

        // Fetch events
        const eventsResponse = await fetch('/api/events/get?limit=5')
        if (eventsResponse.ok) {
          const eventsData = await eventsResponse.json()
          setEvents(eventsData.events)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const tableData = users.length > 0 ? transformUserDataForTable(users) : []

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-lg">Loading dashboard data...</div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-lg font-semibold">Total Users</h3>
                <p className="text-2xl font-bold">{stats?.totalUsers || 0}</p>
              </div>
            </div>
            <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-lg font-semibold">Total Events</h3>
                <p className="text-2xl font-bold">{stats?.totalEvents || 0}</p>
              </div>
            </div>
            <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-lg font-semibold">Active Events</h3>
                <p className="text-2xl font-bold">{stats?.activeEvents || 0}</p>
              </div>
            </div>
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
            <div className="flex flex-col gap-6 p-6">
              <SectionCards />
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="md:col-span-2">
                  <ChartAreaInteractive />
                </div>
                <div className="md:col-span-1">
                  <div className="rounded-lg border bg-card p-4">
                    <h3 className="text-lg font-semibold">Quick Actions</h3>
                    <div className="mt-4 space-y-2">
                      <button className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
                        Add New User
                      </button>
                      <button className="w-full rounded-md bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary/90">
                        Create Event
                      </button>
                      <button className="w-full rounded-md bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary/90">
                        Export Data
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-lg border bg-card">
                  <div className="p-6">
                    <h2 className="text-2xl font-bold">Recent Users</h2>
                    <p className="text-muted-foreground">
                      Latest registered users in the system
                    </p>
                  </div>
                  {tableData.length > 0 && <DataTable data={tableData} />}
                </div>
                <div className="rounded-lg border bg-card p-6">
                  <h2 className="text-2xl font-bold">Recent Activity</h2>
                  <p className="text-muted-foreground mb-4">
                    Latest activities on the platform
                  </p>
                  <div className="space-y-3">
                    {stats?.recentActivity.slice(0, 5).map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.message}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    )) || (
                      <p className="text-muted-foreground">No recent activity</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
