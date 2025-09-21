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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  EyeOff,
  Star,
  Calendar,
  User,
  FileText,
  TrendingUp
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Blog {
  _id: string
  title: string
  slug: string
  summary: string
  content: string
  author: string
  authorImage: string
  published: string
  image: string
  tags: string[]
  category: string
  visibility: boolean
  featured: boolean
  readTime: number
  views: number
  likes: number
  comments: Array<{
    user: string
    comment: string
    createdAt: string
  }>
  createdAt: string
  updatedAt: string
}

export default function BlogsManagementPage() {
  const router = useRouter()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('createdAt')
  const [stats, setStats] = useState({
    totalBlogs: 0,
    publishedBlogs: 0,
    draftBlogs: 0,
    featuredBlogs: 0,
    totalViews: 0,
    totalLikes: 0
  })

  useEffect(() => {
    fetchBlogs()
    fetchStats()
  }, [])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/blogs')
      if (!response.ok) {
        throw new Error('Failed to fetch blogs')
      }
      const data = await response.json()
      setBlogs(data.blogs || [])
    } catch (error) {
      console.error('Error fetching blogs:', error)
      // Fallback to empty array if API fails
      setBlogs([])
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/blogs')
      if (!response.ok) {
        throw new Error('Failed to fetch blog stats')
      }
      const data = await response.json()
      
      // Calculate stats from the blogs data
      const totalBlogs = data.blogs?.length || 0
      const publishedBlogs = data.blogs?.filter((blog: Blog) => blog.visibility).length || 0
      const draftBlogs = totalBlogs - publishedBlogs
      const featuredBlogs = data.blogs?.filter((blog: Blog) => blog.featured).length || 0
      const totalViews = data.blogs?.reduce((sum: number, blog: Blog) => sum + blog.views, 0) || 0
      const totalLikes = data.blogs?.reduce((sum: number, blog: Blog) => sum + blog.likes, 0) || 0
      
      setStats({
        totalBlogs,
        publishedBlogs,
        draftBlogs,
        featuredBlogs,
        totalViews,
        totalLikes
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
      // Fallback to default stats if API fails
      setStats({
        totalBlogs: 0,
        publishedBlogs: 0,
        draftBlogs: 0,
        featuredBlogs: 0,
        totalViews: 0,
        totalLikes: 0
      })
    }
  }

  const handleTogglePublished = async (blogId: string, visibility: boolean) => {
    try {
      const response = await fetch(`/api/blogs?id=${blogId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          visibility: !visibility
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to update blog visibility')
      }
      
      // Refresh the data after update
      await fetchBlogs()
      await fetchStats()
    } catch (error) {
      console.error('Error updating blog visibility:', error)
      alert('Failed to update blog visibility. Please try again.')
    }
  }

  const handleToggleFeatured = async (blogId: string, featured: boolean) => {
    try {
      const response = await fetch(`/api/blogs?id=${blogId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          featured: !featured
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to update blog featured status')
      }
      
      // Refresh the data after update
      await fetchBlogs()
      await fetchStats()
    } catch (error) {
      console.error('Error updating blog featured status:', error)
      alert('Failed to update blog featured status. Please try again.')
    }
  }

  const handleDeleteBlog = async (blogId: string) => {
    if (confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/blogs?id=${blogId}`, {
          method: 'DELETE'
        })
        
        if (!response.ok) {
          throw new Error('Failed to delete blog')
        }
        
        // Refresh the data after deletion
        await fetchBlogs()
        await fetchStats()
      } catch (error) {
        console.error('Error deleting blog:', error)
        alert('Failed to delete blog. Please try again.')
      }
    }
  }

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.summary.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' ||
                         (statusFilter === 'published' && blog.visibility) ||
                         (statusFilter === 'draft' && !blog.visibility)
    
    const matchesCategory = categoryFilter === 'all' ||
                           blog.category === categoryFilter
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  const sortedBlogs = [...filteredBlogs].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title)
      case 'author':
        return a.author.localeCompare(b.author)
      case 'views':
        return b.views - a.views
      case 'likes':
        return b.likes - a.likes
      case 'publishedAt':
        return new Date(b.published).getTime() - new Date(a.published).getTime()
      case 'createdAt':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  const categories = [...new Set(blogs.map(blog => blog.category))]

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-lg">Loading blogs...</div>
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
            <div>
              <h1 className="text-2xl font-bold">Blog Management</h1>
              <p className="text-muted-foreground">
                Create, edit, and manage blog posts and articles
              </p>
            </div>
            <Button onClick={() => router.push('/admin/blogs/create')}>
              <Plus className="h-4 w-4 mr-2" />
              New Blog Post
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Posts</p>
                    <p className="text-2xl font-bold">{stats.totalBlogs}</p>
                  </div>
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Published</p>
                    <p className="text-2xl font-bold text-green-600">{stats.publishedBlogs}</p>
                  </div>
                  <Eye className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Drafts</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.draftBlogs}</p>
                  </div>
                  <EyeOff className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Featured</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.featuredBlogs}</p>
                  </div>
                  <Star className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Views</p>
                    <p className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Likes</p>
                    <p className="text-2xl font-bold">{stats.totalLikes.toLocaleString()}</p>
                  </div>
                  <User className="h-8 w-8 text-muted-foreground" />
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
                    placeholder="Search blogs by title or author..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
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

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Created Date</SelectItem>
                    <SelectItem value="publishedAt">Published Date</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="author">Author</SelectItem>
                    <SelectItem value="views">Views</SelectItem>
                    <SelectItem value="likes">Likes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Blogs Table */}
          <Card>
            <CardHeader>
              <CardTitle>Blog Posts ({sortedBlogs.length})</CardTitle>
              <CardDescription>Manage your blog posts and articles</CardDescription>
            </CardHeader>
            <CardContent>
              {sortedBlogs.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium">No blog posts found</p>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                      ? 'Try adjusting your filters'
                      : 'Create your first blog post to get started'
                    }
                  </p>
                  <Button onClick={() => router.push('/admin/blogs/create')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Blog Post
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title & Author</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Stats</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedBlogs.map((blog) => (
                      <TableRow key={blog._id}>
                        <TableCell>
                          <div className="flex items-start gap-3">
                            {blog.image && (
                              <img
                                src={blog.image}
                                alt={blog.title}
                                className="w-12 h-12 rounded object-cover"
                              />
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="font-medium truncate">{blog.title}</p>
                              <p className="text-sm text-muted-foreground truncate">{blog.summary}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Avatar className="h-4 w-4">
                                  <AvatarImage src={blog.authorImage} />
                                  <AvatarFallback className="text-xs">
                                    {blog.author.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-muted-foreground">{blog.author}</span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{blog.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {blog.visibility ? (
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                <Eye className="h-3 w-3 mr-1" />
                                Published
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                <EyeOff className="h-3 w-3 mr-1" />
                                Draft
                              </Badge>
                            )}
                            {blog.featured && (
                              <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                                <Star className="h-3 w-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="flex items-center gap-4">
                              <span>{blog.views} views</span>
                              <span>{blog.likes} likes</span>
                              <span>{blog.comments.length} comments</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {blog.visibility 
                                ? new Date(blog.published).toLocaleDateString()
                                : new Date(blog.createdAt).toLocaleDateString()
                              }
                            </div>
                          </div>
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
                              <DropdownMenuItem onClick={() => router.push(`/admin/blogs/${blog._id}`)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => window.open(`/blogs/${blog.slug}`, '_blank')}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Post
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleTogglePublished(blog._id, blog.visibility)}>
                                {blog.visibility ? (
                                  <>
                                    <EyeOff className="h-4 w-4 mr-2" />
                                    Unpublish
                                  </>
                                ) : (
                                  <>
                                    <Eye className="h-4 w-4 mr-2" />
                                    Publish
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleFeatured(blog._id, blog.featured)}>
                                <Star className="h-4 w-4 mr-2" />
                                {blog.featured ? 'Unfeature' : 'Feature'}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => handleDeleteBlog(blog._id)}
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
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}