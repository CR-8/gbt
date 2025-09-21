"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/modules/layouts'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
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
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Shield,
  Users,
  Crown,
  Star,
  UserCheck,
  Settings,
  Eye,
  Lock,
  AlertCircle,
  Save,
  X
} from "lucide-react"
import { toast } from "sonner"

interface Role {
  id: string
  name: string
  description: string
  level: number
  permissions: string[]
  color: string
  memberCount: number
  isDefault: boolean
  isSystemRole: boolean
}

interface Permission {
  id: string
  name: string
  description: string
  category: string
}

const AVAILABLE_PERMISSIONS: Permission[] = [
  // Team Management
  { id: 'team.view', name: 'View Team', description: 'View team members list', category: 'Team Management' },
  { id: 'team.create', name: 'Add Members', description: 'Add new team members', category: 'Team Management' },
  { id: 'team.edit', name: 'Edit Members', description: 'Edit team member information', category: 'Team Management' },
  { id: 'team.delete', name: 'Remove Members', description: 'Remove team members', category: 'Team Management' },
  { id: 'team.roles', name: 'Manage Roles', description: 'Manage team roles and permissions', category: 'Team Management' },
  
  // Event Management
  { id: 'events.view', name: 'View Events', description: 'View events list', category: 'Event Management' },
  { id: 'events.create', name: 'Create Events', description: 'Create new events', category: 'Event Management' },
  { id: 'events.edit', name: 'Edit Events', description: 'Edit event information', category: 'Event Management' },
  { id: 'events.delete', name: 'Delete Events', description: 'Delete events', category: 'Event Management' },
  { id: 'events.publish', name: 'Publish Events', description: 'Publish/unpublish events', category: 'Event Management' },
  
  // Blog Management
  { id: 'blogs.view', name: 'View Blogs', description: 'View blog posts', category: 'Blog Management' },
  { id: 'blogs.create', name: 'Create Blogs', description: 'Create new blog posts', category: 'Blog Management' },
  { id: 'blogs.edit', name: 'Edit Blogs', description: 'Edit blog posts', category: 'Blog Management' },
  { id: 'blogs.delete', name: 'Delete Blogs', description: 'Delete blog posts', category: 'Blog Management' },
  { id: 'blogs.publish', name: 'Publish Blogs', description: 'Publish/unpublish blog posts', category: 'Blog Management' },
  
  // Stock Management
  { id: 'stock.view', name: 'View Stock', description: 'View inventory items', category: 'Stock Management' },
  { id: 'stock.add', name: 'Add Stock', description: 'Add new inventory items', category: 'Stock Management' },
  { id: 'stock.edit', name: 'Edit Stock', description: 'Edit inventory items', category: 'Stock Management' },
  { id: 'stock.delete', name: 'Remove Stock', description: 'Remove inventory items', category: 'Stock Management' },
  { id: 'stock.reports', name: 'Stock Reports', description: 'View stock reports and analytics', category: 'Stock Management' },
  
  // Document Management
  { id: 'documents.view', name: 'View Documents', description: 'View document library', category: 'Document Management' },
  { id: 'documents.upload', name: 'Upload Documents', description: 'Upload new documents', category: 'Document Management' },
  { id: 'documents.edit', name: 'Edit Documents', description: 'Edit document information', category: 'Document Management' },
  { id: 'documents.delete', name: 'Delete Documents', description: 'Delete documents', category: 'Document Management' },
  
  // Administration
  { id: 'admin.dashboard', name: 'Admin Dashboard', description: 'Access admin dashboard', category: 'Administration' },
  { id: 'admin.settings', name: 'System Settings', description: 'Modify system settings', category: 'Administration' },
  { id: 'admin.users', name: 'User Management', description: 'Manage user accounts', category: 'Administration' },
  { id: 'admin.analytics', name: 'Analytics', description: 'View system analytics', category: 'Administration' },
  { id: 'admin.backup', name: 'Backup & Restore', description: 'Manage system backups', category: 'Administration' },
]

