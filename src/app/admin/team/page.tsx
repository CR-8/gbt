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
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Star,
  Calendar,
  Users,
  Crown,
  UserCheck,
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

interface TeamMember {
  _id: string
  name: string
  rollNo?: string
  course?: string
  branch?: string
  image: string
  year?: number
  activity?: boolean
  Role?: string
  role?: string // Legacy field
  department: string
  yearOfLeaving?: number
  isMember?: boolean
  isActive?: boolean // Legacy field
  createdAt: string
  updatedAt: string
}

export default function TeamManagementPage() {
  const router = useRouter()
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [yearFilter, setYearFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('joinDate')
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    visibleMembers: 0,
    featuredMembers: 0,
    leads: 0,
    coreMembers: 0,
    currentYearMembers: 0
  })

  useEffect(() => {
    fetchTeamMembers()
    fetchStats()
  }, [])

  const fetchTeamMembers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/team/read')
      if (!response.ok) {
        throw new Error('Failed to fetch team members')
      }
      const data = await response.json()
      setTeamMembers(data || [])
    } catch (error) {
      console.error('Error fetching team members:', error)
      // Fallback to empty array if API fails
      setTeamMembers([])
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/team/stats')
      if (!response.ok) {
        throw new Error('Failed to fetch team stats')
      }
      const data = await response.json()

      setStats({
        totalMembers: data.overview.totalMembers,
        activeMembers: data.overview.activeMembers,
        visibleMembers: data.derived.visibleMembers,
        featuredMembers: data.derived.featuredMembers,
        leads: data.derived.leads,
        coreMembers: data.derived.coreMembers,
        currentYearMembers: data.derived.currentYearMembers
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
      // Fallback to default stats if API fails
      setStats({
        totalMembers: 0,
        activeMembers: 0,
        visibleMembers: 0,
        featuredMembers: 0,
        leads: 0,
        coreMembers: 0,
        currentYearMembers: 0
      })
    }
  }

  const handleToggleActive = async (memberId: string, isMember: boolean) => {
    try {
      const response = await fetch(`/api/team/update?id=${memberId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          isMember: !isMember
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to update member status')
      }
      
      // Refresh the data after update
      await fetchTeamMembers()
      await fetchStats()
    } catch (error) {
      console.error('Error updating member status:', error)
      alert('Failed to update member status. Please try again.')
    }
  }

  const handleDeleteMember = async (memberId: string) => {
    if (confirm('Are you sure you want to delete this team member? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/team/delete?id=${memberId}`, {
          method: 'DELETE'
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to delete team member')
        }
        
        // Refresh the data after delete
        await fetchTeamMembers()
        await fetchStats()
        alert('Team member deleted successfully!')
      } catch (error) {
        console.error('Error deleting team member:', error)
        alert('Failed to delete team member. Please try again.')
      }
    }
  }

  const filteredTeamMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (member.rollNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (member.course || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (member.branch || '').toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = roleFilter === 'all' || (member.Role || member.role) === roleFilter
    const matchesDepartment = departmentFilter === 'all' || member.department === departmentFilter
    const matchesYear = yearFilter === 'all' || (member.year && member.year.toString() === yearFilter)
    const matchesStatus = statusFilter === 'all' ||
                         (statusFilter === 'active' && (member.isMember || member.isActive)) ||
                         (statusFilter === 'inactive' && !(member.isMember || member.isActive)) ||
                         (statusFilter === 'visible' && (member.isMember || member.isActive)) ||
                         (statusFilter === 'hidden' && !(member.isMember || member.isActive))
    
    return matchesSearch && matchesRole && matchesDepartment && matchesYear && matchesStatus
  })

  const sortedTeamMembers = [...filteredTeamMembers].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'rollNo':
        return (a.rollNo || '').localeCompare(b.rollNo || '')
      case 'role':
        return (a.Role || a.role || '').localeCompare(b.Role || b.role || '')
      case 'department':
        return a.department.localeCompare(b.department)
      case 'year':
        return (b.year || 0) - (a.year || 0)
      case 'course':
        return (a.course || '').localeCompare(b.course || '')
      case 'branch':
        return (a.branch || '').localeCompare(b.branch || '')
      case 'createdAt':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  const roles = [...new Set(teamMembers.map(member => member.Role || member.role).filter((role): role is string => Boolean(role)))]
  const departments = [...new Set(teamMembers.map(member => member.department).filter(Boolean))]
  const years = [...new Set(teamMembers.map(member => member.year).filter(year => year != null))].sort((a, b) => b - a)

  const getRoleIcon = (role: string) => {
    if (role === 'HOD') {
      return <Crown className="h-4 w-4 text-yellow-500" />
    } else if (role === 'Coordinator') {
      return <Star className="h-4 w-4 text-blue-500" />
    } else if (role === 'Assistant Coordinator') {
      return <UserCheck className="h-4 w-4 text-green-500" />
    } else {
      return <UserCheck className="h-4 w-4 text-gray-500" />
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    if (role === 'HOD') {
      return 'default' as const
    } else if (role === 'Coordinator') {
      return 'secondary' as const
    } else if (role === 'Assistant Coordinator') {
      return 'outline' as const
    } else {
      return 'outline' as const
    }
  }

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-lg">Loading team members...</div>
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
              <h1 className="text-2xl font-bold">Team Management</h1>
              <p className="text-muted-foreground">
                Manage team members, roles, and organizational structure
              </p>
            </div>
            <Button onClick={() => router.push('/admin/team/create')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-7">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold">{stats.totalMembers}</p>
                  </div>
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active</p>
                    <p className="text-2xl font-bold text-green-600">{stats.activeMembers}</p>
                  </div>
                  <UserCheck className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Visible</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.visibleMembers}</p>
                  </div>
                  <Eye className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Featured</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.featuredMembers}</p>
                  </div>
                  <Star className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Leads</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.leads}</p>
                  </div>
                  <Crown className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Core</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.coreMembers}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Year</p>
                    <p className="text-2xl font-bold">{new Date().getFullYear()}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-muted-foreground" />
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
                    placeholder="Search team members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {roles.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={yearFilter} onValueChange={setYearFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {years.map(year => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="visible">Visible</SelectItem>
                    <SelectItem value="hidden">Hidden</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Join Date</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="rollNo">Roll Number</SelectItem>
                    <SelectItem value="role">Role</SelectItem>
                    <SelectItem value="department">Department</SelectItem>
                    <SelectItem value="year">Year</SelectItem>
                    <SelectItem value="course">Course</SelectItem>
                    <SelectItem value="branch">Branch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Team Members Table */}
          <Card>
            <CardHeader>
              <CardTitle>Team Members ({sortedTeamMembers.length})</CardTitle>
              <CardDescription>Manage team members and their information</CardDescription>
            </CardHeader>
            <CardContent>
              {sortedTeamMembers.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium">No team members found</p>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || roleFilter !== 'all' || departmentFilter !== 'all' || yearFilter !== 'all' || statusFilter !== 'all'
                      ? 'Try adjusting your filters'
                      : 'Add your first team member to get started'
                    }
                  </p>
                  <Button onClick={() => router.push('/admin/team/create')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Team Member
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Academic Info</TableHead>
                      <TableHead>Role & Department</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedTeamMembers.map((member) => (
                      <TableRow key={member._id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={member.image} alt={member.name} />
                              <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <p className="text-sm text-muted-foreground">{member.rollNo}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p className="font-medium">{member.course}</p>
                            <p className="text-muted-foreground">{member.branch}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="flex items-center gap-1 mb-1">
                              {getRoleIcon(member.Role || member.role || '')}
                              <Badge variant={getRoleBadgeVariant(member.Role || member.role || '')}>
                                {member.Role || member.role || 'Unknown'}
                              </Badge>
                            </div>
                            <Badge variant="outline" className="text-xs">{member.department}</Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{member.year}</span>
                            {member.yearOfLeaving && (
                              <span className="text-xs text-muted-foreground">
                                (Left: {member.yearOfLeaving})
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              {member.isMember ? (
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                  <UserCheck className="h-3 w-3 mr-1" />
                                  Active
                                </Badge>
                              ) : (
                                <Badge variant="secondary">
                                  Inactive
                                </Badge>
                              )}
                            </div>
                            {member.activity && (
                              <Badge variant="outline" className="text-xs">
                                Active in Activities
                              </Badge>
                            )}
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
                              <DropdownMenuItem onClick={() => router.push(`/admin/team/${member._id}`)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleToggleActive(member._id, !!(member.isMember || member.isActive))}>
                                <UserCheck className="h-4 w-4 mr-2" />
                                {member.isMember || member.isActive ? 'Deactivate' : 'Activate'}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => handleDeleteMember(member._id)}
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