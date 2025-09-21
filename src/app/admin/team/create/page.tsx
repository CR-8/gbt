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
  X
} from "lucide-react"
import { toast } from "sonner"

export default function CreateTeamMemberPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
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

    if (!formData.image) {
      toast.error('Please select an image for the team member')
      return
    }

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
      submitData.append('image', formData.image)

      const response = await fetch('/api/team/create', {
        method: 'POST',
        body: submitData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create team member')
      }

      toast.success('Team member created successfully!')
      router.push('/admin/team')
    } catch (error) {
      console.error('Error creating team member:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create team member')
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
              <h1 className="text-2xl font-bold">Add Team Member</h1>
              <p className="text-muted-foreground">
                Create a new team member profile
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
                    Upload a profile picture for the team member
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
                            {formData.image ? 'Change Image' : 'Upload Image'}
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
                    Enter the team member&apos;s personal and academic details
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
                  Define the team member&apos;s role and current status
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
                {loading ? 'Creating...' : 'Create Team Member'}
              </Button>
            </div>
          </form>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}