export default function TeamRolesPage() {
  const router = useRouter()
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    level: 1,
    permissions: [] as string[],
    color: 'blue'
  })

  useEffect(() => {
    fetchRoles()
  }, [])

  const fetchRoles = async () => {
    try {
      setLoading(true)
      // Simulate API call - replace with actual API
      const mockRoles: Role[] = [
        {
          id: '1',
          name: 'HOD',
          description: 'Head of Department with full administrative access',
          level: 5,
          permissions: AVAILABLE_PERMISSIONS.map(p => p.id),
          color: 'yellow',
          memberCount: 1,
          isDefault: true,
          isSystemRole: true
        },
        {
          id: '2',
          name: 'Coordinator',
          description: 'Department coordinator with management access',
          level: 4,
          permissions: AVAILABLE_PERMISSIONS.filter(p => !p.id.includes('admin.settings') && !p.id.includes('admin.backup')).map(p => p.id),
          color: 'blue',
          memberCount: 3,
          isDefault: true,
          isSystemRole: true
        },
        {
          id: '3',
          name: 'Assistant Coordinator',
          description: 'Assistant coordinator with limited management access',
          level: 3,
          permissions: AVAILABLE_PERMISSIONS.filter(p => 
            p.category !== 'Administration' || p.id === 'admin.dashboard' || p.id === 'admin.analytics'
          ).map(p => p.id),
          color: 'green',
          memberCount: 5,
          isDefault: true,
          isSystemRole: true
        },
        {
          id: '4',
          name: 'Content Manager',
          description: 'Manages blogs, events, and documents',
          level: 2,
          permissions: [
            'blogs.view', 'blogs.create', 'blogs.edit', 'blogs.publish',
            'events.view', 'events.create', 'events.edit',
            'documents.view', 'documents.upload', 'documents.edit',
            'admin.dashboard'
          ],
          color: 'purple',
          memberCount: 2,
          isDefault: false,
          isSystemRole: false
        }
      ]
      
      setRoles(mockRoles)
    } catch (error) {
      console.error('Error fetching roles:', error)
      toast.error('Failed to load roles')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | number | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePermissionToggle = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }))
  }

  const handleCreateRole = () => {
    setEditingRole(null)
    setFormData({
      name: '',
      description: '',
      level: 1,
      permissions: [],
      color: 'blue'
    })
    setDialogOpen(true)
  }

  const handleEditRole = (role: Role) => {
    if (role.isSystemRole) {
      toast.error('System roles cannot be edited')
      return
    }
    
    setEditingRole(role)
    setFormData({
      name: role.name,
      description: role.description,
      level: role.level,
      permissions: role.permissions,
      color: role.color
    })
    setDialogOpen(true)
  }

  const handleDeleteRole = async (roleId: string) => {
    const role = roles.find(r => r.id === roleId)
    if (!role) return

    if (role.isSystemRole) {
      toast.error('System roles cannot be deleted')
      return
    }

    if (role.memberCount > 0) {
      toast.error('Cannot delete role with assigned members')
      return
    }

    if (confirm('Are you sure you want to delete this role?')) {
      try {
        // Simulate API call
        setRoles(prev => prev.filter(r => r.id !== roleId))
        toast.success('Role deleted successfully')
      } catch (error) {
        console.error('Error deleting role:', error)
        toast.error('Failed to delete role')
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error('Role name is required')
      return
    }

    if (formData.permissions.length === 0) {
      toast.error('At least one permission is required')
      return
    }

    try {
      if (editingRole) {
        // Update existing role
        const updatedRole: Role = {
          ...editingRole,
          name: formData.name,
          description: formData.description,
          level: formData.level,
          permissions: formData.permissions,
          color: formData.color
        }
        
        setRoles(prev => prev.map(r => r.id === editingRole.id ? updatedRole : r))
        toast.success('Role updated successfully')
      } else {
        // Create new role
        const newRole: Role = {
          id: Date.now().toString(),
          name: formData.name,
          description: formData.description,
          level: formData.level,
          permissions: formData.permissions,
          color: formData.color,
          memberCount: 0,
          isDefault: false,
          isSystemRole: false
        }
        
        setRoles(prev => [...prev, newRole])
        toast.success('Role created successfully')
      }

      setDialogOpen(false)
    } catch (error) {
      console.error('Error saving role:', error)
      toast.error('Failed to save role')
    }
  }

  const getRoleIcon = (role: Role) => {
    if (role.name === 'HOD') return <Crown className="h-4 w-4" />
    if (role.name === 'Coordinator') return <Star className="h-4 w-4" />
    if (role.name === 'Assistant Coordinator') return <UserCheck className="h-4 w-4" />
    return <Shield className="h-4 w-4" />
  }

  const getRoleColor = (color: string) => {
    const colors = {
      yellow: 'bg-yellow-100 text-yellow-800',
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      purple: 'bg-purple-100 text-purple-800',
      red: 'bg-red-100 text-red-800',
      orange: 'bg-orange-100 text-orange-800'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  const groupedPermissions = AVAILABLE_PERMISSIONS.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = []
    }
    acc[permission.category].push(permission)
    return acc
  }, {} as Record<string, Permission[]>)

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-lg">Loading roles...</div>
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
                <h1 className="text-2xl font-bold">Roles & Permissions</h1>
                <p className="text-muted-foreground">
                  Manage team roles and their access permissions
                </p>
              </div>
            </div>
            <Button onClick={handleCreateRole}>
              <Plus className="h-4 w-4 mr-2" />
              Create Role
            </Button>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Roles</p>
                    <p className="text-2xl font-bold">{roles.length}</p>
                  </div>
                  <Shield className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">System Roles</p>
                    <p className="text-2xl font-bold">{roles.filter(r => r.isSystemRole).length}</p>
                  </div>
                  <Lock className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Custom Roles</p>
                    <p className="text-2xl font-bold">{roles.filter(r => !r.isSystemRole).length}</p>
                  </div>
                  <Settings className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Members</p>
                    <p className="text-2xl font-bold">{roles.reduce((sum, r) => sum + r.memberCount, 0)}</p>
                  </div>
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Roles Table */}
          <Card>
            <CardHeader>
              <CardTitle>Team Roles</CardTitle>
              <CardDescription>Manage roles and their permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${getRoleColor(role.color)}`}>
                            {getRoleIcon(role)}
                          </div>
                          <div>
                            <p className="font-medium">{role.name}</p>
                            <p className="text-sm text-muted-foreground">{role.description}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">Level {role.level}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{role.memberCount}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          <span>{role.permissions.length} permissions</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {role.isSystemRole && (
                            <Badge variant="secondary">
                              <Lock className="h-3 w-3 mr-1" />
                              System
                            </Badge>
                          )}
                          {role.isDefault && (
                            <Badge variant="outline">Default</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditRole(role)}
                            disabled={role.isSystemRole}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteRole(role.id)}
                            disabled={role.isSystemRole || role.memberCount > 0}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Create/Edit Role Dialog */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingRole ? 'Edit Role' : 'Create New Role'}
                </DialogTitle>
                <DialogDescription>
                  {editingRole ? 'Update role information and permissions' : 'Create a new role with specific permissions'}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Role Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter role name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="level">Access Level *</Label>
                    <Select value={formData.level.toString()} onValueChange={(value) => handleInputChange('level', parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Level 1 - Basic</SelectItem>
                        <SelectItem value="2">Level 2 - Standard</SelectItem>
                        <SelectItem value="3">Level 3 - Advanced</SelectItem>
                        <SelectItem value="4">Level 4 - Manager</SelectItem>
                        <SelectItem value="5">Level 5 - Administrator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Enter role description"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="color">Color Theme</Label>
                    <Select value={formData.color} onValueChange={(value) => handleInputChange('color', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blue">Blue</SelectItem>
                        <SelectItem value="green">Green</SelectItem>
                        <SelectItem value="purple">Purple</SelectItem>
                        <SelectItem value="orange">Orange</SelectItem>
                        <SelectItem value="red">Red</SelectItem>
                        <SelectItem value="yellow">Yellow</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Permissions */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Label className="text-base">Permissions *</Label>
                    <Badge variant="outline">{formData.permissions.length} selected</Badge>
                  </div>
                  
                  <div className="grid gap-4">
                    {Object.entries(groupedPermissions).map(([category, permissions]) => (
                      <Card key={category}>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">{category}</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="grid gap-3 md:grid-cols-2">
                            {permissions.map((permission) => (
                              <div key={permission.id} className="flex items-start space-x-2">
                                <Checkbox
                                  id={permission.id}
                                  checked={formData.permissions.includes(permission.id)}
                                  onCheckedChange={() => handlePermissionToggle(permission.id)}
                                />
                                <div className="space-y-1 leading-none">
                                  <Label htmlFor={permission.id} className="text-sm font-medium cursor-pointer">
                                    {permission.name}
                                  </Label>
                                  <p className="text-xs text-muted-foreground">
                                    {permission.description}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    {editingRole ? 'Update Role' : 'Create Role'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
    </AdminLayout>
  )
}