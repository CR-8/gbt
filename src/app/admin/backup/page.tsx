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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  Progress,
} from "@/components/ui/progress"
import {
  ArrowLeft,
  Database,
  Download,
  Upload,
  RefreshCw,
  MoreHorizontal,
  Trash2,
  Calendar,
  HardDrive,
  FileArchive,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Cloud,
  Server,
  Eye,
  AlertTriangle
} from "lucide-react"
import { toast } from "sonner"

interface BackupFile {
  id: string
  name: string
  type: 'manual' | 'automatic'
  status: 'completed' | 'in_progress' | 'failed'
  size: number
  createdAt: string
  description?: string
  location: 'local' | 's3' | 'gcs' | 'azure'
  checksum: string
  downloadUrl?: string
}

interface BackupJob {
  id: string
  name: string
  type: 'full' | 'incremental' | 'differential'
  schedule: string
  enabled: boolean
  lastRun?: string
  nextRun?: string
  status: 'idle' | 'running' | 'failed'
  successCount: number
  failureCount: number
}

interface BackupStats {
  totalBackups: number
  totalSize: number
  lastBackup: string
  nextScheduled: string
  successRate: number
  storageUsed: number
  storageLimit: number
}

export default function BackupManagementPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [backupFiles, setBackupFiles] = useState<BackupFile[]>([])
  const [backupJobs, setBackupJobs] = useState<BackupJob[]>([])
  const [stats, setStats] = useState<BackupStats>({
    totalBackups: 0,
    totalSize: 0,
    lastBackup: '',
    nextScheduled: '',
    successRate: 0,
    storageUsed: 0,
    storageLimit: 0
  })
  const [creating, setCreating] = useState(false)
  const [restoring, setRestoring] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedBackup, setSelectedBackup] = useState<BackupFile | null>(null)
  const [backupProgress, setBackupProgress] = useState(0)
  const [restoreProgress, setRestoreProgress] = useState(0)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock backup files
      const mockBackupFiles: BackupFile[] = [
        {
          id: '1',
          name: 'full-backup-2024-01-15.tar.gz',
          type: 'automatic',
          status: 'completed',
          size: 2500000000, // 2.5GB
          createdAt: '2024-01-15T02:00:00Z',
          description: 'Full database and files backup',
          location: 'local',
          checksum: 'sha256:abc123...',
          downloadUrl: '/api/backups/1/download'
        },
        {
          id: '2',
          name: 'manual-backup-2024-01-14.tar.gz',
          type: 'manual',
          status: 'completed',
          size: 1800000000, // 1.8GB
          createdAt: '2024-01-14T14:30:00Z',
          description: 'Pre-deployment backup',
          location: 's3',
          checksum: 'sha256:def456...',
          downloadUrl: '/api/backups/2/download'
        },
        {
          id: '3',
          name: 'incremental-backup-2024-01-13.tar.gz',
          type: 'automatic',
          status: 'failed',
          size: 0,
          createdAt: '2024-01-13T02:00:00Z',
          description: 'Incremental backup failed due to disk space',
          location: 'local',
          checksum: ''
        }
      ]

      // Mock backup jobs
      const mockBackupJobs: BackupJob[] = [
        {
          id: '1',
          name: 'Daily Full Backup',
          type: 'full',
          schedule: '0 2 * * *', // Daily at 2 AM
          enabled: true,
          lastRun: '2024-01-15T02:00:00Z',
          nextRun: '2024-01-16T02:00:00Z',
          status: 'idle',
          successCount: 28,
          failureCount: 2
        },
        {
          id: '2',
          name: 'Hourly Incremental',
          type: 'incremental',
          schedule: '0 * * * *', // Every hour
          enabled: true,
          lastRun: '2024-01-15T15:00:00Z',
          nextRun: '2024-01-15T16:00:00Z',
          status: 'idle',
          successCount: 720,
          failureCount: 5
        },
        {
          id: '3',
          name: 'Weekly Archive',
          type: 'differential',
          schedule: '0 1 * * 0', // Weekly on Sunday at 1 AM
          enabled: false,
          lastRun: '2024-01-07T01:00:00Z',
          nextRun: '2024-01-21T01:00:00Z',
          status: 'idle',
          successCount: 4,
          failureCount: 0
        }
      ]

      // Mock stats
      const mockStats: BackupStats = {
        totalBackups: mockBackupFiles.length,
        totalSize: mockBackupFiles.reduce((sum, backup) => sum + backup.size, 0),
        lastBackup: '2024-01-15T02:00:00Z',
        nextScheduled: '2024-01-16T02:00:00Z',
        successRate: 92.5,
        storageUsed: 85, // percentage
        storageLimit: 100000000000 // 100GB
      }

      setBackupFiles(mockBackupFiles)
      setBackupJobs(mockBackupJobs)
      setStats(mockStats)
    } catch (error) {
      console.error('Error fetching backup data:', error)
      toast.error('Failed to load backup data')
    } finally {
      setLoading(false)
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
    }
  }

  const getLocationIcon = (location: string) => {
    switch (location) {
      case 'local':
        return <HardDrive className="h-4 w-4" />
      case 's3':
      case 'gcs':
      case 'azure':
        return <Cloud className="h-4 w-4" />
      default:
        return <Server className="h-4 w-4" />
    }
  }

  const handleCreateBackup = async () => {
    try {
      setCreating(true)
      setBackupProgress(0)

      // Simulate backup progress
      const interval = setInterval(() => {
        setBackupProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 10
        })
      }, 500)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 5000))

      toast.success('Backup created successfully!')
      fetchData() // Refresh the data
    } catch (error) {
      console.error('Error creating backup:', error)
      toast.error('Failed to create backup')
    } finally {
      setCreating(false)
      setBackupProgress(0)
    }
  }

  const handleRestoreBackup = async (backup: BackupFile) => {
    try {
      setRestoring(true)
      setRestoreProgress(0)

      // Simulate restore progress
      const interval = setInterval(() => {
        setRestoreProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 8
        })
      }, 600)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 6000))

      toast.success(`Backup ${backup.name} restored successfully!`)
    } catch (error) {
      console.error('Error restoring backup:', error)
      toast.error('Failed to restore backup')
    } finally {
      setRestoring(false)
      setRestoreProgress(0)
    }
  }

  const handleDeleteBackup = async (backup: BackupFile) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setBackupFiles(prev => prev.filter(b => b.id !== backup.id))
      toast.success(`Backup ${backup.name} deleted successfully!`)
      setDeleteDialogOpen(false)
      setSelectedBackup(null)
    } catch (error) {
      console.error('Error deleting backup:', error)
      toast.error('Failed to delete backup')
    }
  }

  const handleDownloadBackup = (backup: BackupFile) => {
    if (backup.downloadUrl) {
      // In a real app, this would trigger the download
      toast.success(`Downloading ${backup.name}...`)
    }
  }

  const handleToggleJob = async (job: BackupJob) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))

      setBackupJobs(prev => prev.map(j => 
        j.id === job.id 
          ? { ...j, enabled: !j.enabled }
          : j
      ))

      toast.success(`Backup job ${job.enabled ? 'disabled' : 'enabled'}`)
    } catch (error) {
      console.error('Error toggling backup job:', error)
      toast.error('Failed to update backup job')
    }
  }

  const handleRunJob = async (job: BackupJob) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast.success(`Backup job "${job.name}" started`)
    } catch (error) {
      console.error('Error running backup job:', error)
      toast.error('Failed to run backup job')
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-lg">Loading backup data...</div>
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
              <h1 className="text-2xl font-bold">Backup Management</h1>
              <p className="text-muted-foreground">
                Manage system backups and data recovery
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={fetchData}
              disabled={creating || restoring}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button
              onClick={handleCreateBackup}
              disabled={creating || restoring}
            >
              <Database className="h-4 w-4 mr-2" />
              {creating ? 'Creating...' : 'Create Backup'}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Backups</CardTitle>
              <FileArchive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBackups}</div>
              <p className="text-xs text-muted-foreground">
                {formatBytes(stats.totalSize)} total size
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Backup</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.lastBackup ? new Date(stats.lastBackup).toLocaleDateString() : 'Never'}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.lastBackup ? formatDate(stats.lastBackup).split(',')[1] : 'No backups yet'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.successRate}%</div>
              <p className="text-xs text-muted-foreground">
                Backup reliability
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.storageUsed}%</div>
              <Progress value={stats.storageUsed} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {formatBytes(stats.storageLimit)} limit
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Indicators */}
        {(creating || restoring) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {creating ? <Database className="h-5 w-5" /> : <Upload className="h-5 w-5" />}
                {creating ? 'Creating Backup' : 'Restoring Backup'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={creating ? backupProgress : restoreProgress} className="mb-2" />
              <p className="text-sm text-muted-foreground">
                {creating ? `${backupProgress}% complete` : `${restoreProgress}% complete`}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Backup Files */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileArchive className="h-5 w-5" />
              Backup Files
            </CardTitle>
            <CardDescription>
              Available backup files and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {backupFiles.map((backup) => (
                  <TableRow key={backup.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{backup.name}</div>
                        {backup.description && (
                          <div className="text-sm text-muted-foreground">
                            {backup.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={backup.type === 'manual' ? 'default' : 'secondary'}>
                        {backup.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(backup.status)}
                        <span className="capitalize">{backup.status.replace('_', ' ')}</span>
                      </div>
                    </TableCell>
                    <TableCell>{formatBytes(backup.size)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getLocationIcon(backup.location)}
                        <span className="capitalize">{backup.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(backup.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleDownloadBackup(backup)}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          {backup.status === 'completed' && (
                            <DropdownMenuItem 
                              onClick={() => handleRestoreBackup(backup)}
                              disabled={restoring}
                            >
                              <RotateCcw className="h-4 w-4 mr-2" />
                              Restore
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedBackup(backup)
                              setDeleteDialogOpen(true)
                            }}
                            className="text-red-600"
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
          </CardContent>
        </Card>

        {/* Backup Jobs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Scheduled Backup Jobs
            </CardTitle>
            <CardDescription>
              Manage automated backup schedules and jobs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Run</TableHead>
                  <TableHead>Success Rate</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {backupJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {job.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{job.schedule}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {job.enabled ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Pause className="h-4 w-4 text-gray-500" />
                        )}
                        <span>{job.enabled ? 'Enabled' : 'Disabled'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {job.lastRun ? formatDate(job.lastRun) : 'Never'}
                    </TableCell>
                    <TableCell>
                      {job.successCount + job.failureCount > 0 ? (
                        <div>
                          {Math.round((job.successCount / (job.successCount + job.failureCount)) * 100)}%
                          <div className="text-xs text-muted-foreground">
                            {job.successCount} / {job.successCount + job.failureCount}
                          </div>
                        </div>
                      ) : (
                        'No runs'
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRunJob(job)}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleJob(job)}
                        >
                          {job.enabled ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Settings className="h-4 w-4 mr-2" />
                              Configure
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Logs
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Job
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Confirm Backup Deletion
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the backup &ldquo;{selectedBackup?.name}&rdquo;? 
                This action cannot be undone and the backup file will be permanently removed.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteDialogOpen(false)
                  setSelectedBackup(null)
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => selectedBackup && handleDeleteBackup(selectedBackup)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Backup
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}