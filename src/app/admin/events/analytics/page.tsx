"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/modules/layouts'
import { Button } from "@/components/ui/button"
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
  ArrowLeft,
  Calendar,
  Users,
  TrendingUp,
  TrendingDown,
  Eye,
  UserCheck,
  MapPin,
  DollarSign,
  Star,
  Activity,
  PieChart,
  BarChart3,
  Download,
  RefreshCw,
  Clock,
  Award,
  Zap
} from "lucide-react"
import { toast } from "sonner"

interface EventAnalytics {
  overview: {
    totalEvents: number
    activeEvents: number
    completedEvents: number
    totalRegistrations: number
    totalRevenue: number
    averageAttendance: number
    upcomingEvents: number
  }
  performance: {
    topEvents: Array<{
      id: string
      name: string
      category: string
      registrations: number
      capacity: number
      fillRate: number
      revenue: number
      rating: number
    }>
    categoryPerformance: Array<{
      category: string
      eventCount: number
      totalRegistrations: number
      averageRating: number
      revenue: number
    }>
  }
  trends: {
    monthlyData: Array<{
      month: string
      events: number
      registrations: number
      revenue: number
      attendance: number
    }>
    registrationTrends: Array<{
      eventId: string
      eventName: string
      registrationsOverTime: Array<{ date: string; count: number }>
    }>
  }
  demographics: {
    registrationsByDepartment: Array<{ department: string; count: number }>
    registrationsByYear: Array<{ year: number; count: number }>
    registrationsByLocation: Array<{ location: string; count: number }>
  }
  engagement: {
    averageRegistrationTime: number
    completionRate: number
    feedbackScore: number
    repeatParticipants: number
    socialShares: number
    emailOpenRate: number
  }
}

