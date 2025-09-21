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
  Users,
  TrendingUp,
  TrendingDown,
  Calendar,
  GraduationCap,
  Building,
  Crown,
  Star,
  UserCheck,
  Activity,
  PieChart,
  BarChart3,
  Download,
  Filter,
  RefreshCw
} from "lucide-react"
import { toast } from "sonner"

interface TeamAnalytics {
  overview: {
    totalMembers: number
    activeMembers: number
    inactiveMembers: number
    newMembersThisMonth: number
    newMembersLastMonth: number
    averageAge: number
    retentionRate: number
  }
  demographics: {
    byYear: Array<{ year: number; count: number }>
    byCourse: Array<{ course: string; count: number }>
    byBranch: Array<{ branch: string; count: number }>
    byDepartment: Array<{ department: string; count: number }>
  }
  roles: {
    byRole: Array<{ role: string; count: number; percentage: number }>
    roleDistribution: Array<{ role: string; members: Array<{ name: string; joinDate: string }> }>
  }
  activity: {
    activeInActivities: number
    inactiveInActivities: number
    monthlyActivity: Array<{ month: string; active: number; joined: number; left: number }>
  }
  performance: {
    topPerformers: Array<{ name: string; role: string; activitiesCount: number; contributions: number }>
    departmentPerformance: Array<{ department: string; activeMembers: number; totalMembers: number; percentage: number }>
  }
  trends: {
    growthRate: number
    churnRate: number
    engagementScore: number
    diversityIndex: number
  }
}

