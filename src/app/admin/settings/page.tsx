"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/modules/layouts'
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
  Switch,
} from "@/components/ui/switch"
import {
  ArrowLeft,
  Save,
  RefreshCw,
  Settings,
  Globe,
  Mail,
  Shield,
  Database,
  Users,
  Bell,
  Palette,
  Code,
  FileText,
  Upload,
  Download,
  AlertCircle,
  CheckCircle,
  X,
  Plus,
  Trash2,
  Edit
} from "lucide-react"
import { toast } from "sonner"

interface SystemSettings {
  // General Settings
  siteName: string
  siteDescription: string
  siteUrl: string
  adminEmail: string
  timezone: string
  language: string
  
  // Features
  enableRegistration: boolean
  enableComments: boolean
  enableBlogFeatures: boolean
  enableEventFeatures: boolean
  enableDocumentFeatures: boolean
  enableInventoryFeatures: boolean
  
  // Email Settings
  emailProvider: string
  smtpHost: string
  smtpPort: number
  smtpUser: string
  smtpPassword: string
  emailFromName: string
  emailFromAddress: string
  
  // Security Settings
  enableTwoFactor: boolean
  sessionTimeout: number
  maxLoginAttempts: number
  passwordMinLength: number
  requireStrongPasswords: boolean
  
  // Notifications
  emailNotifications: boolean
  pushNotifications: boolean
  slackWebhook: string
  discordWebhook: string
  
  // Theme & Appearance
  primaryColor: string
  logoUrl: string
  faviconUrl: string
  customCSS: string
  
  // File Upload
  maxFileSize: number
  allowedFileTypes: string[]
  uploadPath: string
  
  // Backup Settings
  autoBackup: boolean
  backupFrequency: string
  backupRetention: number
  backupLocation: string
}

