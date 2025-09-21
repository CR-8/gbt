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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Tag,
  FileText,
  Search,
  Save,
  X,
  AlertCircle,
  Eye,
  EyeOff,
  BarChart3,
  TrendingUp,
  Users,
  Palette
} from "lucide-react"
import { toast } from "sonner"

interface BlogCategory {
  id: string
  name: string
  slug: string
  description: string
  color: string
  postCount: number
  isActive: boolean
  isFeatured: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

interface CategoryFormData {
  name: string
  slug: string
  description: string
  color: string
  isActive: boolean
  isFeatured: boolean
  sortOrder: number
}

export default function BlogCategoriesPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null)
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    slug: '',
    description: '',
    color: 'blue',
    isActive: true,
    isFeatured: false,
    sortOrder: 1
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      // Simulate API call - replace with actual API
      const mockCategories: BlogCategory[] = [
        {
          id: '1',
          name: 'Technology',
          slug: 'technology',
          description: 'Latest technology trends and innovations',
          color: 'blue',
          postCount: 42,
          isActive: true,
          isFeatured: true,
          sortOrder: 1,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          name: 'Robotics',
          slug: 'robotics',
          description: 'Robotics projects, tutorials, and competitions',
          color: 'green',
          postCount: 38,
          isActive: true,
          isFeatured: true,
          sortOrder: 2,
          createdAt: '2024-01-16T10:00:00Z',
          updatedAt: '2024-01-16T10:00:00Z'
        },
        {
          id: '3',
          name: 'AI & Machine Learning',
          slug: 'ai-ml',
          description: 'Artificial intelligence and machine learning insights',
          color: 'purple',
          postCount: 29,
          isActive: true,
          isFeatured: true,
          sortOrder: 3,
          createdAt: '2024-01-17T10:00:00Z',
          updatedAt: '2024-01-17T10:00:00Z'
        },
        {
          id: '4',
          name: 'Competitions',
          slug: 'competitions',
          description: 'Competition updates, results, and announcements',
          color: 'orange',
          postCount: 24,
          isActive: true,
          isFeatured: false,
          sortOrder: 4,
          createdAt: '2024-01-18T10:00:00Z',
          updatedAt: '2024-01-18T10:00:00Z'
        },
        {
          id: '5',
          name: 'Tutorials',
          slug: 'tutorials',
          description: 'Step-by-step tutorials and guides',
          color: 'indigo',
          postCount: 35,
          isActive: true,
          isFeatured: false,
          sortOrder: 5,
          createdAt: '2024-01-19T10:00:00Z',
          updatedAt: '2024-01-19T10:00:00Z'
        },
        {
          id: '6',
          name: 'Club News',
          slug: 'club-news',
          description: 'Club announcements and news updates',
          color: 'red',
          postCount: 18,
          isActive: true,
          isFeatured: false,
          sortOrder: 6,
          createdAt: '2024-01-20T10:00:00Z',
          updatedAt: '2024-01-20T10:00:00Z'
        },
        {
          id: '7',
          name: 'Industry Insights',
          slug: 'industry-insights',
          description: 'Industry trends and professional insights',
          color: 'gray',
          postCount: 12,
          isActive: false,
          isFeatured: false,
          sortOrder: 7,
          createdAt: '2024-01-21T10:00:00Z',
          updatedAt: '2024-01-21T10:00:00Z'
        }
      ]
      
      setCategories(mockCategories)
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof CategoryFormData, value: string | boolean | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: editingCategory ? prev.slug : generateSlug(name)
    }))
  }

  const handleCreateCategory = () => {
    setEditingCategory(null)
    setFormData({
      name: '',
      slug: '',
      description: '',
      color: 'blue',
      isActive: true,
      isFeatured: false,
      sortOrder: categories.length + 1
    })
    setDialogOpen(true)
  }

  const handleEditCategory = (category: BlogCategory) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
      color: category.color,
      isActive: category.isActive,
      isFeatured: category.isFeatured,
      sortOrder: category.sortOrder
    })
    setDialogOpen(true)
  }

  const handleDeleteCategory = async (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId)
    if (!category) return

    if (category.postCount > 0) {
      toast.error('Cannot delete category with posts. Move posts to another category first.')
      return
    }

    if (confirm('Are you sure you want to delete this category?')) {
      try {
        setCategories(prev => prev.filter(c => c.id !== categoryId))
        toast.success('Category deleted successfully')
      } catch (error) {
        console.error('Error deleting category:', error)
        toast.error('Failed to delete category')
      }
    }
  }

  const handleToggleStatus = async (categoryId: string, field: 'isActive' | 'isFeatured') => {
    try {
      setCategories(prev => 
        prev.map(category => 
          category.id === categoryId 
            ? { ...category, [field]: !category[field] }
            : category
        )
      )
      toast.success(`Category ${field} updated successfully`)
    } catch (error) {
      console.error('Error updating category:', error)
      toast.error('Failed to update category')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error('Category name is required')
      return
    }

    if (!formData.slug.trim()) {
      toast.error('Category slug is required')
      return
    }

    // Check for duplicate slug
    const duplicateSlug = categories.find(c => 
      c.slug === formData.slug && c.id !== editingCategory?.id
    )
    if (duplicateSlug) {
      toast.error('Slug already exists. Please choose a different one.')
      return
    }

    try {
      if (editingCategory) {
        // Update existing category
        const updatedCategory: BlogCategory = {
          ...editingCategory,
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
          color: formData.color,
          isActive: formData.isActive,
          isFeatured: formData.isFeatured,
          sortOrder: formData.sortOrder,
          updatedAt: new Date().toISOString()
        }
        
        setCategories(prev => prev.map(c => c.id === editingCategory.id ? updatedCategory : c))
        toast.success('Category updated successfully')
      } else {
        // Create new category
        const newCategory: BlogCategory = {
          id: Date.now().toString(),
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
          color: formData.color,
          postCount: 0,
          isActive: formData.isActive,
          isFeatured: formData.isFeatured,
          sortOrder: formData.sortOrder,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        setCategories(prev => [...prev, newCategory])
        toast.success('Category created successfully')
      }

      setDialogOpen(false)
    } catch (error) {
      console.error('Error saving category:', error)
      toast.error('Failed to save category')
    }
  }

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.slug.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' ||
                         (filterStatus === 'active' && category.isActive) ||
                         (filterStatus === 'inactive' && !category.isActive) ||
                         (filterStatus === 'featured' && category.isFeatured)
    
    return matchesSearch && matchesStatus
  })

  const colors = [
    { name: 'Blue', value: 'blue' },
    { name: 'Green', value: 'green' },
    { name: 'Purple', value: 'purple' },
    { name: 'Orange', value: 'orange' },
    { name: 'Red', value: 'red' },
    { name: 'Indigo', value: 'indigo' },
    { name: 'Gray', value: 'gray' },
    { name: 'Pink', value: 'pink' },
    { name: 'Yellow', value: 'yellow' },
    { name: 'Teal', value: 'teal' }
  ]

  const getColorClass = (color: string) => {
    const colorClasses = {
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      purple: 'bg-purple-100 text-purple-800',
      orange: 'bg-orange-100 text-orange-800',
      red: 'bg-red-100 text-red-800',
      indigo: 'bg-indigo-100 text-indigo-800',
      gray: 'bg-gray-100 text-gray-800',
      pink: 'bg-pink-100 text-pink-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      teal: 'bg-teal-100 text-teal-800'
    }
    return colorClasses[color as keyof typeof colorClasses] || colorClasses.blue
  }

  const stats = {
    total: categories.length,
    active: categories.filter(c => c.isActive).length,
    featured: categories.filter(c => c.isFeatured).length,
    totalPosts: categories.reduce((sum, c) => sum + c.postCount, 0)
  }

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-lg">Loading categories...</div>
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Blog Categories</h1>
                <p className="text-muted-foreground">
                  Organize and manage blog post categories
                </p>
              </div>
            </div>
            <Button onClick={handleCreateCategory}>
              <Plus className="h-4 w-4 mr-2" />
              Create Category
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Categories</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                  <Tag className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active</p>
                    <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                  </div>
                  <Eye className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Featured</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.featured}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Posts</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.totalPosts}</p>
                  </div>
                  <FileText className="h-8 w-8 text-purple-500" />
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
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="featured">Featured</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Categories Table */}
          <Card>
            <CardHeader>
              <CardTitle>Categories ({filteredCategories.length})</CardTitle>
              <CardDescription>Manage blog categories and their settings</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredCategories.length === 0 ? (
                <div className="text-center py-8">
                  <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium">No categories found</p>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || filterStatus !== 'all'
                      ? 'Try adjusting your filters'
                      : 'Create your first category to get started'
                    }
                  </p>
                  <Button onClick={handleCreateCategory}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Category
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Posts</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Featured</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCategories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${getColorClass(category.color)}`}>
                              <Tag className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-medium">{category.name}</p>
                              <p className="text-sm text-muted-foreground">{category.description}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                            {category.slug}
                          </code>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{category.postCount}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={category.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                          >
                            {category.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={category.isFeatured ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}
                          >
                            {category.isFeatured ? 'Featured' : 'Normal'}
                          </Badge>
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
                              <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleToggleStatus(category.id, 'isActive')}>
                                {category.isActive ? (
                                  <>
                                    <EyeOff className="h-4 w-4 mr-2" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <Eye className="h-4 w-4 mr-2" />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleStatus(category.id, 'isFeatured')}>
                                <TrendingUp className="h-4 w-4 mr-2" />
                                {category.isFeatured ? 'Remove from Featured' : 'Mark as Featured'}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => handleDeleteCategory(category.id)}
                                disabled={category.postCount > 0}
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

          {/* Create/Edit Category Dialog */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? 'Edit Category' : 'Create New Category'}
                </DialogTitle>
                <DialogDescription>
                  {editingCategory ? 'Update category information and settings' : 'Create a new blog category'}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="Category name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => handleInputChange('slug', e.target.value)}
                      placeholder="category-slug"
                      required
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Category description"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <Select value={formData.color} onValueChange={(value) => handleInputChange('color', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent>
                        {colors.map(color => (
                          <SelectItem key={color.value} value={color.value}>
                            <div className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded ${getColorClass(color.value).split(' ')[0]}`} />
                              {color.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sortOrder">Sort Order</Label>
                    <Input
                      id="sortOrder"
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) => handleInputChange('sortOrder', parseInt(e.target.value) || 1)}
                      min="1"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label>Active Category</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable this category for new blog posts
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                    className="toggle"
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label>Featured Category</Label>
                    <p className="text-sm text-muted-foreground">
                      Show this category prominently on the blog
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                    className="toggle"
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    {editingCategory ? 'Update Category' : 'Create Category'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}