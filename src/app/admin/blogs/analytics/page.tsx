"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AppSidebar } from "@/components/admin/app-sidebar"
import { SiteHeader } from "@/components/admin/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Users,
  Calendar,
  Clock,
  FileText,
  Tag,
  ExternalLink,
  Download,
  RefreshCw,
  Filter
} from "lucide-react"
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface BlogStats {
  totalPosts: number
  totalViews: number
  totalLikes: number
  totalComments: number
  totalShares: number
  avgReadingTime: number
  avgEngagementRate: number
  publishedThisMonth: number
}

interface BlogPost {
  id: string
  title: string
  slug: string
  category: string
  views: number
  likes: number
  comments: number
  shares: number
  publishedAt: string
  readingTime: number
  status: 'published' | 'draft' | 'scheduled'
}

interface CategoryStats {
  name: string
  posts: number
  views: number
  engagement: number
  color: string
}

interface ViewsData {
  date: string
  views: number
  likes: number
  comments: number
}

export default function BlogAnalyticsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')
  const [stats, setStats] = useState<BlogStats | null>(null)
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([])
  const [viewsData, setViewsData] = useState<ViewsData[]>([])

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      
      // Simulate API call - replace with actual API
      const mockStats: BlogStats = {
        totalPosts: 156,
        totalViews: 45678,
        totalLikes: 3456,
        totalComments: 1234,
        totalShares: 789,
        avgReadingTime: 4.2,
        avgEngagementRate: 7.5,
        publishedThisMonth: 12
      }

      const mockPosts: BlogPost[] = [
        {
          id: '1',
          title: 'Advanced Robotics Programming Techniques',
          slug: 'advanced-robotics-programming',
          category: 'Robotics',
          views: 2345,
          likes: 189,
          comments: 45,
          shares: 67,
          publishedAt: '2024-01-20T10:00:00Z',
          readingTime: 8,
          status: 'published'
        },
        {
          id: '2',
          title: 'Machine Learning in Autonomous Systems',
          slug: 'ml-autonomous-systems',
          category: 'AI & ML',
          views: 1876,
          likes: 234,
          comments: 56,
          shares: 89,
          publishedAt: '2024-01-18T14:30:00Z',
          readingTime: 12,
          status: 'published'
        },
        {
          id: '3',
          title: 'Building Your First Arduino Robot',
          slug: 'first-arduino-robot',
          category: 'Tutorials',
          views: 3456,
          likes: 456,
          comments: 123,
          shares: 234,
          publishedAt: '2024-01-15T09:15:00Z',
          readingTime: 6,
          status: 'published'
        },
        {
          id: '4',
          title: 'Competition Results: National Robotics Championship',
          slug: 'national-robotics-championship-results',
          category: 'Competitions',
          views: 1234,
          likes: 78,
          comments: 34,
          shares: 45,
          publishedAt: '2024-01-12T16:45:00Z',
          readingTime: 4,
          status: 'published'
        },
        {
          id: '5',
          title: 'Future of Robotics Technology',
          slug: 'future-robotics-technology',
          category: 'Technology',
          views: 2987,
          likes: 345,
          comments: 89,
          shares: 156,
          publishedAt: '2024-01-10T11:20:00Z',
          readingTime: 10,
          status: 'published'
        }
      ]

      const mockCategoryStats: CategoryStats[] = [
        { name: 'Robotics', posts: 42, views: 15678, engagement: 8.2, color: '#10B981' },
        { name: 'AI & ML', posts: 29, views: 12345, engagement: 7.8, color: '#8B5CF6' },
        { name: 'Tutorials', posts: 35, views: 18900, engagement: 9.1, color: '#F59E0B' },
        { name: 'Technology', posts: 24, views: 9876, engagement: 6.5, color: '#3B82F6' },
        { name: 'Competitions', posts: 18, views: 6543, engagement: 5.9, color: '#EF4444' },
        { name: 'Club News', posts: 8, views: 2345, engagement: 4.2, color: '#6B7280' }
      ]

      // Generate mock views data for the last 30 days
      const mockViewsData: ViewsData[] = []
      for (let i = 29; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        mockViewsData.push({
          date: date.toISOString().split('T')[0],
          views: Math.floor(Math.random() * 500) + 200,
          likes: Math.floor(Math.random() * 50) + 10,
          comments: Math.floor(Math.random() * 20) + 5
        })
      }

      setStats(mockStats)
      setPosts(mockPosts)
      setCategoryStats(mockCategoryStats)
      setViewsData(mockViewsData)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const getEngagementRate = (post: BlogPost) => {
    if (post.views === 0) return 0
    return ((post.likes + post.comments + post.shares) / post.views * 100).toFixed(1)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const getTopPerformingPosts = () => {
    return [...posts]
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)
  }

  const getMostEngagingPosts = () => {
    return [...posts]
      .sort((a, b) => {
        const aEngagement = (a.likes + a.comments + a.shares) / a.views
        const bEngagement = (b.likes + b.comments + b.shares) / b.views
        return bEngagement - aEngagement
      })
      .slice(0, 5)
  }

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-lg">Loading analytics...</div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  if (!stats) return null

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
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
                <h1 className="text-2xl font-bold">Blog Analytics</h1>
                <p className="text-muted-foreground">
                  Track blog performance and engagement metrics
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={fetchAnalytics}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Views</p>
                    <p className="text-2xl font-bold">{formatNumber(stats.totalViews)}</p>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +12.5% from last month
                    </p>
                  </div>
                  <Eye className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Posts</p>
                    <p className="text-2xl font-bold">{stats.totalPosts}</p>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +{stats.publishedThisMonth} this month
                    </p>
                  </div>
                  <FileText className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Engagement Rate</p>
                    <p className="text-2xl font-bold">{stats.avgEngagementRate}%</p>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +2.3% from last month
                    </p>
                  </div>
                  <Heart className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Reading Time</p>
                    <p className="text-2xl font-bold">{stats.avgReadingTime} min</p>
                    <p className="text-xs text-orange-600 flex items-center mt-1">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      -0.5 min from last month
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Tabs */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="posts">Post Performance</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 lg:grid-cols-2">
                {/* Views Over Time */}
                <Card>
                  <CardHeader>
                    <CardTitle>Views Over Time</CardTitle>
                    <CardDescription>Daily blog views for the selected period</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={viewsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={formatDate}
                        />
                        <YAxis />
                        <Tooltip 
                          labelFormatter={(label) => formatDate(label)}
                          formatter={(value: number) => [formatNumber(value), 'Views']}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="views" 
                          stroke="#3B82F6" 
                          fill="#3B82F6" 
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Category Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Category Distribution</CardTitle>
                    <CardDescription>Posts and views by category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={categoryStats}
                          dataKey="posts"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {categoryStats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Engagement Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Engagement Metrics</CardTitle>
                  <CardDescription>Likes, comments, and shares over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={viewsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={formatDate}
                      />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={(label) => formatDate(label)}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="likes" 
                        stroke="#EF4444" 
                        strokeWidth={2}
                        name="Likes"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="comments" 
                        stroke="#10B981" 
                        strokeWidth={2}
                        name="Comments"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="posts" className="space-y-4">
              <div className="grid gap-4 lg:grid-cols-2">
                {/* Top Performing Posts */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Posts</CardTitle>
                    <CardDescription>Posts with the most views</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {getTopPerformingPosts().map((post, index) => (
                        <div key={post.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-lg text-blue-600">#{index + 1}</span>
                              <Badge variant="outline">{post.category}</Badge>
                            </div>
                            <h4 className="font-medium">{post.title}</h4>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {formatNumber(post.views)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                {post.likes}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageCircle className="h-3 w-3" />
                                {post.comments}
                              </span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Most Engaging Posts */}
                <Card>
                  <CardHeader>
                    <CardTitle>Most Engaging Posts</CardTitle>
                    <CardDescription>Posts with highest engagement rates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {getMostEngagingPosts().map((post, index) => (
                        <div key={post.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-lg text-green-600">#{index + 1}</span>
                              <Badge variant="outline">{post.category}</Badge>
                              <Badge variant="secondary">{getEngagementRate(post)}% engagement</Badge>
                            </div>
                            <h4 className="font-medium">{post.title}</h4>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {formatNumber(post.views)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {post.readingTime} min
                              </span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* All Posts Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>All Posts Performance</CardTitle>
                  <CardDescription>Detailed performance metrics for all posts</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Post Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Views</TableHead>
                        <TableHead>Likes</TableHead>
                        <TableHead>Comments</TableHead>
                        <TableHead>Shares</TableHead>
                        <TableHead>Engagement</TableHead>
                        <TableHead>Published</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {posts.map((post) => (
                        <TableRow key={post.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{post.title}</p>
                              <p className="text-sm text-muted-foreground">{post.readingTime} min read</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{post.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4 text-muted-foreground" />
                              {formatNumber(post.views)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Heart className="h-4 w-4 text-red-500" />
                              {post.likes}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-4 w-4 text-blue-500" />
                              {post.comments}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Share2 className="h-4 w-4 text-green-500" />
                              {post.shares}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              className={parseFloat(getEngagementRate(post)) > 5 ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}
                            >
                              {getEngagementRate(post)}%
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-muted-foreground">
                              {new Date(post.publishedAt).toLocaleDateString()}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="categories" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Category Performance</CardTitle>
                  <CardDescription>Detailed metrics for each blog category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {categoryStats.map((category) => (
                      <Card key={category.name}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-4 h-4 rounded" 
                                style={{ backgroundColor: category.color }}
                              />
                              <h3 className="font-medium">{category.name}</h3>
                            </div>
                            <Badge variant="outline">{category.posts} posts</Badge>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Total Views</span>
                              <span className="font-medium">{formatNumber(category.views)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Avg. Engagement</span>
                              <span className="font-medium">{category.engagement}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Views per Post</span>
                              <span className="font-medium">{Math.round(category.views / category.posts)}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category Trends</CardTitle>
                  <CardDescription>Views comparison across categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={categoryStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="views" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="engagement" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Likes</p>
                        <p className="text-2xl font-bold">{formatNumber(stats.totalLikes)}</p>
                        <p className="text-xs text-green-600 flex items-center mt-1">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          +15.3% this month
                        </p>
                      </div>
                      <Heart className="h-8 w-8 text-red-500" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Comments</p>
                        <p className="text-2xl font-bold">{formatNumber(stats.totalComments)}</p>
                        <p className="text-xs text-green-600 flex items-center mt-1">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          +8.7% this month
                        </p>
                      </div>
                      <MessageCircle className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Shares</p>
                        <p className="text-2xl font-bold">{formatNumber(stats.totalShares)}</p>
                        <p className="text-xs text-green-600 flex items-center mt-1">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          +12.1% this month
                        </p>
                      </div>
                      <Share2 className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Engagement Breakdown</CardTitle>
                  <CardDescription>Detailed engagement metrics over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={viewsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={formatDate}
                      />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={(label) => formatDate(label)}
                      />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="views" 
                        stackId="1"
                        stroke="#3B82F6" 
                        fill="#3B82F6" 
                        name="Views"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="likes" 
                        stackId="2"
                        stroke="#EF4444" 
                        fill="#EF4444" 
                        name="Likes"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="comments" 
                        stackId="3"
                        stroke="#10B981" 
                        fill="#10B981" 
                        name="Comments"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}