export default function SystemSettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState<SystemSettings>({
    // General Settings
    siteName: 'Robotics Club Portal',
    siteDescription: 'Advanced robotics club management system',
    siteUrl: 'https://roboticsclub.example.com',
    adminEmail: 'admin@roboticsclub.example.com',
    timezone: 'UTC',
    language: 'en',
    
    // Features
    enableRegistration: true,
    enableComments: true,
    enableBlogFeatures: true,
    enableEventFeatures: true,
    enableDocumentFeatures: true,
    enableInventoryFeatures: true,
    
    // Email Settings
    emailProvider: 'smtp',
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    emailFromName: 'Robotics Club',
    emailFromAddress: 'noreply@roboticsclub.example.com',
    
    // Security Settings
    enableTwoFactor: false,
    sessionTimeout: 1440, // 24 hours in minutes
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireStrongPasswords: true,
    
    // Notifications
    emailNotifications: true,
    pushNotifications: false,
    slackWebhook: '',
    discordWebhook: '',
    
    // Theme & Appearance
    primaryColor: '#3B82F6',
    logoUrl: '/logo.png',
    faviconUrl: '/favicon.ico',
    customCSS: '',
    
    // File Upload
    maxFileSize: 10, // MB
    allowedFileTypes: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'jpg', 'jpeg', 'png', 'gif'],
    uploadPath: '/uploads',
    
    // Backup Settings
    autoBackup: true,
    backupFrequency: 'daily',
    backupRetention: 30, // days
    backupLocation: 'local'
  })

  const [newFileType, setNewFileType] = useState('')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      // Simulate API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000))
      // Settings would be loaded from API here
    } catch (error) {
      console.error('Error fetching settings:', error)
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSettingChange = (field: keyof SystemSettings, value: string | number | boolean | string[]) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddFileType = () => {
    if (newFileType.trim() && !settings.allowedFileTypes.includes(newFileType.trim())) {
      handleSettingChange('allowedFileTypes', [...settings.allowedFileTypes, newFileType.trim().toLowerCase()])
      setNewFileType('')
    }
  }

  const handleRemoveFileType = (fileType: string) => {
    handleSettingChange('allowedFileTypes', settings.allowedFileTypes.filter(type => type !== fileType))
  }

  const handleSaveSettings = async () => {
    try {
      setSaving(true)
      
      // Validate required fields
      if (!settings.siteName.trim()) {
        toast.error('Site name is required')
        return
      }
      
      if (!settings.adminEmail.trim()) {
        toast.error('Admin email is required')
        return
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleTestEmailSettings = async () => {
    try {
      // Simulate testing email configuration
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success('Email settings test successful!')
    } catch (error) {
      toast.error('Email settings test failed')
    }
  }

  const timezones = [
    'UTC',
    'America/New_York',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Berlin',
    'Asia/Tokyo',
    'Asia/Mumbai',
    'Australia/Sydney'
  ]

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' }
  ]

  const emailProviders = [
    { value: 'smtp', label: 'SMTP' },
    { value: 'sendgrid', label: 'SendGrid' },
    { value: 'mailgun', label: 'Mailgun' },
    { value: 'ses', label: 'Amazon SES' }
  ]

  const backupFrequencies = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ]

  const backupLocations = [
    { value: 'local', label: 'Local Storage' },
    { value: 's3', label: 'Amazon S3' },
    { value: 'gcs', label: 'Google Cloud Storage' },
    { value: 'azure', label: 'Azure Blob Storage' }
  ]

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg">Loading settings...</div>
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
                <h1 className="text-2xl font-bold">System Settings</h1>
                <p className="text-muted-foreground">
                  Configure system-wide settings and preferences
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={fetchSettings}
                disabled={saving}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button
                onClick={handleSaveSettings}
                disabled={saving}
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>

          {/* Settings Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="backup">Backup</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    General Settings
                  </CardTitle>
                  <CardDescription>Basic site configuration and information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="siteName">Site Name *</Label>
                      <Input
                        id="siteName"
                        value={settings.siteName}
                        onChange={(e) => handleSettingChange('siteName', e.target.value)}
                        placeholder="Your site name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="siteUrl">Site URL</Label>
                      <Input
                        id="siteUrl"
                        value={settings.siteUrl}
                        onChange={(e) => handleSettingChange('siteUrl', e.target.value)}
                        placeholder="https://example.com"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="siteDescription">Site Description</Label>
                      <Textarea
                        id="siteDescription"
                        value={settings.siteDescription}
                        onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                        placeholder="Brief description of your site"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="adminEmail">Admin Email *</Label>
                      <Input
                        id="adminEmail"
                        type="email"
                        value={settings.adminEmail}
                        onChange={(e) => handleSettingChange('adminEmail', e.target.value)}
                        placeholder="admin@example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select value={settings.timezone} onValueChange={(value) => handleSettingChange('timezone', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timezones.map(tz => (
                            <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language">Default Language</Label>
                      <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map(lang => (
                            <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="features" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Feature Settings
                  </CardTitle>
                  <CardDescription>Enable or disable system features</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <Label>User Registration</Label>
                        <p className="text-sm text-muted-foreground">Allow new users to register accounts</p>
                      </div>
                      <Switch
                        checked={settings.enableRegistration}
                        onCheckedChange={(checked) => handleSettingChange('enableRegistration', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <Label>Comments System</Label>
                        <p className="text-sm text-muted-foreground">Enable comments on blog posts</p>
                      </div>
                      <Switch
                        checked={settings.enableComments}
                        onCheckedChange={(checked) => handleSettingChange('enableComments', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <Label>Blog Features</Label>
                        <p className="text-sm text-muted-foreground">Enable blog and content management</p>
                      </div>
                      <Switch
                        checked={settings.enableBlogFeatures}
                        onCheckedChange={(checked) => handleSettingChange('enableBlogFeatures', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <Label>Event Management</Label>
                        <p className="text-sm text-muted-foreground">Enable event creation and management</p>
                      </div>
                      <Switch
                        checked={settings.enableEventFeatures}
                        onCheckedChange={(checked) => handleSettingChange('enableEventFeatures', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <Label>Document Management</Label>
                        <p className="text-sm text-muted-foreground">Enable document upload and sharing</p>
                      </div>
                      <Switch
                        checked={settings.enableDocumentFeatures}
                        onCheckedChange={(checked) => handleSettingChange('enableDocumentFeatures', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <Label>Inventory Management</Label>
                        <p className="text-sm text-muted-foreground">Enable stock and inventory tracking</p>
                      </div>
                      <Switch
                        checked={settings.enableInventoryFeatures}
                        onCheckedChange={(checked) => handleSettingChange('enableInventoryFeatures', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="email" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Email Configuration
                  </CardTitle>
                  <CardDescription>Configure email delivery settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="emailProvider">Email Provider</Label>
                      <Select value={settings.emailProvider} onValueChange={(value) => handleSettingChange('emailProvider', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {emailProviders.map(provider => (
                            <SelectItem key={provider.value} value={provider.value}>{provider.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emailFromName">From Name</Label>
                      <Input
                        id="emailFromName"
                        value={settings.emailFromName}
                        onChange={(e) => handleSettingChange('emailFromName', e.target.value)}
                        placeholder="Your Organization"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emailFromAddress">From Email</Label>
                      <Input
                        id="emailFromAddress"
                        type="email"
                        value={settings.emailFromAddress}
                        onChange={(e) => handleSettingChange('emailFromAddress', e.target.value)}
                        placeholder="noreply@example.com"
                      />
                    </div>

                    {settings.emailProvider === 'smtp' && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="smtpHost">SMTP Host</Label>
                          <Input
                            id="smtpHost"
                            value={settings.smtpHost}
                            onChange={(e) => handleSettingChange('smtpHost', e.target.value)}
                            placeholder="smtp.gmail.com"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="smtpPort">SMTP Port</Label>
                          <Input
                            id="smtpPort"
                            type="number"
                            value={settings.smtpPort}
                            onChange={(e) => handleSettingChange('smtpPort', parseInt(e.target.value) || 587)}
                            placeholder="587"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="smtpUser">SMTP Username</Label>
                          <Input
                            id="smtpUser"
                            value={settings.smtpUser}
                            onChange={(e) => handleSettingChange('smtpUser', e.target.value)}
                            placeholder="your-email@gmail.com"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="smtpPassword">SMTP Password</Label>
                          <Input
                            id="smtpPassword"
                            type="password"
                            value={settings.smtpPassword}
                            onChange={(e) => handleSettingChange('smtpPassword', e.target.value)}
                            placeholder="your-app-password"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleTestEmailSettings}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Test Email Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>Configure security and authentication settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <Label>Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
                      </div>
                      <Switch
                        checked={settings.enableTwoFactor}
                        onCheckedChange={(checked) => handleSettingChange('enableTwoFactor', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <Label>Strong Password Requirements</Label>
                        <p className="text-sm text-muted-foreground">Enforce complex password rules</p>
                      </div>
                      <Switch
                        checked={settings.requireStrongPasswords}
                        onCheckedChange={(checked) => handleSettingChange('requireStrongPasswords', checked)}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        value={settings.sessionTimeout}
                        onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value) || 1440)}
                        min="30"
                        max="10080"
                      />
                      <p className="text-xs text-muted-foreground">Time before automatic logout (30 min - 7 days)</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                      <Input
                        id="maxLoginAttempts"
                        type="number"
                        value={settings.maxLoginAttempts}
                        onChange={(e) => handleSettingChange('maxLoginAttempts', parseInt(e.target.value) || 5)}
                        min="3"
                        max="10"
                      />
                      <p className="text-xs text-muted-foreground">Failed attempts before account lockout</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                      <Input
                        id="passwordMinLength"
                        type="number"
                        value={settings.passwordMinLength}
                        onChange={(e) => handleSettingChange('passwordMinLength', parseInt(e.target.value) || 8)}
                        min="6"
                        max="128"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Settings
                  </CardTitle>
                  <CardDescription>Configure notification preferences and webhooks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Send email notifications for important events</p>
                      </div>
                      <Switch
                        checked={settings.emailNotifications}
                        onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <Label>Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">Enable browser push notifications</p>
                      </div>
                      <Switch
                        checked={settings.pushNotifications}
                        onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="slackWebhook">Slack Webhook URL</Label>
                      <Input
                        id="slackWebhook"
                        value={settings.slackWebhook}
                        onChange={(e) => handleSettingChange('slackWebhook', e.target.value)}
                        placeholder="https://hooks.slack.com/services/..."
                      />
                      <p className="text-xs text-muted-foreground">Optional: Send notifications to Slack</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="discordWebhook">Discord Webhook URL</Label>
                      <Input
                        id="discordWebhook"
                        value={settings.discordWebhook}
                        onChange={(e) => handleSettingChange('discordWebhook', e.target.value)}
                        placeholder="https://discord.com/api/webhooks/..."
                      />
                      <p className="text-xs text-muted-foreground">Optional: Send notifications to Discord</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Appearance Settings
                  </CardTitle>
                  <CardDescription>Customize the look and feel of your application</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="primaryColor">Primary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="primaryColor"
                          type="color"
                          value={settings.primaryColor}
                          onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                          className="w-16 h-10"
                        />
                        <Input
                          value={settings.primaryColor}
                          onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                          placeholder="#3B82F6"
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="logoUrl">Logo URL</Label>
                      <Input
                        id="logoUrl"
                        value={settings.logoUrl}
                        onChange={(e) => handleSettingChange('logoUrl', e.target.value)}
                        placeholder="/logo.png"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="faviconUrl">Favicon URL</Label>
                      <Input
                        id="faviconUrl"
                        value={settings.faviconUrl}
                        onChange={(e) => handleSettingChange('faviconUrl', e.target.value)}
                        placeholder="/favicon.ico"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
                      <Input
                        id="maxFileSize"
                        type="number"
                        value={settings.maxFileSize}
                        onChange={(e) => handleSettingChange('maxFileSize', parseInt(e.target.value) || 10)}
                        min="1"
                        max="100"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="customCSS">Custom CSS</Label>
                      <Textarea
                        id="customCSS"
                        value={settings.customCSS}
                        onChange={(e) => handleSettingChange('customCSS', e.target.value)}
                        placeholder="/* Add your custom CSS here */"
                        rows={6}
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Allowed File Types</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newFileType}
                        onChange={(e) => setNewFileType(e.target.value)}
                        placeholder="Add file extension (e.g., pdf)"
                      />
                      <Button onClick={handleAddFileType} type="button">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {settings.allowedFileTypes.map(fileType => (
                        <Badge key={fileType} variant="secondary" className="flex items-center gap-1">
                          .{fileType}
                          <button
                            onClick={() => handleRemoveFileType(fileType)}
                            className="hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="backup" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Backup Settings
                  </CardTitle>
                  <CardDescription>Configure automatic backup and data retention</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg mb-4">
                    <div>
                      <Label>Automatic Backups</Label>
                      <p className="text-sm text-muted-foreground">Enable scheduled automatic backups</p>
                    </div>
                    <Switch
                      checked={settings.autoBackup}
                      onCheckedChange={(checked) => handleSettingChange('autoBackup', checked)}
                    />
                  </div>

                  {settings.autoBackup && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="backupFrequency">Backup Frequency</Label>
                        <Select value={settings.backupFrequency} onValueChange={(value) => handleSettingChange('backupFrequency', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {backupFrequencies.map(freq => (
                              <SelectItem key={freq.value} value={freq.value}>{freq.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="backupRetention">Retention Period (days)</Label>
                        <Input
                          id="backupRetention"
                          type="number"
                          value={settings.backupRetention}
                          onChange={(e) => handleSettingChange('backupRetention', parseInt(e.target.value) || 30)}
                          min="1"
                          max="365"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="backupLocation">Backup Location</Label>
                        <Select value={settings.backupLocation} onValueChange={(value) => handleSettingChange('backupLocation', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {backupLocations.map(location => (
                              <SelectItem key={location.value} value={location.value}>{location.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="uploadPath">Upload Path</Label>
                        <Input
                          id="uploadPath"
                          value={settings.uploadPath}
                          onChange={(e) => handleSettingChange('uploadPath', e.target.value)}
                          placeholder="/uploads"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4 border-t">
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Create Backup Now
                    </Button>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Restore from Backup
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
      </AdminLayout>
    )
}