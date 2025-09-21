"use client"

import { useState, useEffect } from 'react'
import { AppSidebar } from "@/components/admin/app-sidebar"
import { SiteHeader } from "@/components/admin/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MoreHorizontal, Search, Plus, Calendar, Users, MapPin, Download } from "lucide-react"
import Link from "next/link"

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
  category?: string
  registrationFee?: number
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalEvents, setTotalEvents] = useState(0)
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    totalRegistrations: 0,
    revenue: 0
  })
  const pageSize = 10

  useEffect(() => {
    fetchEvents()
    fetchEventStats()
  }, [currentPage, statusFilter, categoryFilter])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
      })
      
      if (statusFilter !== 'All') params.append('status', statusFilter)
      if (categoryFilter !== 'All') params.append('category', categoryFilter)

      const response = await fetch(`/api/events/get?${params}`)
      if (response.ok) {
        const data = await response.json()
        setEvents(data.events)
        setTotalEvents(data.total)
        setTotalPages(data.pagination?.totalPages || 1)
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchEventStats = async () => {
    try {
      const response = await fetch('/api/events/get?limit=1')
      if (response.ok) {
        const data = await response.json()
        setStats({
          totalEvents: data.stats?.totalEvents || 0,
          activeEvents: data.stats?.activeEvents || 0,
          totalRegistrations: data.stats?.totalRegistrations || 0,
          revenue: 0 // Calculate from events data if needed
        })
      }
    } catch (error) {
      console.error('Error fetching event stats:', error)
      // Fallback to default stats if API fails
      setStats({
        totalEvents: 0,
        activeEvents: 0,
        totalRegistrations: 0,
        revenue: 0
      })
    }
  }

  const updateEventStatus = async (eventId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/events/update?id=${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      
      if (!response.ok) {
        throw new Error('Failed to update event status')
      }
      
      // Refresh the list
      await fetchEvents()
      await fetchEventStats()
    } catch (error) {
      console.error('Error updating event status:', error)
      alert('Failed to update event status. Please try again.')
    }
  }

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    const variants = {
      'Active': 'default',
      'Upcoming': 'secondary',
      'Completed': 'outline',
      'Cancelled': 'destructive',
      'Full': 'destructive'
    } as const
    return <Badge variant={variants[status as keyof typeof variants] || 'outline'}>{status}</Badge>
  }

  const getCapacityColor = (registrations: number, maxCapacity: number) => {
    const percentage = (registrations / maxCapacity) * 100
    if (percentage >= 90) return 'text-red-600'
    if (percentage >= 70) return 'text-yellow-600'
    return 'text-green-600'
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Event Management</h1>
              <p className="text-muted-foreground">
                Manage events, workshops, and competitions
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm" asChild>
                <Link href="/admin/events/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalEvents}</div>
                <p className="text-xs text-muted-foreground">All time events</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Events</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeEvents}</div>
                <p className="text-xs text-muted-foreground">Currently running</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalRegistrations}</div>
                <p className="text-xs text-muted-foreground">Across all events</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Attendance</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalEvents > 0 ? Math.round(stats.totalRegistrations / stats.totalEvents) : 0}
                </div>
                <p className="text-xs text-muted-foreground">Per event</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events by name, description, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Upcoming">Upcoming</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                <SelectItem value="Workshop">Workshop</SelectItem>
                <SelectItem value="Competition">Competition</SelectItem>
                <SelectItem value="Seminar">Seminar</SelectItem>
                <SelectItem value="Hackathon">Hackathon</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Events Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Date & Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registrations</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-16">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Loading events...
                    </TableCell>
                  </TableRow>
                ) : filteredEvents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No events found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{event.name}</div>
                          <div className="text-sm text-muted-foreground line-clamp-2">
                            {event.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">
                            {new Date(event.startDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(event.status)}</TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">{event.registrations}</div>
                      </TableCell>
                      <TableCell>
                        <div className={`text-sm font-medium ${getCapacityColor(event.registrations, event.maxCapacity)}`}>
                          {event.registrations}/{event.maxCapacity}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {Math.round((event.registrations / event.maxCapacity) * 100)}% full
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(event.startDate).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/events/${event.id}`}>View Details</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/events/${event.id}/edit`}>Edit Event</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/events/${event.id}/registrations`}>
                                View Registrations
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => updateEventStatus(event.id, event.status === 'Active' ? 'Cancelled' : 'Active')}
                            >
                              {event.status === 'Active' ? 'Cancel Event' : 'Activate Event'}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              Delete Event
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalEvents)} of {totalEvents} events
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}