export default function EventAnalyticsPage() {
  const router = useRouter()
  const [analytics, setAnalytics] = useState<EventAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('3months')
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      // Simulate API call - replace with actual API
      const mockAnalytics: EventAnalytics = {
        overview: {
          totalEvents: 24,
          activeEvents: 6,
          completedEvents: 18,
          totalRegistrations: 1240,
          totalRevenue: 45600,
          averageAttendance: 82.5,
          upcomingEvents: 4
        },
        performance: {
          topEvents: [
            {
              id: '1',
              name: 'Robotics Workshop 2024',
              category: 'Workshop',
              registrations: 150,
              capacity: 150,
              fillRate: 100,
              revenue: 7500,
              rating: 4.8
            },
            {
              id: '2',
              name: 'AI/ML Competition',
              category: 'Competition',
              registrations: 98,
              capacity: 100,
              fillRate: 98,
              revenue: 4900,
              rating: 4.7
            },
            {
              id: '3',
              name: 'IoT Hackathon',
              category: 'Hackathon',
              registrations: 75,
              capacity: 80,
              fillRate: 93.8,
              revenue: 0,
              rating: 4.6
            },
            {
              id: '4',
              name: 'Industry Seminar',
              category: 'Seminar',
              registrations: 200,
              capacity: 250,
              fillRate: 80,
              revenue: 6000,
              rating: 4.5
            }
          ],
          categoryPerformance: [
            { category: 'Workshop', eventCount: 8, totalRegistrations: 450, averageRating: 4.6, revenue: 22500 },
            { category: 'Competition', eventCount: 6, totalRegistrations: 320, averageRating: 4.7, revenue: 16000 },
            { category: 'Seminar', eventCount: 5, totalRegistrations: 280, averageRating: 4.3, revenue: 8400 },
            { category: 'Hackathon', eventCount: 3, totalRegistrations: 150, averageRating: 4.8, revenue: 0 },
            { category: 'Other', eventCount: 2, totalRegistrations: 40, averageRating: 4.2, revenue: 800 }
          ]
        },
        trends: {
          monthlyData: [
            { month: 'Jan', events: 2, registrations: 120, revenue: 3600, attendance: 85 },
            { month: 'Feb', events: 3, registrations: 180, revenue: 5400, attendance: 82 },
            { month: 'Mar', events: 4, registrations: 240, revenue: 7200, attendance: 88 },
            { month: 'Apr', events: 3, registrations: 200, revenue: 6000, attendance: 90 },
            { month: 'May', events: 5, registrations: 300, revenue: 9000, attendance: 78 },
            { month: 'Jun', events: 4, registrations: 200, revenue: 6000, attendance: 85 }
          ],
          registrationTrends: [
            {
              eventId: '1',
              eventName: 'Robotics Workshop 2024',
              registrationsOverTime: [
                { date: '2024-01-01', count: 10 },
                { date: '2024-01-02', count: 25 },
                { date: '2024-01-03', count: 45 },
                { date: '2024-01-04', count: 75 },
                { date: '2024-01-05', count: 120 },
                { date: '2024-01-06', count: 150 }
              ]
            }
          ]
        },
        demographics: {
          registrationsByDepartment: [
            { department: 'Computer Science', count: 450 },
            { department: 'Information Technology', count: 320 },
            { department: 'Electronics', count: 180 },
            { department: 'Mechanical', count: 120 },
            { department: 'Other', count: 170 }
          ],
          registrationsByYear: [
            { year: 1, count: 200 },
            { year: 2, count: 350 },
            { year: 3, count: 400 },
            { year: 4, count: 290 }
          ],
          registrationsByLocation: [
            { location: 'Main Auditorium', count: 520 },
            { location: 'Computer Lab', count: 380 },
            { location: 'Seminar Hall', count: 240 },
            { location: 'Online', count: 100 }
          ]
        },
        engagement: {
          averageRegistrationTime: 2.3,
          completionRate: 87.5,
          feedbackScore: 4.5,
          repeatParticipants: 35,
          socialShares: 156,
          emailOpenRate: 68.2
        }
      }
      
      setAnalytics(mockAnalytics)
    } catch (error) {
      console.error('Error fetching analytics:', error)
      toast.error('Failed to load event analytics')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchAnalytics()
    setRefreshing(false)
    toast.success('Analytics data refreshed')
  }

  const exportReport = () => {
    // Simulate export functionality
    toast.success('Event analytics report exported successfully')
  }

  const getPerformanceColor = (value: number, threshold: number = 80) => {
    if (value >= threshold) return 'text-green-600'
    if (value >= threshold * 0.7) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getTrendIcon = (current: number, previous: number) => {
    return current > previous ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    )
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-lg">Loading event analytics...</div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!analytics) {
    return (
      <AdminLayout>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-lg">Failed to load event analytics</div>
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
                <h1 className="text-2xl font-bold">Event Analytics</h1>
                <p className="text-muted-foreground">
                  Comprehensive insights into event performance and engagement
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">Last Month</SelectItem>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="1year">Last Year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={exportReport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Overview Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Events</p>
                    <p className="text-2xl font-bold">{analytics.overview.totalEvents}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs text-green-600">
                        {analytics.overview.activeEvents} active
                      </span>
                    </div>
                  </div>
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Registrations</p>
                    <p className="text-2xl font-bold text-blue-600">{analytics.overview.totalRegistrations.toLocaleString()}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-muted-foreground">
                        {analytics.overview.averageAttendance}% avg attendance
                      </span>
                    </div>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-600">₹{analytics.overview.totalRevenue.toLocaleString()}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <DollarSign className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-muted-foreground">
                        ₹{Math.round(analytics.overview.totalRevenue / analytics.overview.totalEvents)} avg per event
                      </span>
                    </div>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Engagement Score</p>
                    <p className="text-2xl font-bold text-purple-600">{analytics.engagement.feedbackScore}/5.0</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span className="text-xs text-muted-foreground">
                        {analytics.engagement.completionRate}% completion rate
                      </span>
                    </div>
                  </div>
                  <Star className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Top Performing Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Top Performing Events
                </CardTitle>
                <CardDescription>Best events by registration and rating</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.performance.topEvents.map((event, index) => (
                    <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                          index === 0 ? 'bg-yellow-100 text-yellow-800' :
                          index === 1 ? 'bg-gray-100 text-gray-800' :
                          index === 2 ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{event.name}</p>
                          <p className="text-sm text-muted-foreground">{event.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{event.registrations}/{event.capacity}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span className="text-sm">{event.rating}</span>
                          <span className={`text-sm ml-2 ${getPerformanceColor(event.fillRate)}`}>
                            {event.fillRate}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Category Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Category Performance
                </CardTitle>
                <CardDescription>Performance breakdown by event category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.performance.categoryPerformance.map((category) => (
                    <div key={category.category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{category.category}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{category.eventCount} events</Badge>
                          <span className="text-sm text-muted-foreground">
                            ₹{category.revenue.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>Registrations</span>
                            <span>{category.totalRegistrations}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${(category.totalRegistrations / analytics.overview.totalRegistrations) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-medium">{category.averageRating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Demographics and Engagement */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Demographics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Participant Demographics
                </CardTitle>
                <CardDescription>Registration breakdown by department and year</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">By Department</h4>
                  <div className="space-y-2">
                    {analytics.demographics.registrationsByDepartment.map((dept) => (
                      <div key={dept.department} className="flex items-center justify-between">
                        <span className="text-sm">{dept.department}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${(dept.count / analytics.overview.totalRegistrations) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-12 text-right">{dept.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">By Academic Year</h4>
                  <div className="space-y-2">
                    {analytics.demographics.registrationsByYear.map((year) => (
                      <div key={year.year} className="flex items-center justify-between">
                        <span className="text-sm">Year {year.year}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-500 h-2 rounded-full"
                              style={{ width: `${(year.count / analytics.overview.totalRegistrations) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-12 text-right">{year.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Engagement Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Engagement Metrics
                </CardTitle>
                <CardDescription>Participant engagement and feedback metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-blue-500" />
                      <span className="font-medium">Avg Registration Time</span>
                    </div>
                    <span className="text-lg font-bold text-blue-700">
                      {analytics.engagement.averageRegistrationTime} days
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-5 w-5 text-green-500" />
                      <span className="font-medium">Completion Rate</span>
                    </div>
                    <span className="text-lg font-bold text-green-700">
                      {analytics.engagement.completionRate}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-purple-500" />
                      <span className="font-medium">Feedback Score</span>
                    </div>
                    <span className="text-lg font-bold text-purple-700">
                      {analytics.engagement.feedbackScore}/5.0
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-orange-500" />
                      <span className="font-medium">Repeat Participants</span>
                    </div>
                    <span className="text-lg font-bold text-orange-700">
                      {analytics.engagement.repeatParticipants}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Eye className="h-5 w-5 text-gray-500" />
                      <span className="font-medium">Social Shares</span>
                    </div>
                    <span className="text-lg font-bold text-gray-700">
                      {analytics.engagement.socialShares}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-yellow-500" />
                      <span className="font-medium">Email Open Rate</span>
                    </div>
                    <span className="text-lg font-bold text-yellow-700">
                      {analytics.engagement.emailOpenRate}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Monthly Trends
              </CardTitle>
              <CardDescription>Event performance over time</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Events</TableHead>
                    <TableHead>Registrations</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Attendance %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics.trends.monthlyData.map((month) => (
                    <TableRow key={month.month}>
                      <TableCell className="font-medium">{month.month}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{month.events}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {month.registrations}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          ₹{month.revenue.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={getPerformanceColor(month.attendance, 80)}>
                          {month.attendance}%
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
    </AdminLayout>
  )
}