export default function TeamAnalyticsPage() {
  const router = useRouter()
  const [analytics, setAnalytics] = useState<TeamAnalytics | null>(null)
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
      const mockAnalytics: TeamAnalytics = {
        overview: {
          totalMembers: 45,
          activeMembers: 38,
          inactiveMembers: 7,
          newMembersThisMonth: 5,
          newMembersLastMonth: 3,
          averageAge: 20.5,
          retentionRate: 85.7
        },
        demographics: {
          byYear: [
            { year: 1, count: 8 },
            { year: 2, count: 12 },
            { year: 3, count: 15 },
            { year: 4, count: 10 }
          ],
          byCourse: [
            { course: 'B.Tech', count: 35 },
            { course: 'M.Tech', count: 6 },
            { course: 'MCA', count: 3 },
            { course: 'BCA', count: 1 }
          ],
          byBranch: [
            { branch: 'Computer Science', count: 18 },
            { branch: 'Information Technology', count: 12 },
            { branch: 'Electronics & Communication', count: 8 },
            { branch: 'Mechanical', count: 4 },
            { branch: 'Civil', count: 2 },
            { branch: 'Electrical', count: 1 }
          ],
          byDepartment: [
            { department: 'Computer Science', count: 20 },
            { department: 'Information Technology', count: 15 },
            { department: 'Electronics', count: 6 },
            { department: 'Mechanical', count: 3 },
            { department: 'Other', count: 1 }
          ]
        },
        roles: {
          byRole: [
            { role: 'HOD', count: 1, percentage: 2.2 },
            { role: 'Coordinator', count: 3, percentage: 6.7 },
            { role: 'Assistant Coordinator', count: 5, percentage: 11.1 },
            { role: 'Content Manager', count: 2, percentage: 4.4 },
            { role: 'Member', count: 34, percentage: 75.6 }
          ],
          roleDistribution: [
            {
              role: 'HOD',
              members: [
                { name: 'Dr. Rajesh Kumar', joinDate: '2020-08-15' }
              ]
            },
            {
              role: 'Coordinator',
              members: [
                { name: 'Prof. Anita Sharma', joinDate: '2021-01-10' },
                { name: 'Dr. Vikash Singh', joinDate: '2021-03-22' },
                { name: 'Prof. Meera Gupta', joinDate: '2021-07-18' }
              ]
            }
          ]
        },
        activity: {
          activeInActivities: 32,
          inactiveInActivities: 13,
          monthlyActivity: [
            { month: 'Jan', active: 30, joined: 2, left: 1 },
            { month: 'Feb', active: 32, joined: 3, left: 1 },
            { month: 'Mar', active: 35, joined: 4, left: 1 },
            { month: 'Apr', active: 38, joined: 5, left: 2 },
            { month: 'May', active: 40, joined: 3, left: 1 },
            { month: 'Jun', active: 38, joined: 2, left: 4 }
          ]
        },
        performance: {
          topPerformers: [
            { name: 'Rahul Verma', role: 'Assistant Coordinator', activitiesCount: 15, contributions: 92 },
            { name: 'Priya Patel', role: 'Content Manager', activitiesCount: 12, contributions: 88 },
            { name: 'Amit Kumar', role: 'Member', activitiesCount: 10, contributions: 85 },
            { name: 'Sneha Jain', role: 'Member', activitiesCount: 9, contributions: 82 },
            { name: 'Ravi Singh', role: 'Assistant Coordinator', activitiesCount: 8, contributions: 80 }
          ],
          departmentPerformance: [
            { department: 'Computer Science', activeMembers: 18, totalMembers: 20, percentage: 90 },
            { department: 'Information Technology', activeMembers: 13, totalMembers: 15, percentage: 86.7 },
            { department: 'Electronics', activeMembers: 5, totalMembers: 6, percentage: 83.3 },
            { department: 'Mechanical', activeMembers: 2, totalMembers: 3, percentage: 66.7 },
            { department: 'Other', activeMembers: 0, totalMembers: 1, percentage: 0 }
          ]
        },
        trends: {
          growthRate: 12.5,
          churnRate: 5.2,
          engagementScore: 84.3,
          diversityIndex: 72.1
        }
      }
      
      setAnalytics(mockAnalytics)
    } catch (error) {
      console.error('Error fetching analytics:', error)
      toast.error('Failed to load analytics data')
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
    toast.success('Analytics report exported successfully')
  }

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getTrendIcon = (value: number, isGood: boolean = true) => {
    const isPositive = isGood ? value > 0 : value < 0
    return isPositive ? (
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
            <div className="text-lg">Loading analytics...</div>
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
            <div className="text-lg">Failed to load analytics</div>
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
                <h1 className="text-2xl font-bold">Team Analytics</h1>
                <p className="text-muted-foreground">
                  Comprehensive insights into team composition and performance
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
                    <p className="text-sm text-muted-foreground">Total Members</p>
                    <p className="text-2xl font-bold">{analytics.overview.totalMembers}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {getTrendIcon(analytics.overview.newMembersThisMonth - analytics.overview.newMembersLastMonth)}
                      <span className="text-xs text-muted-foreground">
                        +{analytics.overview.newMembersThisMonth} this month
                      </span>
                    </div>
                  </div>
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Members</p>
                    <p className="text-2xl font-bold text-green-600">{analytics.overview.activeMembers}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {((analytics.overview.activeMembers / analytics.overview.totalMembers) * 100).toFixed(1)}% of total
                      </span>
                    </div>
                  </div>
                  <UserCheck className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Retention Rate</p>
                    <p className="text-2xl font-bold">{analytics.overview.retentionRate}%</p>
                    <div className="flex items-center gap-1 mt-1">
                      {getTrendIcon(analytics.trends.churnRate, false)}
                      <span className="text-xs text-muted-foreground">
                        {analytics.trends.churnRate}% churn rate
                      </span>
                    </div>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Engagement Score</p>
                    <p className="text-2xl font-bold">{analytics.trends.engagementScore}%</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Activity className="h-3 w-3 text-purple-500" />
                      <span className="text-xs text-muted-foreground">
                        {analytics.activity.activeInActivities} active in activities
                      </span>
                    </div>
                  </div>
                  <Activity className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Demographics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Demographics
                </CardTitle>
                <CardDescription>Team composition breakdown</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">By Academic Year</h4>
                  <div className="space-y-2">
                    {analytics.demographics.byYear.map((item) => (
                      <div key={item.year} className="flex items-center justify-between">
                        <span className="text-sm">Year {item.year}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${(item.count / analytics.overview.totalMembers) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{item.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">By Course</h4>
                  <div className="space-y-2">
                    {analytics.demographics.byCourse.map((item) => (
                      <div key={item.course} className="flex items-center justify-between">
                        <span className="text-sm">{item.course}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${(item.count / analytics.overview.totalMembers) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{item.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Role Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  Role Distribution
                </CardTitle>
                <CardDescription>Team members by roles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.roles.byRole.map((item) => (
                    <div key={item.role} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {item.role === 'HOD' && <Crown className="h-4 w-4 text-yellow-500" />}
                        {item.role === 'Coordinator' && <Star className="h-4 w-4 text-blue-500" />}
                        {item.role === 'Assistant Coordinator' && <UserCheck className="h-4 w-4 text-green-500" />}
                        <span className="text-sm font-medium">{item.role}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{item.count}</span>
                        <span className="text-xs text-muted-foreground">({item.percentage.toFixed(1)}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Tables */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Top Performers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Top Performers
                </CardTitle>
                <CardDescription>Most active team members</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Activities</TableHead>
                      <TableHead>Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analytics.performance.topPerformers.map((performer, index) => (
                      <TableRow key={performer.name}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{performer.name}</p>
                            <p className="text-xs text-muted-foreground">{performer.role}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{performer.activitiesCount}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className={`font-medium ${getPerformanceColor(performer.contributions)}`}>
                              {performer.contributions}%
                            </span>
                            {index < 3 && <Star className="h-3 w-3 text-yellow-500" />}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Department Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Department Performance
                </CardTitle>
                <CardDescription>Activity rates by department</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Department</TableHead>
                      <TableHead>Active/Total</TableHead>
                      <TableHead>Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analytics.performance.departmentPerformance.map((dept) => (
                      <TableRow key={dept.department}>
                        <TableCell>
                          <span className="font-medium">{dept.department}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {dept.activeMembers}/{dept.totalMembers}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  dept.percentage >= 80 ? 'bg-green-500' :
                                  dept.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${dept.percentage}%` }}
                              />
                            </div>
                            <span className={`text-sm font-medium ${getPerformanceColor(dept.percentage)}`}>
                              {dept.percentage.toFixed(1)}%
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Trends and Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Key Insights & Trends
              </CardTitle>
              <CardDescription>Performance indicators and growth metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Growth Rate</p>
                    <p className="text-xl font-bold text-blue-700">{analytics.trends.growthRate}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm text-green-600 font-medium">Engagement</p>
                    <p className="text-xl font-bold text-green-700">{analytics.trends.engagementScore}%</p>
                  </div>
                  <Activity className="h-8 w-8 text-green-500" />
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div>
                    <p className="text-sm text-purple-600 font-medium">Diversity Index</p>
                    <p className="text-xl font-bold text-purple-700">{analytics.trends.diversityIndex}%</p>
                  </div>
                  <PieChart className="h-8 w-8 text-purple-500" />
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p className="text-sm text-orange-600 font-medium">Avg. Age</p>
                    <p className="text-xl font-bold text-orange-700">{analytics.overview.averageAge} yrs</p>
                  </div>
                  <Calendar className="h-8 w-8 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
    </AdminLayout>
  )
}