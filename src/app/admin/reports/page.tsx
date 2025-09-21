"use client"

import { AdminLayout } from '@/modules/layouts'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Download, 
  FileText, 
  Calendar, 
  Users, 
  Package,
  TrendingUp,
  BarChart3,
  PieChart
} from "lucide-react"

export default function ReportsPage() {
  const reports = [
    {
      title: "Monthly Activity Report",
      description: "Comprehensive overview of all club activities",
      category: "General",
      lastGenerated: "2024-01-15",
      size: "2.3 MB",
      format: "PDF"
    },
    {
      title: "Financial Summary",
      description: "Budget utilization and expense tracking",
      category: "Finance",
      lastGenerated: "2024-01-10",
      size: "1.8 MB",
      format: "Excel"
    },
    {
      title: "Event Attendance Report",
      description: "Detailed analysis of event participation",
      category: "Events",
      lastGenerated: "2024-01-12",
      size: "1.2 MB",
      format: "PDF"
    },
    {
      title: "Inventory Status Report",
      description: "Current stock levels and procurement needs",
      category: "Inventory",
      lastGenerated: "2024-01-14",
      size: "956 KB",
      format: "PDF"
    },
    {
      title: "Member Performance Report",
      description: "Individual and team performance metrics",
      category: "Team",
      lastGenerated: "2024-01-08",
      size: "3.1 MB",
      format: "PDF"
    },
    {
      title: "Competition Analysis",
      description: "Performance in external competitions",
      category: "Competitions",
      lastGenerated: "2024-01-05",
      size: "2.7 MB",
      format: "PDF"
    }
  ]

  const quickReports = [
    {
      title: "User Summary",
      description: "Current active users and registrations",
      icon: Users,
      action: "Generate"
    },
    {
      title: "Event Summary",
      description: "Upcoming and past events overview",
      icon: Calendar,
      action: "Generate"
    },
    {
      title: "Stock Summary",
      description: "Current inventory and low stock alerts",
      icon: Package,
      action: "Generate"
    },
    {
      title: "Financial Summary",
      description: "Budget and expense overview",
      icon: TrendingUp,
      action: "Generate"
    }
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Reports & Analytics</h1>
            <p className="text-muted-foreground">
              Generate and download detailed reports for club management
            </p>
          </div>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Create Custom Report
          </Button>
        </div>

        {/* Quick Report Generation */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Reports</CardTitle>
            <CardDescription>
              Generate instant reports for key metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickReports.map((report, index) => {
                const Icon = report.icon
                return (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">{report.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{report.description}</p>
                    <Button size="sm" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      {report.action}
                    </Button>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>
              Previously generated reports available for download
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">{report.title}</h3>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <Badge variant="outline">{report.category}</Badge>
                        <span className="text-xs text-muted-foreground">
                          Generated: {new Date(report.lastGenerated).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Size: {report.size}
                        </span>
                        <Badge variant="secondary">{report.format}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="ghost" size="sm">
                      Regenerate
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Report Categories */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Performance Reports
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                Member Performance Analysis
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                Event Success Metrics
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                Project Completion Rates
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                Competition Performance
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Financial Reports
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                Budget vs Actual Spending
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                Category-wise Expenses
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                Revenue & Income Sources
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                Procurement Analysis
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Operational Reports
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                Resource Utilization
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                Equipment Maintenance
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                Safety & Compliance
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                Academic Integration
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}