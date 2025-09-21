"use client"

import { useState } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import {
  ArrowLeft,
  Upload,
  FileText,
  File,
  Image,
  Video,
  Archive,
  Save,
  X,
  Plus,
  Trash2,
  Eye,
  Download,
  FolderOpen,
  Tag,
  Lock,
  Globe
} from "lucide-react"
import { toast } from "sonner"

interface DocumentFormData {
  title: string
  description: string
  category: string
  tags: string[]
  isPublic: boolean
  requiresPermission: boolean
  allowDownload: boolean
  expiryDate: string
  version: string
  authorName: string
  authorEmail: string
  files: File[]
}

interface UploadedFile {
  file: File
  name: string
  size: number
  type: string
  preview?: string
}

export default function DocumentUploadPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [newTag, setNewTag] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const [formData, setFormData] = useState<DocumentFormData>({
    title: '',
    description: '',
    category: '',
    tags: [],
    isPublic: true,
    requiresPermission: false,
    allowDownload: true,
    expiryDate: '',
    version: '1.0',
    authorName: '',
    authorEmail: '',
    files: []
  })

  const handleInputChange = (field: keyof DocumentFormData, value: string | boolean | string[] | File[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    handleFiles(files)
  }

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        toast.error(`File ${file.name} is too large (max 50MB)`)
        return false
      }
      return true
    })

    const newUploadedFiles: UploadedFile[] = validFiles.map(file => ({
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }))

    setUploadedFiles(prev => [...prev, ...newUploadedFiles])
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...validFiles]
    }))
  }

  const removeFile = (index: number) => {
    const fileToRemove = uploadedFiles[index]
    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview)
    }
    
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }))
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast.error('Document title is required')
      return
    }

    if (formData.files.length === 0) {
      toast.error('Please upload at least one file')
      return
    }

    if (!formData.category) {
      toast.error('Please select a category')
      return
    }

    setLoading(true)

    try {
      const submitData = new FormData()
      
      // Add text fields
      submitData.append('title', formData.title)
      submitData.append('description', formData.description)
      submitData.append('category', formData.category)
      submitData.append('tags', JSON.stringify(formData.tags))
      submitData.append('isPublic', formData.isPublic.toString())
      submitData.append('requiresPermission', formData.requiresPermission.toString())
      submitData.append('allowDownload', formData.allowDownload.toString())
      submitData.append('expiryDate', formData.expiryDate)
      submitData.append('version', formData.version)
      submitData.append('authorName', formData.authorName)
      submitData.append('authorEmail', formData.authorEmail)

      // Add files
      formData.files.forEach((file, index) => {
        submitData.append(`files`, file)
      })

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: submitData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to upload documents')
      }

      toast.success('Documents uploaded successfully!')
      router.push('/admin/documents')
    } catch (error) {
      console.error('Error uploading documents:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to upload documents')
    } finally {
      setLoading(false)
    }
  }

  const documentCategories = [
    'Academic Resources',
    'Project Reports',
    'Meeting Minutes',
    'Workshop Materials',
    'Competition Guidelines',
    'Technical Documentation',
    'Presentations',
    'Research Papers',
    'Certificates',
    'Forms & Applications',
    'Policies & Rules',
    'Archive',
    'Other'
  ]

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-5 w-5 text-blue-500" />
    if (type.startsWith('video/')) return <Video className="h-5 w-5 text-purple-500" />
    if (type.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />
    if (type.includes('word') || type.includes('document')) return <FileText className="h-5 w-5 text-blue-600" />
    if (type.includes('zip') || type.includes('rar')) return <Archive className="h-5 w-5 text-orange-500" />
    return <File className="h-5 w-5 text-gray-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* Header */}
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
              <h1 className="text-2xl font-bold">Upload Documents</h1>
              <p className="text-muted-foreground">
                Upload and manage documents for the robotics club
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* File Upload Area */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    File Upload
                  </CardTitle>
                  <CardDescription>
                    Drag and drop files or click to browse (Max 50MB per file)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Drop Zone */}
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDragEnter={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setDragActive(true)
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setDragActive(false)
                    }}
                    onDragOver={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onDrop={handleDrop}
                  >
                    <FolderOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium mb-2">Drop files here or click to browse</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Supports PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, images, videos, and archives
                    </p>
                    <Input
                      type="file"
                      multiple
                      onChange={handleFileInput}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.mp4,.mov,.zip,.rar"
                    />
                    <Button type="button" variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Files
                    </Button>
                  </div>

                  {/* Uploaded Files List */}
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium">Uploaded Files ({uploadedFiles.length})</h4>
                      <div className="space-y-2">
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            {file.preview ? (
                              <img 
                                src={file.preview} 
                                alt={file.name}
                                className="w-10 h-10 object-cover rounded"
                              />
                            ) : (
                              getFileIcon(file.type)
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{file.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatFileSize(file.size)} • {file.type}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {file.preview && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => window.open(file.preview, '_blank')}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Document Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Document Information
                  </CardTitle>
                  <CardDescription>
                    Provide details about the documents
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter document title"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {documentCategories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Brief description of the documents"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="version">Version</Label>
                    <Input
                      id="version"
                      value={formData.version}
                      onChange={(e) => handleInputChange('version', e.target.value)}
                      placeholder="e.g., 1.0, 2.1"
                    />
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add a tag"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      />
                      <Button type="button" onClick={addTag}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map((tag) => (
                        <div key={tag} className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm">
                          <Tag className="h-3 w-3" />
                          {tag}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0"
                            onClick={() => removeTag(tag)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Author Information */}
            <Card>
              <CardHeader>
                <CardTitle>Author Information</CardTitle>
                <CardDescription>Information about the document author</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="authorName">Author Name</Label>
                    <Input
                      id="authorName"
                      value={formData.authorName}
                      onChange={(e) => handleInputChange('authorName', e.target.value)}
                      placeholder="Document author name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="authorEmail">Author Email</Label>
                    <Input
                      id="authorEmail"
                      type="email"
                      value={formData.authorEmail}
                      onChange={(e) => handleInputChange('authorEmail', e.target.value)}
                      placeholder="author@example.com"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Access & Permissions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Access & Permissions
                </CardTitle>
                <CardDescription>Configure document access and visibility</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
                    <Input
                      id="expiryDate"
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Public Access
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Make documents visible to all users
                      </p>
                    </div>
                    <Switch
                      checked={formData.isPublic}
                      onCheckedChange={(checked) => handleInputChange('isPublic', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Require Permission
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Require admin approval to access documents
                      </p>
                    </div>
                    <Switch
                      checked={formData.requiresPermission}
                      onCheckedChange={(checked) => handleInputChange('requiresPermission', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Allow Download
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Allow users to download documents
                      </p>
                    </div>
                    <Switch
                      checked={formData.allowDownload}
                      onCheckedChange={(checked) => handleInputChange('allowDownload', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button type="submit" disabled={loading || uploadedFiles.length === 0}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Uploading...' : 'Upload Documents'}
              </Button>
            </div>
          </form>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}