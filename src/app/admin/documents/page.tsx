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
  MoreHorizontal, 
  Edit, 
  Trash2, 
  FolderOpen,
  Download,
  Eye,
  Share2,
  Archive,
  Calendar,
  FileText,
  File,
  Image,
  Video,
  Lock,
  Globe,
  Users,
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

interface Document {
  _id: string
  title: string
  filename: string
  description: string
  category: string
  type: 'pdf' | 'doc' | 'docx' | 'ppt' | 'pptx' | 'xls' | 'xlsx' | 'txt' | 'image' | 'video' | 'other'
  size: number
  uploadedBy: {
    name: string
    email: string
    avatar?: string
  }
  uploadDate: string
  lastModified: string
  downloadCount: number
  visibility: 'public' | 'private' | 'team_only' | 'admin_only'
  tags: string[]
  url: string
  isArchived: boolean
  version: string
  accessPermissions: string[]
  expiryDate?: string
  notes: string
}

export default function DocumentManagementPage() {
  const router = useRouter()
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [visibilityFilter, setVisibilityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('uploadDate')
  const [stats, setStats] = useState({
    totalDocuments: 0,
    totalSize: 0,
    publicDocuments: 0,
    privateDocuments: 0,
    archivedDocuments: 0,
    totalDownloads: 0,
    documentsThisMonth: 0
  })

  useEffect(() => {
    fetchDocuments()
    fetchStats()
  }, [])

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/documents')
      if (!response.ok) {
        throw new Error('Failed to fetch documents')
      }
      const data = await response.json()
      setDocuments(data.documents || [])
    } catch (error) {
      console.error('Error fetching documents:', error)
      // Fallback to empty array if API fails
      setDocuments([])
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/documents')
      if (!response.ok) {
        throw new Error('Failed to fetch stats')
      }
      const data = await response.json()
      setStats(data.stats || {
        totalDocuments: 0,
        totalSize: 0,
        publicDocuments: 0,
        privateDocuments: 0,
        archivedDocuments: 0,
        totalDownloads: 0,
        documentsThisMonth: 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
      // Fallback to default stats if API fails
      setStats({
        totalDocuments: 0,
        totalSize: 0,
        publicDocuments: 0,
        privateDocuments: 0,
        archivedDocuments: 0,
        totalDownloads: 0,
        documentsThisMonth: 0
      })
    }
  }

  const handleDeleteDocument = async (documentId: string) => {
    if (confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/admin/documents?id=${documentId}`, {
          method: 'DELETE'
        })
        
        if (!response.ok) {
          throw new Error('Failed to delete document')
        }
        
        // Refresh the data after deletion
        await fetchDocuments()
        await fetchStats()
      } catch (error) {
        console.error('Error deleting document:', error)
        alert('Failed to delete document. Please try again.')
      }
    }
  }

  const handleArchiveDocument = async (documentId: string, isArchived: boolean) => {
    try {
      const response = await fetch(`/api/admin/documents/${documentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          isArchived: !isArchived
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to archive/unarchive document')
      }
      
      // Refresh the data after archiving
      await fetchDocuments()
      await fetchStats()
    } catch (error) {
      console.error('Error archiving document:', error)
      alert('Failed to archive/unarchive document. Please try again.')
    }
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter
    const matchesType = typeFilter === 'all' || doc.type === typeFilter
    const matchesVisibility = visibilityFilter === 'all' || doc.visibility === visibilityFilter
    
    return matchesSearch && matchesCategory && matchesType && matchesVisibility
  })

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title)
      case 'size':
        return b.size - a.size
      case 'downloads':
        return b.downloadCount - a.downloadCount
      case 'lastModified':
        return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
      default:
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    }
  })

  const categories = [...new Set(documents.map(doc => doc.category))]
  const types = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'image', 'video', 'other']
  const visibilities = ['public', 'private', 'team_only', 'admin_only']

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
      case 'doc':
      case 'docx':
      case 'txt':
        return <FileText className="h-4 w-4 text-red-500" />
      case 'ppt':
      case 'pptx':
        return <File className="h-4 w-4 text-orange-500" />
      case 'xls':
      case 'xlsx':
        return <File className="h-4 w-4 text-green-500" />
      case 'image':
        return <Image className="h-4 w-4 text-blue-500" />
      case 'video':
        return <Video className="h-4 w-4 text-purple-500" />
      default:
        return <File className="h-4 w-4 text-gray-500" />
    }
  }

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'public': return <Globe className="h-4 w-4 text-green-500" />
      case 'team_only': return <Users className="h-4 w-4 text-blue-500" />
      case 'admin_only': return <Lock className="h-4 w-4 text-red-500" />
      default: return <Lock className="h-4 w-4 text-gray-500" />
    }
  }

  const getVisibilityBadge = (visibility: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      'public': 'default',
      'team_only': 'secondary',
      'admin_only': 'destructive',
      'private': 'outline'
    }
    return <Badge variant={variants[visibility] || 'outline'}>{visibility.replace('_', ' ')}</Badge>
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg">Loading documents...</div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Document Management</h1>
              <p className="text-muted-foreground">
                Manage official documents, forms, and file resources
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => router.push('/admin/documents/archive')}>
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </Button>
              <Button onClick={() => router.push('/admin/documents/upload')}>
                <Plus className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-7">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Docs</p>
                    <p className="text-2xl font-bold">{stats.totalDocuments}</p>
                  </div>
                  <FolderOpen className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Size</p>
                    <p className="text-2xl font-bold">{formatFileSize(stats.totalSize)}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Public</p>
                    <p className="text-2xl font-bold text-green-600">{stats.publicDocuments}</p>
                  </div>
                  <Globe className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Private</p>
                    <p className="text-2xl font-bold text-red-600">{stats.privateDocuments}</p>
                  </div>
                  <Lock className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Archived</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.archivedDocuments}</p>
                  </div>
                  <Archive className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Downloads</p>
                    <p className="text-2xl font-bold">{stats.totalDownloads}</p>
                  </div>
                  <Download className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">This Month</p>
                    <p className="text-2xl font-bold">{stats.documentsThisMonth}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-orange-500" />
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
                    placeholder="Search documents, descriptions, tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
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

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="File Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {types.map(type => (
                      <SelectItem key={type} value={type}>{type.toUpperCase()}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Visibility</SelectItem>
                    {visibilities.map(visibility => (
                      <SelectItem key={visibility} value={visibility}>{visibility.replace('_', ' ')}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="uploadDate">Upload Date</SelectItem>
                    <SelectItem value="lastModified">Last Modified</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="size">File Size</SelectItem>
                    <SelectItem value="downloads">Downloads</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Documents Table */}
          <Card>
            <CardHeader>
              <CardTitle>Documents ({sortedDocuments.length})</CardTitle>
              <CardDescription>Manage official documents and file resources</CardDescription>
            </CardHeader>
            <CardContent>
              {sortedDocuments.length === 0 ? (
                <div className="text-center py-8">
                  <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium">No documents found</p>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || categoryFilter !== 'all' || typeFilter !== 'all' || visibilityFilter !== 'all'
                      ? 'Try adjusting your filters'
                      : 'Upload your first document to get started'
                    }
                  </p>
                  <Button onClick={() => router.push('/admin/documents/upload')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead>Category & Type</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Uploaded By</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Downloads</TableHead>
                      <TableHead>Visibility</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedDocuments.map((document) => (
                      <TableRow key={document._id} className={document.isArchived ? 'opacity-60' : ''}>
                        <TableCell>
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              {getFileIcon(document.type)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium flex items-center gap-2">
                                {document.title}
                                {document.isArchived && (
                                  <Badge variant="outline" className="text-xs">
                                    <Archive className="h-3 w-3 mr-1" />
                                    Archived
                                  </Badge>
                                )}
                              </p>
                              <p className="text-sm text-muted-foreground">{document.filename}</p>
                              <p className="text-xs text-muted-foreground line-clamp-2">{document.description}</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {document.tags.slice(0, 3).map(tag => (
                                  <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                                ))}
                                {document.tags.length > 3 && (
                                  <Badge variant="outline" className="text-xs">+{document.tags.length - 3}</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge variant="secondary">{document.category}</Badge>
                            <p className="text-xs text-muted-foreground uppercase">{document.type}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm font-medium">{formatFileSize(document.size)}</p>
                          {document.version && (
                            <p className="text-xs text-muted-foreground">v{document.version}</p>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={document.uploadedBy.avatar} />
                              <AvatarFallback className="text-xs">
                                {document.uploadedBy.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{document.uploadedBy.name}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span>{new Date(document.uploadDate).toLocaleDateString()}</span>
                            </div>
                            {document.lastModified !== document.uploadDate && (
                              <p className="text-xs text-muted-foreground">
                                Modified: {new Date(document.lastModified).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Download className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{document.downloadCount}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {getVisibilityIcon(document.visibility)}
                            {getVisibilityBadge(document.visibility)}
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
                              <DropdownMenuItem onClick={() => window.open(document.url, '_blank')}>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => window.open(document.url, '_blank')}>
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/admin/documents/${document._id}`)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Share2 className="h-4 w-4 mr-2" />
                                Share
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleArchiveDocument(document._id, document.isArchived)}>
                                <Archive className="h-4 w-4 mr-2" />
                                {document.isArchived ? 'Unarchive' : 'Archive'}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => handleDeleteDocument(document._id)}
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