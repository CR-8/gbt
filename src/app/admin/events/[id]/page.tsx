"use client"

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { AppSidebar } from "@/components/admin/app-sidebar"
import { SiteHeader } from "@/components/admin/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft, 
  Save, 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign, 
  Trash2,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react"

interface EventFormData {
  title: string
  description: string
  shortDescription: string
  startDate: string
  endDate: string
  location: string
  category: string
  capacity: number
  registrationFee: number
  prerequisites: string
  poster: string
  isVisible: boolean
  featured: boolean
  registrationDeadline: string
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
}

interface Registration {
  _id: string
  user: {
    name: string
    email: string
    rollNumber: string
  }
  registrationDate: string
  status: 'confirmed' | 'pending' | 'cancelled'
  paymentStatus: 'paid' | 'pending' | 'refunded'
}

export default function EditEventPage() {
  const router = useRouter()
  const params = useParams()
  const eventId = params?.id as string

  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    shortDescription: '',
    startDate: '',
    endDate: '',
    location: '',
    category: 'Workshop',
    capacity: 50,
    registrationFee: 0,
    prerequisites: '',
    poster: '',
    isVisible: true,
    featured: false,
    registrationDeadline: '',
    status: 'upcoming'
  })
  
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [eventStats, setEventStats] = useState({
    totalRegistrations: 0,
    confirmedRegistrations: 0,
    pendingRegistrations: 0,
    cancelledRegistrations: 0,
    totalRevenue: 0
  })

  useEffect(() => {
    if (eventId) {
      fetchEventData()
      fetchRegistrations()
    }
  }, [eventId])

  const fetchEventData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/events/get?id=${eventId}`)
      if (response.ok) {
        const data = await response.json()
        const event = data.event
        setFormData({
          title: event.name,
          description: event.description,
          shortDescription: event.description.substring(0, 200),
          startDate: event.startDate.split('T')[0],
          endDate: event.endDate.split('T')[0],
          location: event.location,
          category: event.category || 'Workshop',
          capacity: event.maxCapacity,
          registrationFee: event.registrationFee || 0,
          prerequisites: event.prerequisites || '',
          poster: event.poster,
          isVisible: event.isVisible !== false,
          featured: event.featured || false,
          registrationDeadline: event.registrationDeadline ? event.registrationDeadline.split('T')[0] : '',
          status: event.status || 'upcoming'
        })
      }
    } catch (error) {
      console.error('Error fetching event data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRegistrations = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}/registrations`)
      if (response.ok) {
        const data = await response.json()
        setRegistrations(data.registrations || [])
        
        // Calculate stats
        const regs = data.registrations || []
        const confirmed = regs.filter((r: Registration) => r.status === 'confirmed').length
        const pending = regs.filter((r: Registration) => r.status === 'pending').length
        const cancelled = regs.filter((r: Registration) => r.status === 'cancelled').length
        const revenue = regs
          .filter((r: Registration) => r.paymentStatus === 'paid')
          .length * formData.registrationFee

        setEventStats({
          totalRegistrations: regs.length,
          confirmedRegistrations: confirmed,
          pendingRegistrations: pending,
          cancelledRegistrations: cancelled,
          totalRevenue: revenue
        })
      }
    } catch (error) {
      console.error('Error fetching registrations:', error)
    }
  }

  const handleInputChange = (field: keyof EventFormData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      
      const apiData = {
        title: formData.title,
        description: formData.description,
        shortDescription: formData.shortDescription,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        location: formData.location,
        category: formData.category,
        capacity: formData.capacity,
        registrationFee: formData.registrationFee,
        prerequisites: formData.prerequisites,
        poster: formData.poster,
        isVisible: formData.isVisible,
        featured: formData.featured,
        registrationDeadline: formData.registrationDeadline ? new Date(formData.registrationDeadline).toISOString() : undefined,
        status: formData.status
      }

      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(apiData)
      })

      if (response.ok) {
        router.push('/admin/events')
      } else {
        console.error('Error updating event')
      }
    } catch (error) {
      console.error('Error updating event:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteEvent = async () => {
    if (confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/events/${eventId}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          router.push('/admin/events')
        }
      } catch (error) {
        console.error('Error deleting event:', error)
      }
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-500" />
      default: return null
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      'confirmed': 'default',
      'pending': 'secondary',
      'cancelled': 'destructive'
    }
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>
  }

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-lg">Loading event data...</div>
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
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Edit Event</h1>
                <p className="text-muted-foreground">
                  Update event details, manage registrations, and track performance
                </p>
              </div>
            </div>
            <Button variant="destructive" onClick={handleDeleteEvent}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Event
            </Button>
          </div>

          <Tabs defaultValue="details" className="space-y-6">
            <TabsList>
              <TabsTrigger value="details">Event Details</TabsTrigger>
              <TabsTrigger value="registrations">
                Registrations ({eventStats.totalRegistrations})
              </TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-3">
                  {/* Main Content */}
                  <div className="lg:col-span-2 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                        <CardDescription>Essential event details and description</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="title">Event Title *</Label>
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            placeholder="Enter event title"
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="shortDescription">Short Description *</Label>
                          <Input
                            id="shortDescription"
                            value={formData.shortDescription}
                            onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                            placeholder="Brief description for listings (max 200 characters)"
                            maxLength={200}
                            required
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            {formData.shortDescription.length}/200 characters
                          </p>
                        </div>

                        <div>
                          <Label htmlFor="description">Full Description *</Label>
                          <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Detailed event description, agenda, and information"
                            rows={6}
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="prerequisites">Prerequisites</Label>
                          <Textarea
                            id="prerequisites"
                            value={formData.prerequisites}
                            onChange={(e) => handleInputChange('prerequisites', e.target.value)}
                            placeholder="Any requirements or prerequisites for participants"
                            rows={3}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Event Schedule & Location</CardTitle>
                        <CardDescription>Date, time, and venue information</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <Label htmlFor="startDate">Start Date *</Label>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="startDate"
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => handleInputChange('startDate', e.target.value)}
                                className="pl-10"
                                required
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="endDate">End Date *</Label>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="endDate"
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => handleInputChange('endDate', e.target.value)}
                                className="pl-10"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="registrationDeadline">Registration Deadline</Label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="registrationDeadline"
                              type="date"
                              value={formData.registrationDeadline}
                              onChange={(e) => handleInputChange('registrationDeadline', e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="location">Location *</Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="location"
                              value={formData.location}
                              onChange={(e) => handleInputChange('location', e.target.value)}
                              placeholder="Event venue or location"
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Event Settings</CardTitle>
                        <CardDescription>Configuration and visibility options</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="status">Event Status</Label>
                          <Select value={formData.status} onValueChange={(value: string) => handleInputChange('status', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="upcoming">Upcoming</SelectItem>
                              <SelectItem value="ongoing">Ongoing</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="category">Category *</Label>
                          <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Workshop">Workshop</SelectItem>
                              <SelectItem value="Competition">Competition</SelectItem>
                              <SelectItem value="Seminar">Seminar</SelectItem>
                              <SelectItem value="Hackathon">Hackathon</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="capacity">Max Capacity *</Label>
                          <div className="relative">
                            <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="capacity"
                              type="number"
                              value={formData.capacity}
                              onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 0)}
                              placeholder="Maximum participants"
                              className="pl-10"
                              min="1"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="registrationFee">Registration Fee</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="registrationFee"
                              type="number"
                              value={formData.registrationFee}
                              onChange={(e) => handleInputChange('registrationFee', parseInt(e.target.value) || 0)}
                              placeholder="0 for free events"
                              className="pl-10"
                              min="0"
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="isVisible">Visible to Public</Label>
                            <Switch
                              id="isVisible"
                              checked={formData.isVisible}
                              onCheckedChange={(checked) => handleInputChange('isVisible', checked)}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <Label htmlFor="featured">Featured Event</Label>
                            <Switch
                              id="featured"
                              checked={formData.featured}
                              onCheckedChange={(checked) => handleInputChange('featured', checked)}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="space-y-2">
                      <Button type="submit" className="w-full" disabled={saving}>
                        <Save className="h-4 w-4 mr-2" />
                        {saving ? 'Updating...' : 'Update Event'}
                      </Button>
                      <Button type="button" variant="outline" className="w-full" onClick={() => router.back()}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="registrations" className="space-y-6">
              {/* Registration Stats */}
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="text-2xl font-bold">{eventStats.totalRegistrations}</p>
                      </div>
                      <Users className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Confirmed</p>
                        <p className="text-2xl font-bold text-green-600">{eventStats.confirmedRegistrations}</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Pending</p>
                        <p className="text-2xl font-bold text-yellow-600">{eventStats.pendingRegistrations}</p>
                      </div>
                      <Clock className="h-8 w-8 text-yellow-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Revenue</p>
                        <p className="text-2xl font-bold text-blue-600">₹{eventStats.totalRevenue}</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Registrations List */}
              <Card>
                <CardHeader>
                  <CardTitle>Registrations</CardTitle>
                  <CardDescription>Manage event registrations and participant details</CardDescription>
                </CardHeader>
                <CardContent>
                  {registrations.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-lg font-medium">No registrations yet</p>
                      <p className="text-muted-foreground">Registrations will appear here once participants sign up</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {registrations.map((registration) => (
                        <div key={registration._id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="font-medium">{registration.user.name}</p>
                              <p className="text-sm text-muted-foreground">{registration.user.email}</p>
                              <p className="text-sm text-muted-foreground">Roll: {registration.user.rollNumber}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">
                                Registered: {new Date(registration.registrationDate).toLocaleDateString()}
                              </p>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(registration.status)}
                                {getStatusBadge(registration.status)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Event Analytics</CardTitle>
                  <CardDescription>Performance metrics and insights for this event</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Analytics dashboard coming soon...</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}