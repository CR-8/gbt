"use client"

import { AdminLayout } from '@/modules/layouts'
import { StatsCard } from '@/components/common'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartAreaInteractive } from "@/components/admin/chart-area-interactive"
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Package,
  FileText,
  Trophy,
  DollarSign,
  Activity
} from "lucide-react"

export default function AnalyticsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive analytics and insights for your robotics club
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Growth Rate"
            value="12.5%"
            description="Month over month"
            icon={TrendingUp}
            trend={{ value: 2.1, isPositive: true }}
          />
          <StatsCard
            title="Active Users"
            value="156"
            description="Currently online"
            icon={Users}
            trend={{ value: 5.2, isPositive: true }}
          />
          <StatsCard
            title="Event Participation"
            value="89%"
            description="Average attendance"
            icon={Calendar}
            trend={{ value: 3.1, isPositive: true }}
          />
          <StatsCard
            title="Budget Utilization"
            value="₹75,000"
            description="This semester"
            icon={DollarSign}
            trend={{ value: -1.2, isPositive: false }}
          />
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>User Growth Trend</CardTitle>
              <CardDescription>Monthly user registration and activity</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartAreaInteractive />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Event Performance</CardTitle>
              <CardDescription>Event attendance and engagement metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Workshop Attendance</span>
                  <span className="text-sm font-bold">92%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{width: '92%'}}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Competition Participation</span>
                  <span className="text-sm font-bold">78%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{width: '78%'}}></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Member Engagement</span>
                  <span className="text-sm font-bold">85%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{width: '85%'}}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Activity Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Daily Active Users</span>
                  <span className="font-medium">45</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Weekly Active Users</span>
                  <span className="font-medium">120</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Monthly Active Users</span>
                  <span className="font-medium">156</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Avg. Session Duration</span>
                  <span className="font-medium">25 min</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Inventory Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Total Items</span>
                  <span className="font-medium">245</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Low Stock Items</span>
                  <span className="font-medium text-orange-600">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Out of Stock</span>
                  <span className="font-medium text-red-600">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total Value</span>
                  <span className="font-medium">₹1,50,000</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Competitions Won</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Certifications</span>
                  <span className="font-medium">34</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Projects Completed</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Awards Received</span>
                  <span className="font-medium">6</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}