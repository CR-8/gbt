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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  ArrowLeft,
  Save,
  Eye,
  Upload,
  X,
  Plus,
  Calendar,
  User,
  Tag,
  Image,
  FileText,
  Globe,
  Lock,
  Clock,
  Send,
  AlertCircle,
  RefreshCw
} from "lucide-react"
import { toast } from "sonner"

interface BlogPost {
  id?: string
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage: string
  category: string
  tags: string[]
  status: 'draft' | 'published' | 'scheduled'
  visibility: 'public' | 'private' | 'members'
  publishedAt?: string
  scheduledAt?: string
  author: string
  metaTitle: string
  metaDescription: string
  readingTime: number
}

interface BlogCategory {
  id: string
  name: string
  slug: string
  color: string
}

export default function CreateBlogPostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [activeTab, setActiveTab] = useState('content')
  const [tagInput, setTagInput] = useState('')
  const [formData, setFormData] = useState<BlogPost>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    category: '',
    tags: [],
    status: 'draft',
    visibility: 'public',
    author: 'Current User', // Would be fetched from auth context
    metaTitle: '',
    metaDescription: '',
    readingTime: 0
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    // Calculate reading time (approximately 200 words per minute)
    const wordCount = formData.content.split(/\s+/).filter(word => word.length > 0).length
    const readingTime = Math.max(1, Math.ceil(wordCount / 200))
    setFormData(prev => ({ ...prev, readingTime }))
  }, [formData.content])

  const fetchCategories = async () => {
    try {
      // Simulate API call - replace with actual API
      const mockCategories: BlogCategory[] = [
        { id: '1', name: 'Technology', slug: 'technology', color: 'blue' },
        { id: '2', name: 'Robotics', slug: 'robotics', color: 'green' },
        { id: '3', name: 'AI & Machine Learning', slug: 'ai-ml', color: 'purple' },
        { id: '4', name: 'Competitions', slug: 'competitions', color: 'orange' },
        { id: '5', name: 'Tutorials', slug: 'tutorials', color: 'indigo' },
        { id: '6', name: 'Club News', slug: 'club-news', color: 'red' },
        { id: '7', name: 'Industry Insights', slug: 'industry-insights', color: 'gray' }
      ]
      setCategories(mockCategories)
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('Failed to load categories')
    }
  }

  const handleInputChange = (field: keyof BlogPost, value: string | string[] | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
      metaTitle: title.length > 60 ? title.substring(0, 57) + '...' : title
    }))
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleImageUpload = async (file: File) => {
    try {
      // Simulate image upload
      const imageUrl = `/uploads/blog/${Date.now()}-${file.name}`
      setFormData(prev => ({ ...prev, featuredImage: imageUrl }))
      toast.success('Image uploaded successfully')
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Failed to upload image')
    }
  }

  const handleSaveDraft = async () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a title')
      return
    }

    try {
      setLoading(true)
      
      const blogPost = {
        ...formData,
        status: 'draft' as const,
        id: Date.now().toString()
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Draft saved successfully')
      router.push('/admin/blogs')
    } catch (error) {
      console.error('Error saving draft:', error)
      toast.error('Failed to save draft')
    } finally {
      setLoading(false)
    }
  }

  const handlePublish = async () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a title')
      return
    }

    if (!formData.content.trim()) {
      toast.error('Please add content to your blog post')
      return
    }

    if (!formData.category) {
      toast.error('Please select a category')
      return
    }

    try {
      setLoading(true)
      
      const blogPost = {
        ...formData,
        status: 'published' as const,
        publishedAt: new Date().toISOString(),
        id: Date.now().toString()
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Blog post published successfully!')
      router.push('/admin/blogs')
    } catch (error) {
      console.error('Error publishing post:', error)
      toast.error('Failed to publish blog post')
    } finally {
      setLoading(false)
    }
  }

  const handleSchedule = async () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a title')
      return
    }

    if (!formData.content.trim()) {
      toast.error('Please add content to your blog post')
      return
    }

    if (!formData.scheduledAt) {
      toast.error('Please select a schedule date and time')
      return
    }

    try {
      setLoading(true)
      
      const blogPost = {
        ...formData,
        status: 'scheduled' as const,
        id: Date.now().toString()
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Blog post scheduled successfully!')
      router.push('/admin/blogs')
    } catch (error) {
      console.error('Error scheduling post:', error)
      toast.error('Failed to schedule blog post')
    } finally {
      setLoading(false)
    }
  }

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'public': return <Globe className="h-4 w-4" />
      case 'private': return <Lock className="h-4 w-4" />
      case 'members': return <User className="h-4 w-4" />
      default: return <Globe className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
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
                <h1 className="text-2xl font-bold">Create Blog Post</h1>
                <p className="text-muted-foreground">
                  Write and publish a new blog post
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                disabled={loading}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button
                onClick={handlePublish}
                disabled={loading}
              >
                <Send className="h-4 w-4 mr-2" />
                Publish Now
              </Button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="seo">SEO & Meta</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Blog Content</CardTitle>
                      <CardDescription>Create your blog post content</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          placeholder="Enter blog post title"
                          value={formData.title}
                          onChange={(e) => handleTitleChange(e.target.value)}
                          className="text-lg font-medium"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="slug">URL Slug</Label>
                        <Input
                          id="slug"
                          placeholder="url-slug"
                          value={formData.slug}
                          onChange={(e) => handleInputChange('slug', e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          URL: /blogs/{formData.slug || 'your-post-slug'}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="excerpt">Excerpt</Label>
                        <Textarea
                          id="excerpt"
                          placeholder="Write a brief excerpt for your blog post..."
                          value={formData.excerpt}
                          onChange={(e) => handleInputChange('excerpt', e.target.value)}
                          rows={3}
                        />
                        <p className="text-xs text-muted-foreground">
                          {formData.excerpt.length}/200 characters
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="content">Content *</Label>
                        <Textarea
                          id="content"
                          placeholder="Write your blog post content here..."
                          value={formData.content}
                          onChange={(e) => handleInputChange('content', e.target.value)}
                          rows={15}
                          className="font-mono"
                        />
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{formData.content.split(/\s+/).filter(word => word.length > 0).length} words</span>
                          <span>~{formData.readingTime} min read</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="seo" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>SEO Optimization</CardTitle>
                      <CardDescription>Optimize your post for search engines</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="metaTitle">Meta Title</Label>
                        <Input
                          id="metaTitle"
                          placeholder="SEO-friendly title"
                          value={formData.metaTitle}
                          onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          {formData.metaTitle.length}/60 characters (optimal: 50-60)
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="metaDescription">Meta Description</Label>
                        <Textarea
                          id="metaDescription"
                          placeholder="Brief description for search results"
                          value={formData.metaDescription}
                          onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                          rows={3}
                        />
                        <p className="text-xs text-muted-foreground">
                          {formData.metaDescription.length}/160 characters (optimal: 150-160)
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label>Search Preview</Label>
                        <div className="border rounded-lg p-4 bg-gray-50">
                          <h3 className="text-blue-600 text-lg font-medium leading-tight">
                            {formData.metaTitle || formData.title || 'Your Blog Post Title'}
                          </h3>
                          <p className="text-green-700 text-sm">
                            yoursite.com/blogs/{formData.slug || 'your-post-slug'}
                          </p>
                          <p className="text-gray-600 text-sm mt-1">
                            {formData.metaDescription || formData.excerpt || 'Your meta description will appear here...'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="preview" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Post Preview</CardTitle>
                      <CardDescription>See how your post will look</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="prose max-w-none">
                        <h1 className="text-3xl font-bold mb-4">
                          {formData.title || 'Your Blog Post Title'}
                        </h1>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{formData.author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date().toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{formData.readingTime} min read</span>
                          </div>
                        </div>

                        {formData.featuredImage && (
                          <img
                            src={formData.featuredImage}
                            alt={formData.title}
                            className="w-full h-64 object-cover rounded-lg mb-6"
                          />
                        )}

                        {formData.excerpt && (
                          <p className="text-lg text-muted-foreground italic mb-6">
                            {formData.excerpt}
                          </p>
                        )}

                        <div className="whitespace-pre-wrap">
                          {formData.content || 'Your blog post content will appear here...'}
                        </div>

                        {formData.tags.length > 0 && (
                          <div className="mt-8 pt-6 border-t">
                            <h4 className="text-sm font-medium mb-2">Tags:</h4>
                            <div className="flex flex-wrap gap-2">
                              {formData.tags.map(tag => (
                                <Badge key={tag} variant="secondary">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Post Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Post Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value) => handleInputChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Visibility</Label>
                    <Select 
                      value={formData.visibility} 
                      onValueChange={(value) => handleInputChange('visibility', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            Public
                          </div>
                        </SelectItem>
                        <SelectItem value="private">
                          <div className="flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            Private
                          </div>
                        </SelectItem>
                        <SelectItem value="members">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Members Only
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.status === 'scheduled' && (
                    <div className="space-y-2">
                      <Label htmlFor="scheduledAt">Schedule Date & Time</Label>
                      <Input
                        id="scheduledAt"
                        type="datetime-local"
                        value={formData.scheduledAt}
                        onChange={(e) => handleInputChange('scheduledAt', e.target.value)}
                        min={new Date().toISOString().slice(0, 16)}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Category & Tags */}
              <Card>
                <CardHeader>
                  <CardTitle>Category & Tags</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => handleInputChange('category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add tag"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddTag}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Featured Image */}
              <Card>
                <CardHeader>
                  <CardTitle>Featured Image</CardTitle>
                </CardHeader>
                <CardContent>
                  {formData.featuredImage ? (
                    <div className="space-y-2">
                      <img
                        src={formData.featuredImage}
                        alt="Featured"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleInputChange('featuredImage', '')}
                      >
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Image className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">Upload featured image</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const input = document.createElement('input')
                          input.type = 'file'
                          input.accept = 'image/*'
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0]
                            if (file) handleImageUpload(file)
                          }
                          input.click()
                        }}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Choose Image
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {formData.status === 'scheduled' ? (
                    <Button 
                      className="w-full" 
                      onClick={handleSchedule}
                      disabled={loading}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Schedule Post
                    </Button>
                  ) : (
                    <Button 
                      className="w-full" 
                      onClick={handlePublish}
                      disabled={loading}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Publish Now
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleSaveDraft}
                    disabled={loading}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save as Draft
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}