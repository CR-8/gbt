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
  EyeOff,
  Star,
  Calendar,
  Trophy,
  Award,
  Medal,
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

interface Achievement {
  _id: string
  title: string
  description: string
  category: string
  year: number
  position: string
  event: string
  participants: string[]
  image: string
  featured: boolean
  visible: boolean
  createdAt: string
  updatedAt: string
}

export default function AchievementsManagementPage() {
  const router = useRouter()
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [yearFilter, setYearFilter] = useState('all')
  const [visibilityFilter, setVisibilityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('year')
  const [stats, setStats] = useState({
    totalAchievements: 0,
    visibleAchievements: 0,
    featuredAchievements: 0,
    currentYearAchievements: 0,
    firstPositions: 0,
    totalParticipants: 0
  })

  useEffect(() => {
    fetchAchievements()
    fetchStats()
  }, [])

  const fetchAchievements = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/achievements/get')
      if (response.ok) {
        const data = await response.json()
        setAchievements(data.achievements || [])
      }
    } catch (error) {
      console.error('Error fetching achievements:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/achievements-stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats || stats)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleToggleVisible = async (achievementId: string, visible: boolean) => {
    try {
      const response = await fetch(`/api/achievements/${achievementId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ visible: !visible })
      })
      
      if (response.ok) {
        fetchAchievements()
        fetchStats()
      }
    } catch (error) {
      console.error('Error updating achievement visibility:', error)
    }
  }

  const handleToggleFeatured = async (achievementId: string, featured: boolean) => {
    try {
      const response = await fetch(`/api/achievements/${achievementId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ featured: !featured })
      })
      
      if (response.ok) {
        fetchAchievements()
        fetchStats()
      }
    } catch (error) {
      console.error('Error updating achievement featured status:', error)
    }
  }

  const handleDeleteAchievement = async (achievementId: string) => {
    if (confirm('Are you sure you want to delete this achievement? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/achievements/${achievementId}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          fetchAchievements()
          fetchStats()
        }
      } catch (error) {
        console.error('Error deleting achievement:', error)
      }
    }
  }

  const filteredAchievements = achievements.filter(achievement => {
    const matchesSearch = achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         achievement.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         achievement.participants.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = categoryFilter === 'all' || achievement.category === categoryFilter
    const matchesYear = yearFilter === 'all' || achievement.year.toString() === yearFilter
    const matchesVisibility = visibilityFilter === 'all' ||
                             (visibilityFilter === 'visible' && achievement.visible) ||
                             (visibilityFilter === 'hidden' && !achievement.visible)
    
    return matchesSearch && matchesCategory && matchesYear && matchesVisibility
  })

  const sortedAchievements = [...filteredAchievements].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title)
      case 'event':
        return a.event.localeCompare(b.event)
      case 'position':
        return a.position.localeCompare(b.position)
      case 'createdAt':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      default:
        return b.year - a.year
    }
  })

  const categories = [...new Set(achievements.map(achievement => achievement.category))]
  const years = [...new Set(achievements.map(achievement => achievement.year))].sort((a, b) => b - a)

  const getPositionIcon = (position: string) => {
    if (position.includes('1st') || position.includes('First') || position.includes('Winner')) {
      return <Trophy className="h-4 w-4 text-yellow-500" />
    } else if (position.includes('2nd') || position.includes('Second')) {
      return <Medal className="h-4 w-4 text-gray-400" />
    } else if (position.includes('3rd') || position.includes('Third')) {
      return <Award className="h-4 w-4 text-orange-500" />
    } else {
      return <Award className="h-4 w-4 text-blue-500" />
    }
  }

  const getPositionBadgeVariant = (position: string) => {
    if (position.includes('1st') || position.includes('First') || position.includes('Winner')) {
      return 'default' as const
    } else if (position.includes('2nd') || position.includes('Second') || position.includes('3rd') || position.includes('Third')) {
      return 'secondary' as const
    } else {
      return 'outline' as const
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-lg">Loading achievements...</div>
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
            <div>
              <h1 className="text-2xl font-bold">Achievements Management</h1>
              <p className="text-muted-foreground">
                Manage team achievements, awards, and recognitions
              </p>
            </div>
            <Button onClick={() => router.push('/admin/achievements/create')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Achievement
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold">{stats.totalAchievements}</p>
                  </div>
                  <Trophy className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Visible</p>
                    <p className="text-2xl font-bold text-green-600">{stats.visibleAchievements}</p>
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
                    <p className="text-2xl font-bold text-blue-600">{stats.featuredAchievements}</p>
                  </div>
                  <Star className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">This Year</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.currentYearAchievements}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Winners</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.firstPositions}</p>
                  </div>
                  <Trophy className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Participants</p>
                    <p className="text-2xl font-bold">{stats.totalParticipants}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
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
                    placeholder="Search achievements..."
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

                <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="visible">Visible</SelectItem>
                    <SelectItem value="hidden">Hidden</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="year">Year</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="position">Position</SelectItem>
                    <SelectItem value="createdAt">Date Added</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Achievements Table */}
          <Card>
            <CardHeader>
              <CardTitle>Achievements ({sortedAchievements.length})</CardTitle>
              <CardDescription>Manage team achievements and awards</CardDescription>
            </CardHeader>
            <CardContent>
              {sortedAchievements.length === 0 ? (
                <div className="text-center py-8">
                  <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium">No achievements found</p>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || categoryFilter !== 'all' || yearFilter !== 'all' || visibilityFilter !== 'all'
                      ? 'Try adjusting your filters'
                      : 'Add your first achievement to get started'
                    }
                  </p>
                  <Button onClick={() => router.push('/admin/achievements/create')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Achievement
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Achievement</TableHead>
                      <TableHead>Event & Category</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Participants</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedAchievements.map((achievement) => (
                      <TableRow key={achievement._id}>
                        <TableCell>
                          <div className="flex items-start gap-3">
                            {achievement.image && (
                              <img
                                src={achievement.image}
                                alt={achievement.title}
                                className="w-12 h-12 rounded object-cover"
                              />
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="font-medium">{achievement.title}</p>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {achievement.description}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{achievement.event}</p>
                            <Badge variant="outline" className="mt-1">{achievement.category}</Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getPositionIcon(achievement.position)}
                            <Badge variant={getPositionBadgeVariant(achievement.position)}>
                              {achievement.position}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{achievement.year}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p className="font-medium">{achievement.participants.length} members</p>
                            <p className="text-muted-foreground truncate">
                              {achievement.participants.slice(0, 2).join(', ')}
                              {achievement.participants.length > 2 && ` +${achievement.participants.length - 2} more`}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {achievement.visible ? (
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                <Eye className="h-3 w-3 mr-1" />
                                Visible
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                <EyeOff className="h-3 w-3 mr-1" />
                                Hidden
                              </Badge>
                            )}
                            {achievement.featured && (
                              <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                                <Star className="h-3 w-3 mr-1" />
                                Featured
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
                              <DropdownMenuItem onClick={() => router.push(`/admin/achievements/${achievement._id}`)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleToggleVisible(achievement._id, achievement.visible)}>
                                {achievement.visible ? (
                                  <>
                                    <EyeOff className="h-4 w-4 mr-2" />
                                    Hide
                                  </>
                                ) : (
                                  <>
                                    <Eye className="h-4 w-4 mr-2" />
                                    Show
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleFeatured(achievement._id, achievement.featured)}>
                                <Star className="h-4 w-4 mr-2" />
                                {achievement.featured ? 'Unfeature' : 'Feature'}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => handleDeleteAchievement(achievement._id)}
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
    </AdminLayout>
  )
}