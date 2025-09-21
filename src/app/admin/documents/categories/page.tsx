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
  DialogTrigger,
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
  FolderOpen,
  FileText,
  Search,
  Tag,
  Save,
  X,
  AlertCircle,
  Settings,
  Archive,
  Eye,
  Users
} from "lucide-react"
import { toast } from "sonner"

interface DocumentCategory {
  id: string
  name: string
  description: string
  slug: string
  color: string
  icon: string
  documentCount: number
  isPublic: boolean
  isActive: boolean
  parentId?: string
  sortOrder: number
  createdAt: string
  updatedAt: string
}

interface CategoryFormData {
  name: string
  description: string
  slug: string
  color: string
  icon: string
  isPublic: boolean
  isActive: boolean
  parentId: string
  sortOrder: number
}

export default function DocumentCategoriesPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<DocumentCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<DocumentCategory | null>(null)
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    slug: '',
    color: 'blue',
    icon: 'FolderOpen',
    isPublic: true,
    isActive: true,
    parentId: '',
    sortOrder: 1
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      // Simulate API call - replace with actual API
      const mockCategories: DocumentCategory[] = [
        {
          id: '1',
          name: 'Academic Resources',
          description: 'Academic materials, syllabi, and educational content',
          slug: 'academic-resources',
          color: 'blue',
          icon: 'FolderOpen',
          documentCount: 45,
          isPublic: true,
          isActive: true,
          sortOrder: 1,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          name: 'Project Reports',
          description: 'Student project reports and documentation',
          slug: 'project-reports',
          color: 'green',
          icon: 'FileText',
          documentCount: 32,
          isPublic: true,
          isActive: true,
          sortOrder: 2,
          createdAt: '2024-01-16T10:00:00Z',
          updatedAt: '2024-01-16T10:00:00Z'
        },
        {
          id: '3',
          name: 'Meeting Minutes',
          description: 'Club meeting minutes and records',
          slug: 'meeting-minutes',
          color: 'purple',
          icon: 'FileText',
          documentCount: 18,
          isPublic: false,
          isActive: true,
          sortOrder: 3,
          createdAt: '2024-01-17T10:00:00Z',
          updatedAt: '2024-01-17T10:00:00Z'
        },
        {
          id: '4',
          name: 'Workshop Materials',
          description: 'Materials and resources for workshops',
          slug: 'workshop-materials',
          color: 'orange',
          icon: 'FolderOpen',
          documentCount: 28,
          isPublic: true,
          isActive: true,
          sortOrder: 4,
          createdAt: '2024-01-18T10:00:00Z',
          updatedAt: '2024-01-18T10:00:00Z'
        },
        {
          id: '5',
          name: 'Competition Guidelines',
          description: 'Rules and guidelines for competitions',
          slug: 'competition-guidelines',
          color: 'red',
          icon: 'Tag',
          documentCount: 12,
          isPublic: true,
          isActive: true,
          sortOrder: 5,
          createdAt: '2024-01-19T10:00:00Z',
          updatedAt: '2024-01-19T10:00:00Z'
        },
        {
          id: '6',
          name: 'Technical Documentation',
          description: 'Technical guides and documentation',
          slug: 'technical-documentation',
          color: 'indigo',
          icon: 'Settings',
          documentCount: 24,
          isPublic: true,
          isActive: true,
          sortOrder: 6,
          createdAt: '2024-01-20T10:00:00Z',
          updatedAt: '2024-01-20T10:00:00Z'
        },
        {
          id: '7',
          name: 'Archive',
          description: 'Archived documents and historical records',
          slug: 'archive',
          color: 'gray',
          icon: 'Archive',
          documentCount: 67,
          isPublic: false,
          isActive: false,
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
      description: '',
      slug: '',
      color: 'blue',
      icon: 'FolderOpen',
      isPublic: true,
      isActive: true,
      parentId: '',
      sortOrder: categories.length + 1
    })
    setDialogOpen(true)
  }

  const handleEditCategory = (category: DocumentCategory) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description,
      slug: category.slug,
      color: category.color,
      icon: category.icon,
      isPublic: category.isPublic,
      isActive: category.isActive,
      parentId: category.parentId || '',
      sortOrder: category.sortOrder
    })
    setDialogOpen(true)
  }

  const handleDeleteCategory = async (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId)
    if (!category) return

    if (category.documentCount > 0) {
      toast.error('Cannot delete category with documents. Move documents first.')
      return
    }

    if (confirm('Are you sure you want to delete this category?')) {
      try {
        // Simulate API call
        setCategories(prev => prev.filter(c => c.id !== categoryId))
        toast.success('Category deleted successfully')
      } catch (error) {
        console.error('Error deleting category:', error)
        toast.error('Failed to delete category')
      }
    }
  }

  const handleToggleStatus = async (categoryId: string, field: 'isActive' | 'isPublic') => {
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
        const updatedCategory: DocumentCategory = {
          ...editingCategory,
          name: formData.name,
          description: formData.description,
          slug: formData.slug,
          color: formData.color,
          icon: formData.icon,
          isPublic: formData.isPublic,
          isActive: formData.isActive,
          parentId: formData.parentId || undefined,
          sortOrder: formData.sortOrder,
          updatedAt: new Date().toISOString()
        }
        
        setCategories(prev => prev.map(c => c.id === editingCategory.id ? updatedCategory : c))
        toast.success('Category updated successfully')
      } else {
        // Create new category
        const newCategory: DocumentCategory = {
          id: Date.now().toString(),
          name: formData.name,
          description: formData.description,
          slug: formData.slug,
          color: formData.color,
          icon: formData.icon,
          documentCount: 0,
          isPublic: formData.isPublic,
          isActive: formData.isActive,
          parentId: formData.parentId || undefined,
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
                         (filterStatus === 'public' && category.isPublic) ||
                         (filterStatus === 'private' && !category.isPublic)
    
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
    { name: 'Pink', value: 'pink' }
  ]

  const icons = [
    { name: 'Folder', value: 'FolderOpen' },
    { name: 'File', value: 'FileText' },
    { name: 'Tag', value: 'Tag' },
    { name: 'Settings', value: 'Settings' },
    { name: 'Archive', value: 'Archive' },
    { name: 'Users', value: 'Users' },
    { name: 'Eye', value: 'Eye' },
    { name: 'Alert', value: 'AlertCircle' }
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
      pink: 'bg-pink-100 text-pink-800'
    }
    return colorClasses[color as keyof typeof colorClasses] || colorClasses.blue
  }

  const getIconComponent = (iconName: string) => {
    const iconComponents = {
      FolderOpen: <FolderOpen className="h-4 w-4" />,
      FileText: <FileText className="h-4 w-4" />,
      Tag: <Tag className="h-4 w-4" />,
      Settings: <Settings className="h-4 w-4" />,
      Archive: <Archive className="h-4 w-4" />,
      Users: <Users className="h-4 w-4" />,
      Eye: <Eye className="h-4 w-4" />,
      AlertCircle: <AlertCircle className="h-4 w-4" />
    }
    return iconComponents[iconName as keyof typeof iconComponents] || iconComponents.FolderOpen
  }

  const stats = {
    total: categories.length,
    active: categories.filter(c => c.isActive).length,
    public: categories.filter(c => c.isPublic).length,
    totalDocuments: categories.reduce((sum, c) => sum + c.documentCount, 0)
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
                <h1 className="text-2xl font-bold">Document Categories</h1>
                <p className="text-muted-foreground">
                  Organize and manage document categories
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
                  <FolderOpen className="h-8 w-8 text-muted-foreground" />
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
                    <p className="text-sm text-muted-foreground">Public</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.public}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Documents</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.totalDocuments}</p>
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
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Categories Table */}
          <Card>
            <CardHeader>
              <CardTitle>Categories ({filteredCategories.length})</CardTitle>
              <CardDescription>Manage document categories and their settings</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredCategories.length === 0 ? (
                <div className="text-center py-8">
                  <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
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
                      <TableHead>Documents</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Visibility</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCategories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${getColorClass(category.color)}`}>
                              {getIconComponent(category.icon)}
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
                            <span className="font-medium">{category.documentCount}</span>
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
                            className={category.isPublic ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}
                          >
                            {category.isPublic ? 'Public' : 'Private'}
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
                                <Eye className="h-4 w-4 mr-2" />
                                {category.isActive ? 'Deactivate' : 'Activate'}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleStatus(category.id, 'isPublic')}>
                                <Users className="h-4 w-4 mr-2" />
                                Make {category.isPublic ? 'Private' : 'Public'}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => handleDeleteCategory(category.id)}
                                disabled={category.documentCount > 0}
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
                  {editingCategory ? 'Update category information and settings' : 'Create a new document category'}
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
                    <Label htmlFor="icon">Icon</Label>
                    <Select value={formData.icon} onValueChange={(value) => handleInputChange('icon', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select icon" />
                      </SelectTrigger>
                      <SelectContent>
                        {icons.map(icon => (
                          <SelectItem key={icon.value} value={icon.value}>
                            <div className="flex items-center gap-2">
                              {getIconComponent(icon.value)}
                              {icon.name}
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
                    <Label>Public Category</Label>
                    <p className="text-sm text-muted-foreground">
                      Make this category visible to all users
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.isPublic}
                    onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                    className="toggle"
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label>Active Category</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable this category for document uploads
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
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