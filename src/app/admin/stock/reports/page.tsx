"use client"

import { AdminLayout } from '@/modules/layouts'
import { StatsCard } from '@/components/common'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartAreaInteractive } from "@/components/admin/chart-area-interactive"
import { 
  Package, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  DollarSign,
  ShoppingCart,
  Download,
  BarChart3
} from "lucide-react"

export default function StockReportsPage() {
  const inventoryMetrics = [
    {
      title: "Total Inventory Value",
      value: "₹2,50,000",
      description: "Current stock value",
      icon: DollarSign,
      trend: { value: 8.2, isPositive: true }
    },
    {
      title: "Items in Stock",
      value: "245",
      description: "Total unique items",
      icon: Package,
      trend: { value: 3.1, isPositive: true }
    },
    {
      title: "Low Stock Items",
      value: "12",
      description: "Require attention",
      icon: AlertTriangle,
      trend: { value: 2.3, isPositive: false }
    },
    {
      title: "Monthly Consumption",
      value: "₹18,500",
      description: "This month's usage",
      icon: ShoppingCart,
      trend: { value: 1.2, isPositive: false }
    }
  ]

  const reports = [
    {
      title: "Inventory Valuation Report",
      description: "Complete financial overview of all stock items",
      category: "Financial",
      frequency: "Monthly",
      lastGenerated: "2024-01-15",
      size: "2.8 MB"
    },
    {
      title: "Stock Movement Analysis",
      description: "In/out movement tracking and trends",
      category: "Movement",
      frequency: "Weekly",
      lastGenerated: "2024-01-12",
      size: "1.5 MB"
    },
    {
      title: "Low Stock Alert Report",
      description: "Items requiring immediate reordering",
      category: "Alerts",
      frequency: "Daily",
      lastGenerated: "2024-01-16",
      size: "456 KB"
    },
    {
      title: "Supplier Performance Report",
      description: "Vendor analysis and delivery metrics",
      category: "Suppliers",
      frequency: "Monthly",
      lastGenerated: "2024-01-10",
      size: "1.2 MB"
    },
    {
      title: "Category-wise Usage Report",
      description: "Consumption patterns by category",
      category: "Usage",
      frequency: "Monthly",
      lastGenerated: "2024-01-08",
      size: "980 KB"
    },
    {
      title: "Dead Stock Analysis",
      description: "Unused items and optimization suggestions",
      category: "Optimization",
      frequency: "Quarterly",
      lastGenerated: "2024-01-01",
      size: "756 KB"
    }
  ]

  const topCategories = [
    { name: "Electronics", value: "₹1,20,000", percentage: 48, items: 89 },
    { name: "Mechanical", value: "₹75,000", percentage: 30, items: 56 },
    { name: "Tools", value: "₹35,000", percentage: 14, items: 34 },
    { name: "Consumables", value: "₹20,000", percentage: 8, items: 66 }
  ]

  const recentMovements = [
    { type: "IN", item: "Arduino Mega 2560", quantity: 10, value: "₹7,500", date: "2024-01-15" },
    { type: "OUT", item: "Servo Motors", quantity: 8, value: "₹1,440", date: "2024-01-14" },
    { type: "IN", item: "Ultrasonic Sensors", quantity: 15, value: "₹1,800", date: "2024-01-13" },
    { type: "OUT", item: "Jumper Wires", quantity: 50, value: "₹500", date: "2024-01-12" },
    { type: "IN", item: "Power Supplies", quantity: 5, value: "₹12,500", date: "2024-01-11" }
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Stock Reports & Analytics</h1>
            <p className="text-muted-foreground">
              Comprehensive inventory analysis and reporting
            </p>
          </div>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export All Reports
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {inventoryMetrics.map((metric, index) => (
            <StatsCard
              key={index}
              title={metric.title}
              value={metric.value}
              description={metric.description}
              icon={metric.icon}
              trend={metric.trend}
            />
          ))}
        </div>

        {/* Charts and Analysis */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Trend</CardTitle>
              <CardDescription>Monthly inventory value changes</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartAreaInteractive />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Category Distribution</CardTitle>
              <CardDescription>Value distribution by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCategories.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{category.name}</span>
                      <span className="text-muted-foreground">{category.value} ({category.items} items)</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{width: `${category.percentage}%`}}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Movements */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Stock Movements</CardTitle>
            <CardDescription>Latest inventory transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMovements.map((movement, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${movement.type === 'IN' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <div>
                      <p className="font-medium">{movement.item}</p>
                      <p className="text-sm text-muted-foreground">
                        {movement.type === 'IN' ? 'Added' : 'Used'} {movement.quantity} units
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{movement.value}</p>
                    <p className="text-sm text-muted-foreground">{new Date(movement.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Available Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Available Reports</CardTitle>
            <CardDescription>Generate and download detailed inventory reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {reports.map((report, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{report.title}</h3>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                    </div>
                    <BarChart3 className="h-5 w-5 text-muted-foreground" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Category:</span>
                      <span className="font-medium">{report.category}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Frequency:</span>
                      <span className="font-medium">{report.frequency}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Last Generated:</span>
                      <span className="font-medium">{new Date(report.lastGenerated).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Size:</span>
                      <span className="font-medium">{report.size}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button size="sm" variant="outline">
                      Generate
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}