"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AdminLayout } from '@/modules/layouts'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Award, Users } from "lucide-react"

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
  bio?: string
  skills?: string[]
  socialLinks?: {
    linkedin?: string
    github?: string
    twitter?: string
  }
}

interface EventRegistration {
  id: string
  eventName: string
  eventDate: string
  registrationDate: string
  status: string
  paymentStatus?: string
}

export default function UserDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string
  
  const [user, setUser] = useState<User | null>(null)
  const [eventRegistrations, setEventRegistrations] = useState<EventRegistration[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userId) {
      fetchUserDetails()
      fetchUserEventRegistrations()
    }
  }, [userId])

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`/api/users/get?id=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error('Error fetching user details:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserEventRegistrations = async () => {
    try {
      // Mock data for now - replace with actual API call
      setEventRegistrations([
        {
          id: '1',
          eventName: 'Robotics Workshop 2024',
          eventDate: '2024-03-15',
          registrationDate: '2024-02-10',
          status: 'Confirmed',
          paymentStatus: 'Paid'
        },
        {
          id: '2',
          eventName: 'BattleBots Competition',
          eventDate: '2024-04-20',
          registrationDate: '2024-03-25',
          status: 'Pending',
          paymentStatus: 'Pending'
        }
      ])
    } catch (error) {
      console.error('Error fetching event registrations:', error)
    }
  }

  const updateUserStatus = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      
      if (response.ok) {
        setUser(prev => prev ? { ...prev, status: newStatus } : null)
      }
    } catch (error) {
      console.error('Error updating user status:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    const variant = status === 'Active' ? 'default' : 'secondary'
    return <Badge variant={variant}>{status}</Badge>
  }

  const getRoleBadge = (role: string) => {
    const variant = role === 'Admin' ? 'destructive' : 'outline'
    return <Badge variant={variant}>{role}</Badge>
  }

  const getEventStatusBadge = (status: string) => {
    const variants = {
      'Confirmed': 'default',
      'Pending': 'secondary',
      'Cancelled': 'destructive'
    } as const
    return <Badge variant={variants[status as keyof typeof variants] || 'outline'}>{status}</Badge>
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-lg">Loading user details...</div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!user) {
    return (
      <AdminLayout>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-lg text-muted-foreground">User not found</div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold">User Details</h1>
                <p className="text-muted-foreground">Manage user information and permissions</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => updateUserStatus(user.status === 'Active' ? 'Suspended' : 'Active')}
              >
                {user.status === 'Active' ? 'Suspend User' : 'Activate User'}
              </Button>
              <Button variant="destructive" size="sm">
                Delete User
              </Button>
            </div>
          </div>

          {/* User Profile Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-lg">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <CardTitle className="text-2xl">{user.name}</CardTitle>
                  <CardDescription className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {user.email}
                    </span>
                    {user.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {user.phone}
                      </span>
                    )}
                  </CardDescription>
                  <div className="flex gap-2">
                    {getStatusBadge(user.status)}
                    {getRoleBadge(user.role)}
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="events">Event Registrations</TabsTrigger>
              <TabsTrigger value="activity">Activity Log</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Events Registered</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{user.eventsRegistered}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Member Since</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {new Date(user.registrationDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Institution</CardTitle>
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm font-medium">{user.institution}</div>
                    <div className="text-xs text-muted-foreground">Year {user.year}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Account Status</CardTitle>
                    <Award className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{user.status}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Additional Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>User details and contact information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium">Full Name</label>
                      <p className="text-sm text-muted-foreground mt-1">{user.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email Address</label>
                      <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Phone Number</label>
                      <p className="text-sm text-muted-foreground mt-1">{user.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Institution</label>
                      <p className="text-sm text-muted-foreground mt-1">{user.institution}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Academic Year</label>
                      <p className="text-sm text-muted-foreground mt-1">Year {user.year}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Registration Date</label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(user.registrationDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="events" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Event Registrations</CardTitle>
                  <CardDescription>All events this user has registered for</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Event Name</TableHead>
                        <TableHead>Event Date</TableHead>
                        <TableHead>Registration Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {eventRegistrations.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            No event registrations found
                          </TableCell>
                        </TableRow>
                      ) : (
                        eventRegistrations.map((registration) => (
                          <TableRow key={registration.id}>
                            <TableCell className="font-medium">{registration.eventName}</TableCell>
                            <TableCell>{new Date(registration.eventDate).toLocaleDateString()}</TableCell>
                            <TableCell>{new Date(registration.registrationDate).toLocaleDateString()}</TableCell>
                            <TableCell>{getEventStatusBadge(registration.status)}</TableCell>
                            <TableCell>
                              <Badge variant={registration.paymentStatus === 'Paid' ? 'default' : 'secondary'}>
                                {registration.paymentStatus}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Log</CardTitle>
                  <CardDescription>Recent user activities and system interactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Registered for BattleBots Competition</p>
                        <p className="text-xs text-muted-foreground">2 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Completed Robotics Workshop 2024</p>
                        <p className="text-xs text-muted-foreground">1 week ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Profile updated</p>
                        <p className="text-xs text-muted-foreground">2 weeks ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
    </AdminLayout>
  )
}