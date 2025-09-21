"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/modules/layouts'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  BarChart3,
  Wrench,
  Cpu,
  Battery
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from 'next/image'

interface StockItem {
  _id: string
  name: string
  category: string
  type: 'robot' | 'component' | 'tool' | 'accessory'
  brand: string
  model: string
  description: string
  quantity: number
  minQuantity: number
  unitPrice: number
  totalValue: number
  location: string
  supplier: string
  lastUpdated: string
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued'
  condition: 'new' | 'good' | 'fair' | 'needs_repair' | 'damaged'
  image: string
  serialNumbers: string[]
  purchaseDate: string
  warrantyExpiry: string
  notes: string
}

export default function StockManagementPage() {
  const router = useRouter()
  const [stockItems, setStockItems] = useState<StockItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [conditionFilter, setConditionFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [stats, setStats] = useState({
    totalItems: 0,
    totalValue: 0,
    robotsCount: 0,
    componentsCount: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    needsRepairItems: 0
  })

  useEffect(() => {
    fetchStockItems()
    fetchStats()
  }, [])

  const fetchStockItems = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/stock')
      if (!response.ok) {
        throw new Error('Failed to fetch stock items')
      }
      const data = await response.json()
      setStockItems(data.stock || [])
    } catch (error) {
      console.error('Error fetching stock items:', error)
      // Fallback to empty array if API fails
      setStockItems([])
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stock')
      if (!response.ok) {
        throw new Error('Failed to fetch stats')
      }
      const data = await response.json()
      setStats(data.stats || {
        totalItems: 0,
        totalValue: 0,
        robotsCount: 0,
        componentsCount: 0,
        lowStockItems: 0,
        outOfStockItems: 0,
        needsRepairItems: 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
      // Fallback to default stats if API fails
      setStats({
        totalItems: 0,
        totalValue: 0,
        robotsCount: 0,
        componentsCount: 0,
        lowStockItems: 0,
        outOfStockItems: 0,
        needsRepairItems: 0
      })
    }
  }

  const handleDeleteItem = async (itemId: string) => {
    if (confirm('Are you sure you want to delete this stock item? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/admin/stock?id=${itemId}`, {
          method: 'DELETE'
        })
        
        if (!response.ok) {
          throw new Error('Failed to delete stock item')
        }
        
        // Refresh the data after deletion
        await fetchStockItems()
        await fetchStats()
      } catch (error) {
        console.error('Error deleting stock item:', error)
        alert('Failed to delete stock item. Please try again.')
      }
    }
  }

  const filteredItems = stockItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.model.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
    const matchesType = typeFilter === 'all' || item.type === typeFilter
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    const matchesCondition = conditionFilter === 'all' || item.condition === conditionFilter
    
    return matchesSearch && matchesCategory && matchesType && matchesStatus && matchesCondition
  })

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'quantity':
        return b.quantity - a.quantity
      case 'value':
        return b.totalValue - a.totalValue
      case 'lastUpdated':
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      case 'status':
        return a.status.localeCompare(b.status)
      default:
        return a.name.localeCompare(b.name)
    }
  })

  const categories = [...new Set(stockItems.map(item => item.category))]
  const types = ['robot', 'component', 'tool', 'accessory']
  const statuses = ['in_stock', 'low_stock', 'out_of_stock', 'discontinued']
  const conditions = ['new', 'good', 'fair', 'needs_repair', 'damaged']

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in_stock': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'low_stock': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'out_of_stock': return <XCircle className="h-4 w-4 text-red-500" />
      case 'discontinued': return <XCircle className="h-4 w-4 text-gray-500" />
      default: return null
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      'in_stock': 'default',
      'low_stock': 'secondary',
      'out_of_stock': 'destructive',
      'discontinued': 'outline'
    }
    return <Badge variant={variants[status] || 'outline'}>{status.replace('_', ' ')}</Badge>
  }

  const getConditionBadge = (condition: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      'new': 'default',
      'good': 'secondary',
      'fair': 'outline',
      'needs_repair': 'destructive',
      'damaged': 'destructive'
    }
    return <Badge variant={variants[condition] || 'outline'}>{condition.replace('_', ' ')}</Badge>
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'robot': return <Package className="h-4 w-4 text-blue-500" />
      case 'component': return <Cpu className="h-4 w-4 text-green-500" />
      case 'tool': return <Wrench className="h-4 w-4 text-orange-500" />
      case 'accessory': return <Battery className="h-4 w-4 text-purple-500" />
      default: return <Package className="h-4 w-4 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg">Loading stock data...</div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Stock Management</h1>
              <p className="text-muted-foreground">
                Manage robot inventory, components, and equipment
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => router.push('/admin/stock/reports')}>
                <BarChart3 className="h-4 w-4 mr-2" />
                Reports
              </Button>
              <Button onClick={() => router.push('/admin/stock/add')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Stock
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-7">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Items</p>
                    <p className="text-2xl font-bold">{stats.totalItems}</p>
                  </div>
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Value</p>
                    <p className="text-2xl font-bold">₹{stats.totalValue.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Robots</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.robotsCount}</p>
                  </div>
                  <Package className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Components</p>
                    <p className="text-2xl font-bold text-green-600">{stats.componentsCount}</p>
                  </div>
                  <Cpu className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Low Stock</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.lowStockItems}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Out of Stock</p>
                    <p className="text-2xl font-bold text-red-600">{stats.outOfStockItems}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Needs Repair</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.needsRepairItems}</p>
                  </div>
                  <Wrench className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search items, brands, models..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {types.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {statuses.map(status => (
                      <SelectItem key={status} value={status}>{status.replace('_', ' ')}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={conditionFilter} onValueChange={setConditionFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Conditions</SelectItem>
                    {conditions.map(condition => (
                      <SelectItem key={condition} value={condition}>{condition.replace('_', ' ')}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="quantity">Quantity</SelectItem>
                    <SelectItem value="value">Value</SelectItem>
                    <SelectItem value="lastUpdated">Last Updated</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Stock Table */}
          <Card>
            <CardHeader>
              <CardTitle>Stock Inventory ({sortedItems.length})</CardTitle>
              <CardDescription>Complete inventory of robots, components, and equipment</CardDescription>
            </CardHeader>
            <CardContent>
              {sortedItems.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium">No stock items found</p>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || categoryFilter !== 'all' || typeFilter !== 'all' || statusFilter !== 'all' || conditionFilter !== 'all'
                      ? 'Try adjusting your filters'
                      : 'Add your first stock item to get started'
                    }
                  </p>
                  <Button onClick={() => router.push('/admin/stock/add')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Stock Item
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item Details</TableHead>
                      <TableHead>Type & Category</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedItems.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell>
                          <div className="flex items-start gap-3">
                            {item.image && (
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="w-12 h-12 rounded object-cover"
                              />
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">{item.brand} {item.model}</p>
                              <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              {getTypeIcon(item.type)}
                              <Badge variant="outline">{item.type}</Badge>
                            </div>
                            <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <p className="text-2xl font-bold">{item.quantity}</p>
                            <p className="text-xs text-muted-foreground">Min: {item.minQuantity}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">₹{item.totalValue.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">₹{item.unitPrice}/unit</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{item.location}</p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(item.status)}
                            {getStatusBadge(item.status)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getConditionBadge(item.condition)}
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
                              <DropdownMenuItem onClick={() => router.push(`/admin/stock/${item._id}`)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/admin/stock/${item._id}/history`)}>
                                <BarChart3 className="h-4 w-4 mr-2" />
                                View History
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => handleDeleteItem(item._id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
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
      </AdminLayout>
    )
}