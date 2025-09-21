"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/modules/layouts'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  Archive,
  RotateCcw as Restore,
  Trash2,
  MoreHorizontal,
  FileText,
  Search,
  Download,
  Calendar,
  User,
  FolderOpen,
  AlertTriangle,
  Eye,
  ExternalLink,
  Filter,
  RefreshCw
} from "lucide-react"
import { toast } from "sonner"

interface ArchivedDocument {
  id: string
  title: string
  filename: string
  originalPath: string
  category: string
  uploadedBy: string
  archivedBy: string
  archivedAt: string
  uploadedAt: string
  fileSize: number
  fileType: string
  reason: string
  canRestore: boolean
  downloadCount: number
  tags: string[]
}

export default function DocumentArchivePage() {
  const router = useRouter()
  const [archivedDocuments, setArchivedDocuments] = useState<ArchivedDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [selectedDocument, setSelectedDocument] = useState<ArchivedDocument | null>(null)
  const [bulkSelected, setBulkSelected] = useState<string[]>([])
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [showRestoreDialog, setShowRestoreDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    fetchArchivedDocuments()
  }, [])

  const fetchArchivedDocuments = async () => {
    try {
      setLoading(true)
      // Simulate API call - replace with actual API
      const mockArchived: ArchivedDocument[] = [
        {
          id: '1',
          title: 'Old Project Report 2022',
          filename: 'project-report-2022.pdf',
          originalPath: '/documents/projects/project-report-2022.pdf',
          category: 'Project Reports',
          uploadedBy: 'Alice Johnson',
          archivedBy: 'Admin User',
          archivedAt: '2024-01-10T14:30:00Z',
          uploadedAt: '2022-12-15T10:00:00Z',
          fileSize: 2458112,
          fileType: 'application/pdf',
          reason: 'Outdated content - new version available',
          canRestore: true,
          downloadCount: 45,
          tags: ['project', '2022', 'completed']
        },
        {
          id: '2',
          title: 'Workshop Materials v1.0',
          filename: 'workshop-materials-v1.zip',
          originalPath: '/documents/workshops/workshop-materials-v1.zip',
          category: 'Workshop Materials',
          uploadedBy: 'Bob Smith',
          archivedBy: 'Workshop Coordinator',
          archivedAt: '2024-01-15T09:20:00Z',
          uploadedAt: '2023-03-20T14:15:00Z',
          fileSize: 15728640,
          fileType: 'application/zip',
          reason: 'Superseded by v2.0',
          canRestore: true,
          downloadCount: 123,
          tags: ['workshop', 'materials', 'v1']
        },
        {
          id: '3',
          title: 'Competition Rules Draft',
          filename: 'competition-rules-draft.docx',
          originalPath: '/documents/competition/competition-rules-draft.docx',
          category: 'Competition Guidelines',
          uploadedBy: 'Carol Davis',
          archivedBy: 'Competition Committee',
          archivedAt: '2024-01-08T16:45:00Z',
          uploadedAt: '2023-08-10T11:30:00Z',
          fileSize: 524288,
          fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          reason: 'Draft version - final rules published',
          canRestore: false,
          downloadCount: 23,
          tags: ['competition', 'draft', 'rules']
        },
        {
          id: '4',
          title: 'Meeting Minutes Q1 2023',
          filename: 'meeting-minutes-q1-2023.pdf',
          originalPath: '/documents/meetings/meeting-minutes-q1-2023.pdf',
          category: 'Meeting Minutes',
          uploadedBy: 'David Wilson',
          archivedBy: 'Secretary',
          archivedAt: '2024-01-05T13:15:00Z',
          uploadedAt: '2023-04-01T09:00:00Z',
          fileSize: 1048576,
          fileType: 'application/pdf',
          reason: 'Quarterly archive - moved to long-term storage',
          canRestore: true,
          downloadCount: 78,
          tags: ['meeting', 'minutes', 'q1', '2023']
        },
        {
          id: '5',
          title: 'Tech Spec Legacy Format',
          filename: 'tech-spec-legacy.doc',
          originalPath: '/documents/technical/tech-spec-legacy.doc',
          category: 'Technical Documentation',
          uploadedBy: 'Eva Brown',
          archivedBy: 'Tech Lead',
          archivedAt: '2024-01-12T10:30:00Z',
          uploadedAt: '2023-01-15T16:20:00Z',
          fileSize: 2097152,
          fileType: 'application/msword',
          reason: 'Legacy format - migrated to new template',
          canRestore: true,
          downloadCount: 34,
          tags: ['technical', 'specification', 'legacy']
        },
        {
          id: '6',
          title: 'Academic Calendar 2023',
          filename: 'academic-calendar-2023.xlsx',
          originalPath: '/documents/academic/academic-calendar-2023.xlsx',
          category: 'Academic Resources',
          uploadedBy: 'Frank Miller',
          archivedBy: 'Academic Coordinator',
          archivedAt: '2024-01-20T08:00:00Z',
          uploadedAt: '2022-12-01T12:00:00Z',
          fileSize: 786432,
          fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          reason: 'Year ended - archived for reference',
          canRestore: false,
          downloadCount: 156,
          tags: ['academic', 'calendar', '2023']
        }
      ]
      
      setArchivedDocuments(mockArchived)
    } catch (error) {
      console.error('Error fetching archived documents:', error)
      toast.error('Failed to load archived documents')
    } finally {
      setLoading(false)
    }
  }

  const handleBulkSelect = (documentId: string) => {
    setBulkSelected(prev => {
      const newSelection = prev.includes(documentId)
        ? prev.filter(id => id !== documentId)
        : [...prev, documentId]
      
      setShowBulkActions(newSelection.length > 0)
      return newSelection
    })
  }

  const handleSelectAll = () => {
    const allIds = filteredDocuments.map(doc => doc.id)
    const allSelected = allIds.every(id => bulkSelected.includes(id))
    
    if (allSelected) {
      setBulkSelected([])
      setShowBulkActions(false)
    } else {
      setBulkSelected(allIds)
      setShowBulkActions(true)
    }
  }

  const handleRestore = async (documentId: string) => {
    const document = archivedDocuments.find(doc => doc.id === documentId)
    if (!document || !document.canRestore) {
      toast.error('Document cannot be restored')
      return
    }

    try {
      // Simulate API call
      setArchivedDocuments(prev => prev.filter(doc => doc.id !== documentId))
      toast.success(`${document.title} has been restored successfully`)
      setShowRestoreDialog(false)
      setSelectedDocument(null)
    } catch (error) {
      console.error('Error restoring document:', error)
      toast.error('Failed to restore document')
    }
  }

  const handleBulkRestore = async () => {
    const restorableCount = bulkSelected.filter(id => {
      const doc = archivedDocuments.find(d => d.id === id)
      return doc && doc.canRestore
    }).length

    if (restorableCount === 0) {
      toast.error('No restorable documents selected')
      return
    }

    if (confirm(`Restore ${restorableCount} document(s)?`)) {
      try {
        setArchivedDocuments(prev => 
          prev.filter(doc => !bulkSelected.includes(doc.id) || !doc.canRestore)
        )
        setBulkSelected([])
        setShowBulkActions(false)
        toast.success(`${restorableCount} document(s) restored successfully`)
      } catch (error) {
        console.error('Error bulk restoring:', error)
        toast.error('Failed to restore documents')
      }
    }
  }

  const handlePermanentDelete = async (documentId: string) => {
    const document = archivedDocuments.find(doc => doc.id === documentId)
    if (!document) return

    if (confirm(`Permanently delete "${document.title}"? This action cannot be undone.`)) {
      try {
        // Simulate API call
        setArchivedDocuments(prev => prev.filter(doc => doc.id !== documentId))
        toast.success('Document permanently deleted')
        setShowDeleteDialog(false)
        setSelectedDocument(null)
      } catch (error) {
        console.error('Error deleting document:', error)
        toast.error('Failed to delete document')
      }
    }
  }

  const handleBulkDelete = async () => {
    if (confirm(`Permanently delete ${bulkSelected.length} document(s)? This action cannot be undone.`)) {
      try {
        setArchivedDocuments(prev => prev.filter(doc => !bulkSelected.includes(doc.id)))
        setBulkSelected([])
        setShowBulkActions(false)
        toast.success(`${bulkSelected.length} document(s) permanently deleted`)
      } catch (error) {
        console.error('Error bulk deleting:', error)
        toast.error('Failed to delete documents')
      }
    }
  }

  const handleDownload = async (document: ArchivedDocument) => {
    try {
      // Simulate download
      toast.success(`Downloading ${document.filename}`)
      
      // Update download count
      setArchivedDocuments(prev =>
        prev.map(doc =>
          doc.id === document.id
            ? { ...doc, downloadCount: doc.downloadCount + 1 }
            : doc
        )
      )
    } catch (error) {
      console.error('Error downloading document:', error)
      toast.error('Failed to download document')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄'
    if (fileType.includes('word')) return '📝'
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊'
    if (fileType.includes('zip') || fileType.includes('archive')) return '📦'
    if (fileType.includes('image')) return '🖼️'
    return '📁'
  }

  const filteredDocuments = archivedDocuments.filter(document => {
    const matchesSearch = document.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         document.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         document.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         document.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = categoryFilter === 'all' || document.category === categoryFilter
    
    const matchesDate = (() => {
      if (dateFilter === 'all') return true
      const archivedDate = new Date(document.archivedAt)
      const now = new Date()
      
      switch (dateFilter) {
        case 'week':
          return archivedDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        case 'month':
          return archivedDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        case 'quarter':
          return archivedDate >= new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        case 'year':
          return archivedDate >= new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        default:
          return true
      }
    })()
    
    return matchesSearch && matchesCategory && matchesDate
  })

  const categories = Array.from(new Set(archivedDocuments.map(doc => doc.category)))

  const stats = {
    total: archivedDocuments.length,
    restorable: archivedDocuments.filter(doc => doc.canRestore).length,
    totalSize: archivedDocuments.reduce((sum, doc) => sum + doc.fileSize, 0),
    totalDownloads: archivedDocuments.reduce((sum, doc) => sum + doc.downloadCount, 0)
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg">Loading archived documents...</div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
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
                <h1 className="text-2xl font-bold">Document Archive</h1>
                <p className="text-muted-foreground">
                  Manage archived documents and restore when needed
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => fetchArchivedDocuments()}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Archived Documents</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                  <Archive className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Restorable</p>
                    <p className="text-2xl font-bold text-green-600">{stats.restorable}</p>
                  </div>
                  <Restore className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Storage Used</p>
                    <p className="text-2xl font-bold text-blue-600">{formatFileSize(stats.totalSize)}</p>
                  </div>
                  <FolderOpen className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Downloads</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.totalDownloads}</p>
                  </div>
                  <Download className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bulk Actions */}
          {showBulkActions && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <span className="font-medium">{bulkSelected.length} document(s) selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleBulkRestore}
                    >
                      <Restore className="h-4 w-4 mr-2" />
                      Restore Selected
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={handleBulkDelete}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Selected
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setBulkSelected([])
                        setShowBulkActions(false)
                      }}
                    >
                      Clear Selection
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search archived documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="week">Past Week</SelectItem>
                    <SelectItem value="month">Past Month</SelectItem>
                    <SelectItem value="quarter">Past Quarter</SelectItem>
                    <SelectItem value="year">Past Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Documents Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Archived Documents ({filteredDocuments.length})</CardTitle>
                  <CardDescription>Review and manage archived documents</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                >
                  {filteredDocuments.every(doc => bulkSelected.includes(doc.id)) ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {filteredDocuments.length === 0 ? (
                <div className="text-center py-8">
                  <Archive className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium">No archived documents found</p>
                  <p className="text-muted-foreground">
                    {searchTerm || categoryFilter !== 'all' || dateFilter !== 'all'
                      ? 'Try adjusting your filters'
                      : 'No documents have been archived yet'
                    }
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <input
                          type="checkbox"
                          checked={filteredDocuments.every(doc => bulkSelected.includes(doc.id))}
                          onChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Document</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Archived By</TableHead>
                      <TableHead>Archived Date</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Downloads</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.map((document) => (
                      <TableRow key={document.id}>
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={bulkSelected.includes(document.id)}
                            onChange={() => handleBulkSelect(document.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{getFileIcon(document.fileType)}</div>
                            <div>
                              <p className="font-medium">{document.title}</p>
                              <p className="text-sm text-muted-foreground">{document.filename}</p>
                              <div className="flex gap-1 mt-1">
                                {document.tags.slice(0, 3).map(tag => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{document.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{document.archivedBy}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{formatDate(document.archivedAt)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-mono">{formatFileSize(document.fileSize)}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Download className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{document.downloadCount}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={document.canRestore ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                          >
                            {document.canRestore ? 'Restorable' : 'Permanent'}
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
                              <DropdownMenuItem onClick={() => handleDownload(document)}>
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => {
                                  setSelectedDocument(document)
                                  setShowRestoreDialog(true)
                                }}
                                disabled={!document.canRestore}
                              >
                                <Restore className="h-4 w-4 mr-2" />
                                Restore
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => {
                                  setSelectedDocument(document)
                                  setShowDeleteDialog(true)
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Permanently
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

          {/* Restore Confirmation Dialog */}
          <Dialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Restore className="h-5 w-5 text-green-600" />
                  Restore Document
                </DialogTitle>
                <DialogDescription>
                  Are you sure you want to restore this document? It will be moved back to its original location.
                </DialogDescription>
              </DialogHeader>
              
              {selectedDocument && (
                <div className="py-4">
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p><strong>Document:</strong> {selectedDocument.title}</p>
                    <p><strong>Original Path:</strong> {selectedDocument.originalPath}</p>
                    <p><strong>Archive Reason:</strong> {selectedDocument.reason}</p>
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRestoreDialog(false)
                    setSelectedDocument(null)
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => selectedDocument && handleRestore(selectedDocument.id)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Restore className="h-4 w-4 mr-2" />
                  Restore Document
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Permanently Delete Document
                </DialogTitle>
                <DialogDescription>
                  This action cannot be undone. The document will be permanently deleted from the archive.
                </DialogDescription>
              </DialogHeader>
              
              {selectedDocument && (
                <div className="py-4">
                  <div className="bg-red-50 border border-red-200 p-4 rounded-lg space-y-2">
                    <p><strong>Document:</strong> {selectedDocument.title}</p>
                    <p><strong>File:</strong> {selectedDocument.filename}</p>
                    <p><strong>Size:</strong> {formatFileSize(selectedDocument.fileSize)}</p>
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteDialog(false)
                    setSelectedDocument(null)
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => selectedDocument && handlePermanentDelete(selectedDocument.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Permanently
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
    </AdminLayout>
  )
}