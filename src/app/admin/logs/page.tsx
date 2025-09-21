"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/modules/layouts'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ArrowLeft,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Search,
  Filter,
  Download,
  RefreshCw,
  MoreHorizontal,
  Eye,
  Calendar,
  Clock,
  User,
  Globe,
  Database,
  Server,
  Shield,
  Zap,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  LineChart
} from "lucide-react"
import { toast } from "sonner"
import { AreaChart, Area, BarChart, Bar, LineChart as RechartsLineChart, Line, PieChart as RechartsPieChart, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface LogEntry {
  id: string
  timestamp: string
  level: 'info' | 'warning' | 'error' | 'debug'
  category: string
  message: string
  user?: string
  ip?: string
  userAgent?: string
  details?: Record<string, unknown>
}

interface SystemMetric {
  id: string
  name: string
  value: number
  unit: string
  status: 'healthy' | 'warning' | 'critical'
  threshold: number
  trend: 'up' | 'down' | 'stable'
  change: number
}

interface AuditLog {
  id: string
  timestamp: string
  action: string
  resource: string
  user: string
  details: string
  result: 'success' | 'failed'
  ip: string
}

interface PerformanceData {
  timestamp: string
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
  networkIn: number
  networkOut: number
  activeUsers: number
  responseTime: number
}

export default function LogsMonitoringPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('logs')
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [metrics, setMetrics] = useState<SystemMetric[]>([])
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([])
  
  // Filters
  const [logLevel, setLogLevel] = useState('all')
  const [logCategory, setLogCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [dateRange, setDateRange] = useState('today')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock log entries
      const mockLogs: LogEntry[] = [
        {
          id: '1',
          timestamp: '2024-01-15T14:30:25Z',
          level: 'info',
          category: 'auth',
          message: 'User login successful',
          user: 'john.doe@example.com',
          ip: '192.168.1.100',
          userAgent: 'Mozilla/5.0...'
        },
        {
          id: '2',
          timestamp: '2024-01-15T14:25:12Z',
          level: 'warning',
          category: 'system',
          message: 'High memory usage detected',
          details: { memoryUsage: '85%', threshold: '80%' }
        },
        {
          id: '3',
          timestamp: '2024-01-15T14:20:08Z',
          level: 'error',
          category: 'database',
          message: 'Connection timeout to database',
          details: { timeout: '30s', query: 'SELECT * FROM users' }
        },
        {
          id: '4',
          timestamp: '2024-01-15T14:15:45Z',
          level: 'info',
          category: 'backup',
          message: 'Scheduled backup completed successfully',
          details: { size: '2.5GB', duration: '15m' }
        },
        {
          id: '5',
          timestamp: '2024-01-15T14:10:33Z',
          level: 'debug',
          category: 'api',
          message: 'API request processed',
          user: 'admin@example.com',
          ip: '10.0.0.1',
          details: { endpoint: '/api/users', method: 'GET', responseTime: '150ms' }
        }
      ]

      // Mock audit logs
      const mockAuditLogs: AuditLog[] = [
        {
          id: '1',
          timestamp: '2024-01-15T14:35:00Z',
          action: 'CREATE',
          resource: 'User Account',
          user: 'admin@example.com',
          details: 'Created new user account for jane.smith@example.com',
          result: 'success',
          ip: '192.168.1.50'
        },
        {
          id: '2',
          timestamp: '2024-01-15T14:30:00Z',
          action: 'UPDATE',
          resource: 'System Settings',
          user: 'admin@example.com',
          details: 'Modified email configuration settings',
          result: 'success',
          ip: '192.168.1.50'
        },
        {
          id: '3',
          timestamp: '2024-01-15T14:25:00Z',
          action: 'DELETE',
          resource: 'Document',
          user: 'editor@example.com',
          details: 'Deleted document: old-project-spec.pdf',
          result: 'success',
          ip: '192.168.1.75'
        },
        {
          id: '4',
          timestamp: '2024-01-15T14:20:00Z',
          action: 'LOGIN',
          resource: 'Admin Panel',
          user: 'john.doe@example.com',
          details: 'Failed login attempt - invalid password',
          result: 'failed',
          ip: '203.0.113.1'
        }
      ]

      // Mock system metrics
      const mockMetrics: SystemMetric[] = [
        {
          id: '1',
          name: 'CPU Usage',
          value: 68,
          unit: '%',
          status: 'healthy',
          threshold: 80,
          trend: 'up',
          change: 5.2
        },
        {
          id: '2',
          name: 'Memory Usage',
          value: 82,
          unit: '%',
          status: 'warning',
          threshold: 80,
          trend: 'up',
          change: 12.1
        },
        {
          id: '3',
          name: 'Disk Usage',
          value: 45,
          unit: '%',
          status: 'healthy',
          threshold: 90,
          trend: 'stable',
          change: 0.8
        },
        {
          id: '4',
          name: 'Active Users',
          value: 127,
          unit: 'users',
          status: 'healthy',
          threshold: 500,
          trend: 'up',
          change: 8.5
        },
        {
          id: '5',
          name: 'Response Time',
          value: 235,
          unit: 'ms',
          status: 'healthy',
          threshold: 1000,
          trend: 'down',
          change: -15.3
        },
        {
          id: '6',
          name: 'Error Rate',
          value: 2.1,
          unit: '%',
          status: 'healthy',
          threshold: 5,
          trend: 'down',
          change: -0.5
        }
      ]

      // Mock performance data for charts
      const mockPerformanceData: PerformanceData[] = [
        { timestamp: '14:00', cpuUsage: 45, memoryUsage: 65, diskUsage: 44, networkIn: 120, networkOut: 80, activeUsers: 95, responseTime: 180 },
        { timestamp: '14:05', cpuUsage: 52, memoryUsage: 68, diskUsage: 44, networkIn: 135, networkOut: 95, activeUsers: 102, responseTime: 195 },
        { timestamp: '14:10', cpuUsage: 48, memoryUsage: 72, diskUsage: 45, networkIn: 142, networkOut: 88, activeUsers: 108, responseTime: 210 },
        { timestamp: '14:15', cpuUsage: 65, memoryUsage: 75, diskUsage: 45, networkIn: 158, networkOut: 105, activeUsers: 115, responseTime: 225 },
        { timestamp: '14:20', cpuUsage: 70, memoryUsage: 78, diskUsage: 45, networkIn: 164, networkOut: 112, activeUsers: 120, responseTime: 240 },
        { timestamp: '14:25', cpuUsage: 75, memoryUsage: 80, diskUsage: 45, networkIn: 175, networkOut: 125, activeUsers: 125, responseTime: 250 },
        { timestamp: '14:30', cpuUsage: 68, memoryUsage: 82, diskUsage: 45, networkIn: 168, networkOut: 118, activeUsers: 127, responseTime: 235 }
      ]

      setLogs(mockLogs)
      setAuditLogs(mockAuditLogs)
      setMetrics(mockMetrics)
      setPerformanceData(mockPerformanceData)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load monitoring data')
    } finally {
      setLoading(false)
    }
  }

  const getLogLevelIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />
      case 'debug':
        return <CheckCircle className="h-4 w-4 text-gray-500" />
      default:
        return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  const getLogLevelBadge = (level: string) => {
    const variants = {
      error: 'destructive',
      warning: 'default',
      info: 'secondary',
      debug: 'outline'
    } as const
    
    return (
      <Badge variant={variants[level as keyof typeof variants] || 'outline'}>
        {level.toUpperCase()}
      </Badge>
    )
  }

  const getMetricStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-500'
      case 'warning':
        return 'text-yellow-500'
      case 'critical':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  const getTrendIcon = (trend: string, change: number) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className={`h-4 w-4 ${change > 0 ? 'text-red-500' : 'text-green-500'}`} />
      case 'down':
        return <TrendingDown className={`h-4 w-4 ${change < 0 ? 'text-green-500' : 'text-red-500'}`} />
      default:
        return <BarChart3 className="h-4 w-4 text-gray-500" />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const handleExportLogs = () => {
    toast.success('Exporting logs...')
  }

  const handleClearLogs = () => {
    toast.success('Logs cleared successfully')
    setLogs([])
  }

  const filteredLogs = logs.filter(log => {
    const matchesLevel = logLevel === 'all' || log.level === logLevel
    const matchesCategory = logCategory === 'all' || log.category === logCategory
    const matchesSearch = searchTerm === '' || 
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user?.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesLevel && matchesCategory && matchesSearch
  })

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-lg">Loading monitoring data...</div>
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
              <h1 className="text-2xl font-bold">Logs & Monitoring</h1>
              <p className="text-muted-foreground">
                System logs, audit trails, and performance monitoring
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={fetchData}
              disabled={loading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button
              variant="outline"
              onClick={handleExportLogs}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* System Metrics Overview */}
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          {metrics.map((metric) => (
            <Card key={metric.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                {getTrendIcon(metric.trend, metric.change)}
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getMetricStatusColor(metric.status)}`}>
                  {metric.value}
                  <span className="text-sm font-normal ml-1">{metric.unit}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {metric.change > 0 ? '+' : ''}{metric.change}% from last hour
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="logs">System Logs</TabsTrigger>
            <TabsTrigger value="audit">Audit Trail</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="logs" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <Label>Log Level</Label>
                    <Select value={logLevel} onValueChange={setLogLevel}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="debug">Debug</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={logCategory} onValueChange={setLogCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="auth">Authentication</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                        <SelectItem value="database">Database</SelectItem>
                        <SelectItem value="api">API</SelectItem>
                        <SelectItem value="backup">Backup</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Date Range</Label>
                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="yesterday">Yesterday</SelectItem>
                        <SelectItem value="week">Last 7 days</SelectItem>
                        <SelectItem value="month">Last 30 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Search</Label>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search logs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Log Entries */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Log Entries ({filteredLogs.length})
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearLogs}
                  >
                    Clear Logs
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-sm">
                          {formatTimestamp(log.timestamp)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getLogLevelIcon(log.level)}
                            {getLogLevelBadge(log.level)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{log.category}</Badge>
                        </TableCell>
                        <TableCell>{log.message}</TableCell>
                        <TableCell>{log.user || '-'}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="h-4 w-4 mr-2" />
                                Export Entry
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Audit Trail
                </CardTitle>
                <CardDescription>
                  Track all administrative actions and user activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Resource</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead>IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-sm">
                          {formatTimestamp(log.timestamp)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{log.action}</Badge>
                        </TableCell>
                        <TableCell>{log.resource}</TableCell>
                        <TableCell>{log.user}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {log.details}
                        </TableCell>
                        <TableCell>
                          <Badge variant={log.result === 'success' ? 'default' : 'destructive'}>
                            {log.result}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {log.ip}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>System Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timestamp" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="cpuUsage" stackId="1" stroke="#8884d8" fill="#8884d8" name="CPU %" />
                      <Area type="monotone" dataKey="memoryUsage" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Memory %" />
                      <Area type="monotone" dataKey="diskUsage" stackId="1" stroke="#ffc658" fill="#ffc658" name="Disk %" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Network Traffic</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsLineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timestamp" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="networkIn" stroke="#8884d8" name="Network In (MB/s)" />
                      <Line type="monotone" dataKey="networkOut" stroke="#82ca9d" name="Network Out (MB/s)" />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timestamp" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="activeUsers" fill="#8884d8" name="Active Users" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Response Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsLineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timestamp" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="responseTime" stroke="#ff7300" name="Response Time (ms)" />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Log Level Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Tooltip />
                      <Legend />
                      <RechartsPieChart
                        data={[
                          { name: 'Info', value: 45, fill: '#0088FE' },
                          { name: 'Warning', value: 25, fill: '#FFBB28' },
                          { name: 'Error', value: 20, fill: '#FF8042' },
                          { name: 'Debug', value: 10, fill: '#00C49F' }
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                      >
                        {[
                          { name: 'Info', value: 45, fill: '#0088FE' },
                          { name: 'Warning', value: 25, fill: '#FFBB28' },
                          { name: 'Error', value: 20, fill: '#FF8042' },
                          { name: 'Debug', value: 10, fill: '#00C49F' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </RechartsPieChart>
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Error Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { day: 'Mon', errors: 12 },
                      { day: 'Tue', errors: 8 },
                      { day: 'Wed', errors: 15 },
                      { day: 'Thu', errors: 6 },
                      { day: 'Fri', errors: 9 },
                      { day: 'Sat', errors: 4 },
                      { day: 'Sun', errors: 3 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="errors" fill="#ff8042" name="Error Count" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>System Health Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-500">98.5%</div>
                      <div className="text-sm text-muted-foreground">Uptime</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-500">2.1%</div>
                      <div className="text-sm text-muted-foreground">Error Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-500">235ms</div>
                      <div className="text-sm text-muted-foreground">Avg Response</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-500">127</div>
                      <div className="text-sm text-muted-foreground">Active Users</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}