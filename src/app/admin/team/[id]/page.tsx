"use client"

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
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
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft,
  Upload,
  User,
  Save,
  X,
  Loader2
} from "lucide-react"
import { toast } from "sonner"

interface TeamMember {
  _id: string
  name: string
  rollNo: string
  course: string
  branch: string
  image: string
  year: number
  activity: boolean
  Role: string
  department: string
  yearOfLeaving?: number
  isMember: boolean
  createdAt: string
  updatedAt: string
}

export default function EditTeamMemberPage() {
  const router = useRouter()
  const params = useParams()
  const memberId = params.id as string

  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    course: '',
    branch: '',
    year: '',
    activity: false,
    Role: '',
    department: '',
    yearOfLeaving: '',
    isMember: true,
    image: null as File | null
  })

  useEffect(() => {
    if (memberId) {
      fetchTeamMember()
    }
  }, [memberId])

  const fetchTeamMember = async () => {
    try {
      setFetchLoading(true)
      const response = await fetch(`/api/team/read?id=${memberId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch team member')
      }
      const member: TeamMember = await response.json()

      setFormData({
        name: member.name,
        rollNo: member.rollNo,
        course: member.course,
        branch: member.branch,
        year: member.year.toString(),
        activity: member.activity,
        Role: member.Role,
        department: member.department,
        yearOfLeaving: member.yearOfLeaving?.toString() || '',
        isMember: member.isMember,
        image: null
      })

      setImagePreview(member.image)
    } catch (error) {
      console.error('Error fetching team member:', error)
      toast.error('Failed to load team member data')
      router.push('/admin/team')
    } finally {
      setFetchLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, image: file }))
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)

    try {
      const submitData = new FormData()
      submitData.append('name', formData.name)
      submitData.append('rollNo', formData.rollNo)
      submitData.append('course', formData.course)
      submitData.append('branch', formData.branch)
      submitData.append('year', formData.year)
      submitData.append('activity', formData.activity.toString())
      submitData.append('Role', formData.Role)
      submitData.append('department', formData.department)
      submitData.append('yearOfLeaving', formData.yearOfLeaving || '')
      submitData.append('isMember', formData.isMember.toString())

      if (formData.image) {
        submitData.append('image', formData.image)
      }

      const response = await fetch(`/api/team/update?id=${memberId}`, {
        method: 'PUT',
        body: submitData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update team member')
      }

      const result = await response.json()
      toast.success('Team member updated successfully!')
      router.push('/admin/team')
    } catch (error) {
      console.error('Error updating team member:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update team member')
    } finally {
      setLoading(false)
    }
  }

  const departments = [
    'Computer Science',
    'Information Technology',
    'Electronics',
    'Mechanical',
    'Civil',
    'Electrical',
    'Chemical',
    'Biotechnology',
    'Other'
  ]

  const courses = [
    'B.Tech',
    'B.E.',
    'M.Tech',
    'M.E.',
    'MCA',
    'BCA',
    'Other'
  ]

  const branches = [
    'Computer Science',
    'Information Technology',
    'Electronics & Communication',
    'Electrical',
    'Mechanical',
    'Civil',
    'Chemical',
    'Biotechnology',
    'Other'
  ]

  if (fetchLoading) {
    return (
      <AdminLayout>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading team member...</span>
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
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
              <h1 className="text-2xl font-bold">Edit Team Member</h1>
              <p className="text-muted-foreground">
                Update team member information
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              {/* Image Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Profile Image</CardTitle>
                  <CardDescription>
                    Update the profile picture (optional)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center gap-4">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src={imagePreview} alt="Preview" />
                      <AvatarFallback>
                        <User className="h-16 w-16" />
                      </AvatarFallback>
                    </Avatar>

                    <div className="w-full">
                      <Label htmlFor="image-upload" className="cursor-pointer">
                        <div className="flex items-center justify-center w-full h-10 px-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                          <Upload className="h-4 w-4 mr-2" />
                          <span className="text-sm">
                            {formData.image ? 'Change Image' : 'Update Image (Optional)'}
                          </span>
                        </div>
                        <Input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </Label>
                      {formData.image && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Selected: {formData.image.name}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Basic Information */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Basic Information</CardTitle>
                  <CardDescription>
                    Update the team member&apos;s personal and academic details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter full name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rollNo">Roll Number *</Label>
                      <Input
                        id="rollNo"
                        value={formData.rollNo}
                        onChange={(e) => handleInputChange('rollNo', e.target.value)}
                        placeholder="Enter roll number"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="course">Course *</Label>
                      <Select value={formData.course} onValueChange={(value) => handleInputChange('course', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select course" />
                        </SelectTrigger>
                        <SelectContent>
                          {courses.map(course => (
                            <SelectItem key={course} value={course}>{course}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="branch">Branch *</Label>
                      <Select value={formData.branch} onValueChange={(value) => handleInputChange('branch', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                        <SelectContent>
                          {branches.map(branch => (
                            <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="year">Year *</Label>
                      <Select value={formData.year} onValueChange={(value) => handleInputChange('year', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1st Year</SelectItem>
                          <SelectItem value="2">2nd Year</SelectItem>
                          <SelectItem value="3">3rd Year</SelectItem>
                          <SelectItem value="4">4th Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="department">Department *</Label>
                      <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map(dept => (
                            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="yearOfLeaving">Year of Leaving (Optional)</Label>
                    <Input
                      id="yearOfLeaving"
                      type="number"
                      value={formData.yearOfLeaving}
                      onChange={(e) => handleInputChange('yearOfLeaving', e.target.value)}
                      placeholder="e.g., 2024"
                      min="2000"
                      max="2030"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Role and Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Role & Status</CardTitle>
                <CardDescription>
                  Update the team member&apos;s role and current status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="Role">Role *</Label>
                    <Select value={formData.Role} onValueChange={(value) => handleInputChange('Role', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HOD">HOD</SelectItem>
                        <SelectItem value="Coordinator">Coordinator</SelectItem>
                        <SelectItem value="Assistant Coordinator">Assistant Coordinator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2 pt-8">
                    <Checkbox
                      id="isMember"
                      checked={formData.isMember}
                      onCheckedChange={(checked) => handleInputChange('isMember', checked as boolean)}
                    />
                    <Label htmlFor="isMember">Active Member</Label>
                  </div>

                  <div className="flex items-center space-x-2 pt-8">
                    <Checkbox
                      id="activity"
                      checked={formData.activity}
                      onCheckedChange={(checked) => handleInputChange('activity', checked as boolean)}
                    />
                    <Label htmlFor="activity">Active in Activities</Label>
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
              <Button type="submit" disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Updating...' : 'Update Team Member'}
              </Button>
            </div>
          </form>
        </div>
    </AdminLayout>
  )
}