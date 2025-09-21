"use client"

import { AdminLayout } from '@/modules/layouts'
import { DataTable } from '@/components/common'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Download, Package, AlertTriangle } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"

interface Component {
  id: string
  name: string
  category: string
  subcategory: string
  quantity: number
  minStock: number
  unitPrice: number
  supplier: string
  location: string
  lastUpdated: string
  status: 'in-stock' | 'low-stock' | 'out-of-stock'
}

const componentColumns: ColumnDef<Component>[] = [
  {
    accessorKey: "name",
    header: "Component",
    cell: ({ row }) => {
      const component = row.original
      return (
        <div>
          <div className="font-medium">{component.name}</div>
          <div className="text-sm text-muted-foreground">{component.subcategory}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      return <Badge variant="outline">{row.getValue("category")}</Badge>
    },
  },
  {
    accessorKey: "quantity",
    header: "Stock",
    cell: ({ row }) => {
      const quantity = row.getValue("quantity") as number
      const minStock = row.original.minStock
      const status = row.original.status
      
      return (
        <div className="flex items-center gap-2">
          <span className={`font-medium ${status === 'low-stock' ? 'text-orange-600' : status === 'out-of-stock' ? 'text-red-600' : ''}`}>
            {quantity}
          </span>
          {status === 'low-stock' && <AlertTriangle className="h-4 w-4 text-orange-500" />}
          {status === 'out-of-stock' && <AlertTriangle className="h-4 w-4 text-red-500" />}
          <span className="text-sm text-muted-foreground">/ {minStock} min</span>
        </div>
      )
    },
  },
  {
    accessorKey: "unitPrice",
    header: "Unit Price",
    cell: ({ row }) => {
      const price = row.getValue("unitPrice") as number
      return `₹${price.toLocaleString()}`
    },
  },
  {
    accessorKey: "supplier",
    header: "Supplier",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const variants = {
        'in-stock': 'default',
        'low-stock': 'destructive',
        'out-of-stock': 'destructive'
      }
      return (
        <Badge variant={variants[status as keyof typeof variants]}>
          {status.replace('-', ' ').toUpperCase()}
        </Badge>
      )
    },
  }
]

export default function ComponentsPage() {
  const components: Component[] = [
    {
      id: "1",
      name: "Arduino Uno R3",
      category: "Electronics",
      subcategory: "Microcontrollers",
      quantity: 25,
      minStock: 10,
      unitPrice: 450,
      supplier: "ElectroLab",
      location: "Shelf A-1",
      lastUpdated: "2024-01-15",
      status: "in-stock"
    },
    {
      id: "2",
      name: "Servo Motor SG90",
      category: "Mechanical",
      subcategory: "Motors",
      quantity: 5,
      minStock: 15,
      unitPrice: 180,
      supplier: "RoboSpark",
      location: "Shelf B-2",
      lastUpdated: "2024-01-14",
      status: "low-stock"
    },
    {
      id: "3",
      name: "Ultrasonic Sensor HC-SR04",
      category: "Electronics",
      subcategory: "Sensors",
      quantity: 0,
      minStock: 8,
      unitPrice: 120,
      supplier: "SensorTech",
      location: "Shelf A-3",
      lastUpdated: "2024-01-12",
      status: "out-of-stock"
    }
  ]

  const categories = [
    { name: "Electronics", count: 45, value: "₹85,000" },
    { name: "Mechanical", count: 32, value: "₹65,000" },
    { name: "Tools", count: 28, value: "₹35,000" },
    { name: "Consumables", count: 156, value: "₹15,000" }
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Component Management</h1>
            <p className="text-muted-foreground">
              Manage individual components and parts inventory
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Component
            </Button>
          </div>
        </div>

        {/* Category Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{category.name}</p>
                    <p className="text-2xl font-bold">{category.count}</p>
                    <p className="text-xs text-muted-foreground">{category.value}</p>
                  </div>
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Components Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Components</CardTitle>
            <CardDescription>
              Detailed view of all components in inventory
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={componentColumns}
              data={components}
              searchKey="name"
              searchPlaceholder="Search components..."
            />
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Low Stock Alerts</CardTitle>
              <CardDescription>Components requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {components.filter(c => c.status !== 'in-stock').map((component, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{component.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {component.quantity} remaining (min: {component.minStock})
                      </p>
                    </div>
                    <Badge variant={component.status === 'out-of-stock' ? 'destructive' : 'secondary'}>
                      {component.status === 'out-of-stock' ? 'Reorder Now' : 'Low Stock'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest inventory changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Arduino Uno R3 restocked</p>
                    <p className="text-xs text-muted-foreground">Added 15 units • 2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Servo Motors running low</p>
                    <p className="text-xs text-muted-foreground">5 units remaining • 4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Ultrasonic sensors out of stock</p>
                    <p className="text-xs text-muted-foreground">Reorder required • 1 day ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}