"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/modules/layouts'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  Search,
  Filter,
  MoreHorizontal,
  Download,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Calendar,
  DollarSign,
  FileText,
  RefreshCw,
  AlertCircle,
  UserCheck,
  Send,
  Eye
} from "lucide-react"
import { toast } from "sonner"

interface Registration {
  id: string
  participantName: string
  email: string
  phone: string
  rollNumber?: string
  department: string
  year?: number
  eventId: string
  eventName: string
  registrationDate: string
  status: 'pending' | 'approved' | 'rejected' | 'attended' | 'cancelled'
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded'
  paymentAmount: number
  additionalInfo?: string
  specialRequests?: string
  attendanceMarked: boolean
}

interface Event {
  id: string
  name: string
  category: string
  startDate: string
  location: string
  capacity: number
  registrationCount: number
  requiresApproval: boolean
}

export default function EventRegistrationsPage() {
  const router = useRouter()
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEvent, setSelectedEvent] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [paymentFilter, setPaymentFilter] = useState('all')
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    fetchRegistrations()
    fetchEvents()
  }, [])

  const fetchRegistrations = async () => {
    try {
      setLoading(true)
      // Simulate API call - replace with actual API
      const mockRegistrations: Registration[] = [
        {
          id: '1',
          participantName: 'Rahul Sharma',
          email: 'rahul.sharma@example.com',
          phone: '+91-9876543210',
          rollNumber: 'CS2021001',
          department: 'Computer Science',
          year: 3,
          eventId: '1',
          eventName: 'Robotics Workshop 2024',
          registrationDate: '2024-01-15T10:30:00Z',
          status: 'approved',
          paymentStatus: 'completed',
          paymentAmount: 500,
          additionalInfo: 'Interested in advanced robotics',
          attendanceMarked: true
        },
        {
          id: '2',
          participantName: 'Priya Patel',
          email: 'priya.patel@example.com',
          phone: '+91-9876543211',
          rollNumber: 'IT2020045',
          department: 'Information Technology',
          year: 4,
          eventId: '1',
          eventName: 'Robotics Workshop 2024',
          registrationDate: '2024-01-16T14:20:00Z',
          status: 'pending',
          paymentStatus: 'completed',
          paymentAmount: 500,
          specialRequests: 'Vegetarian meals only',
          attendanceMarked: false
        },
        {
          id: '3',
          participantName: 'Amit Kumar',
          email: 'amit.kumar@example.com',
          phone: '+91-9876543212',
          rollNumber: 'EC2019023',
          department: 'Electronics',
          year: 4,
          eventId: '2',
          eventName: 'AI/ML Competition',
          registrationDate: '2024-01-18T09:15:00Z',
          status: 'approved',
          paymentStatus: 'completed',
          paymentAmount: 300,
          attendanceMarked: false
        },
        {
          id: '4',
          participantName: 'Sneha Jain',
          email: 'sneha.jain@example.com',
          phone: '+91-9876543213',
          department: 'Mechanical',
          year: 2,
          eventId: '3',
          eventName: 'IoT Hackathon',
          registrationDate: '2024-01-20T16:45:00Z',
          status: 'approved',
          paymentStatus: 'pending',
          paymentAmount: 0,
          attendanceMarked: false
        },
        {
          id: '5',
          participantName: 'Ravi Singh',
          email: 'ravi.singh@example.com',
          phone: '+91-9876543214',
          rollNumber: 'CS2022078',
          department: 'Computer Science',
          year: 2,
          eventId: '1',
          eventName: 'Robotics Workshop 2024',
          registrationDate: '2024-01-22T11:30:00Z',
          status: 'rejected',
          paymentStatus: 'refunded',
          paymentAmount: 500,
          additionalInfo: 'Does not meet prerequisites',
          attendanceMarked: false
        }
      ]
      
      setRegistrations(mockRegistrations)
    } catch (error) {
      console.error('Error fetching registrations:', error)
      toast.error('Failed to load registrations')
    } finally {
      setLoading(false)
    }
  }

  const fetchEvents = async () => {
    try {
      // Simulate API call - replace with actual API
      const mockEvents: Event[] = [
        {
          id: '1',
          name: 'Robotics Workshop 2024',
          category: 'Workshop',
          startDate: '2024-02-15T09:00:00Z',
          location: 'Main Auditorium',
          capacity: 150,
          registrationCount: 98,
          requiresApproval: true
        },
        {
          id: '2',
          name: 'AI/ML Competition',
          category: 'Competition',
          startDate: '2024-02-20T10:00:00Z',
          location: 'Computer Lab',
          capacity: 100,
          registrationCount: 75,
          requiresApproval: false
        },
        {
          id: '3',
          name: 'IoT Hackathon',
          category: 'Hackathon',
          startDate: '2024-02-25T09:00:00Z',
          location: 'Innovation Center',
          capacity: 80,
          registrationCount: 45,
          requiresApproval: false
        }
      ]
      
      setEvents(mockEvents)
    } catch (error) {
      console.error('Error fetching events:', error)
    }
  }

  const updateRegistrationStatus = async (registrationId: string, newStatus: Registration['status']) => {
    try {
      // Simulate API call
      setRegistrations(prev => 
        prev.map(reg => 
          reg.id === registrationId 
            ? { ...reg, status: newStatus }
            : reg
        )
      )
      toast.success(`Registration ${newStatus} successfully`)
    } catch (error) {
      console.error('Error updating registration status:', error)
      toast.error('Failed to update registration status')
    }
  }

  const markAttendance = async (registrationId: string, attended: boolean) => {
    try {
      // Simulate API call
      setRegistrations(prev => 
        prev.map(reg => 
          reg.id === registrationId 
            ? { 
                ...reg, 
                attendanceMarked: true,
                status: attended ? 'attended' : reg.status
              }
            : reg
        )
      )
      toast.success(`Attendance ${attended ? 'marked' : 'recorded'} successfully`)
    } catch (error) {
      console.error('Error marking attendance:', error)
      toast.error('Failed to mark attendance')
    }
  }

  const sendNotification = async (registrationId: string, type: 'email' | 'sms') => {
    try {
      // Simulate API call
      toast.success(`${type.toUpperCase()} notification sent successfully`)
    } catch (error) {
      console.error('Error sending notification:', error)
      toast.error('Failed to send notification')
    }
  }

  const exportRegistrations = () => {
    // Simulate export functionality
    toast.success('Registrations exported successfully')
  }

  const filteredRegistrations = registrations.filter(registration => {
    const matchesSearch = registration.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         registration.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         registration.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         registration.eventName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesEvent = selectedEvent === 'all' || registration.eventId === selectedEvent
    const matchesStatus = statusFilter === 'all' || registration.status === statusFilter
    const matchesPayment = paymentFilter === 'all' || registration.paymentStatus === paymentFilter
    
    return matchesSearch && matchesEvent && matchesStatus && matchesPayment
  })

  const getStatusBadge = (status: Registration['status']) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      attended: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-gray-100 text-gray-800'
    }
    
    const icons = {
      pending: <Clock className="h-3 w-3" />,
      approved: <CheckCircle className="h-3 w-3" />,
      rejected: <XCircle className="h-3 w-3" />,
      attended: <UserCheck className="h-3 w-3" />,
      cancelled: <XCircle className="h-3 w-3" />
    }
    
    return (
      <Badge className={variants[status]}>
        {icons[status]}
        <span className="ml-1 capitalize">{status}</span>
      </Badge>
    )
  }

  const getPaymentBadge = (status: Registration['paymentStatus']) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    }
    
    return (
      <Badge className={variants[status]}>
        <span className="capitalize">{status}</span>
      </Badge>
    )
  }

  const stats = {
    total: registrations.length,
    pending: registrations.filter(r => r.status === 'pending').length,
    approved: registrations.filter(r => r.status === 'approved').length,
    attended: registrations.filter(r => r.status === 'attended').length,
    totalRevenue: registrations
      .filter(r => r.paymentStatus === 'completed')
      .reduce((sum, r) => sum + r.paymentAmount, 0)
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-lg">Loading registrations...</div>
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Event Registrations</h1>
                <p className="text-muted-foreground">
                  Manage event registrations, approvals, and attendance
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={exportRegistrations}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" onClick={fetchRegistrations}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-5">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Approved</p>
                    <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Attended</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.attended}</p>
                  </div>
                  <UserCheck className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="text-2xl font-bold text-green-600">₹{stats.totalRevenue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[250px]">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, roll number, or event..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="All Events" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    {events.map(event => (
                      <SelectItem key={event.id} value={event.id}>{event.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="attended">Attended</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Payment Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Payments</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Registrations Table */}
          <Card>
            <CardHeader>
              <CardTitle>Registrations ({filteredRegistrations.length})</CardTitle>
              <CardDescription>Manage event registrations and participant information</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredRegistrations.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium">No registrations found</p>
                  <p className="text-muted-foreground">
                    {searchTerm || selectedEvent !== 'all' || statusFilter !== 'all' || paymentFilter !== 'all'
                      ? 'Try adjusting your filters'
                      : 'No event registrations available'
                    }
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Participant</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>Registration Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Attendance</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRegistrations.map((registration) => (
                      <TableRow key={registration.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{registration.participantName}</p>
                            <p className="text-sm text-muted-foreground">{registration.email}</p>
                            {registration.rollNumber && (
                              <p className="text-xs text-muted-foreground">{registration.rollNumber}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{registration.eventName}</p>
                            <p className="text-sm text-muted-foreground">{registration.department}</p>
                            {registration.year && (
                              <p className="text-xs text-muted-foreground">Year {registration.year}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {new Date(registration.registrationDate).toLocaleDateString()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(registration.status)}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {getPaymentBadge(registration.paymentStatus)}
                            {registration.paymentAmount > 0 && (
                              <p className="text-xs text-muted-foreground">
                                ₹{registration.paymentAmount}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {registration.attendanceMarked ? (
                            <Badge className="bg-blue-100 text-blue-800">
                              <UserCheck className="h-3 w-3 mr-1" />
                              {registration.status === 'attended' ? 'Present' : 'Marked'}
                            </Badge>
                          ) : (
                            <Badge variant="outline">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => {
                                setSelectedRegistration(registration)
                                setDialogOpen(true)
                              }}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              
                              {registration.status === 'pending' && (
                                <>
                                  <DropdownMenuItem onClick={() => updateRegistrationStatus(registration.id, 'approved')}>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => updateRegistrationStatus(registration.id, 'rejected')}>
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Reject
                                  </DropdownMenuItem>
                                </>
                              )}
                              
                              {!registration.attendanceMarked && registration.status === 'approved' && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => markAttendance(registration.id, true)}>
                                    <UserCheck className="h-4 w-4 mr-2" />
                                    Mark Present
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => markAttendance(registration.id, false)}>
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Mark Absent
                                  </DropdownMenuItem>
                                </>
                              )}
                              
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => sendNotification(registration.id, 'email')}>
                                <Mail className="h-4 w-4 mr-2" />
                                Send Email
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => sendNotification(registration.id, 'sms')}>
                                <Phone className="h-4 w-4 mr-2" />
                                Send SMS
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Registration Details Dialog */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Registration Details</DialogTitle>
                <DialogDescription>
                  Complete information about the registration
                </DialogDescription>
              </DialogHeader>
              
              {selectedRegistration && (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-medium mb-2">Participant Information</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Name:</strong> {selectedRegistration.participantName}</p>
                        <p><strong>Email:</strong> {selectedRegistration.email}</p>
                        <p><strong>Phone:</strong> {selectedRegistration.phone}</p>
                        {selectedRegistration.rollNumber && (
                          <p><strong>Roll Number:</strong> {selectedRegistration.rollNumber}</p>
                        )}
                        <p><strong>Department:</strong> {selectedRegistration.department}</p>
                        {selectedRegistration.year && (
                          <p><strong>Year:</strong> {selectedRegistration.year}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Event & Registration</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Event:</strong> {selectedRegistration.eventName}</p>
                        <p><strong>Registration Date:</strong> {new Date(selectedRegistration.registrationDate).toLocaleString()}</p>
                        <p><strong>Status:</strong> {getStatusBadge(selectedRegistration.status)}</p>
                        <p><strong>Payment:</strong> {getPaymentBadge(selectedRegistration.paymentStatus)}</p>
                        {selectedRegistration.paymentAmount > 0 && (
                          <p><strong>Amount:</strong> ₹{selectedRegistration.paymentAmount}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {(selectedRegistration.additionalInfo || selectedRegistration.specialRequests) && (
                    <div>
                      <h4 className="font-medium mb-2">Additional Information</h4>
                      {selectedRegistration.additionalInfo && (
                        <div className="mb-2">
                          <p className="text-sm font-medium">Additional Info:</p>
                          <p className="text-sm text-muted-foreground">{selectedRegistration.additionalInfo}</p>
                        </div>
                      )}
                      {selectedRegistration.specialRequests && (
                        <div>
                          <p className="text-sm font-medium">Special Requests:</p>
                          <p className="text-sm text-muted-foreground">{selectedRegistration.specialRequests}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Close
                </Button>
                {selectedRegistration && (
                  <div className="flex gap-2">
                    <Button onClick={() => sendNotification(selectedRegistration.id, 'email')}>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </Button>
                  </div>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
    </AdminLayout>
  )
}