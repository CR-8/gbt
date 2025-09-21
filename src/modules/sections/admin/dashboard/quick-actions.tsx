"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Users, Calendar, FileText, Package } from "lucide-react"
import { useRouter } from "next/navigation"

export function QuickActions() {
  const router = useRouter()

  const actions = [
    {
      title: "Add New User",
      description: "Create a new user account",
      icon: Users,
      onClick: () => router.push('/admin/users/create'),
      variant: "default" as const
    },
    {
      title: "Create Event",
      description: "Set up a new event",
      icon: Calendar,
      onClick: () => router.push('/admin/events/create'),
      variant: "secondary" as const
    },
    {
      title: "Upload Document",
      description: "Add new documentation",
      icon: FileText,
      onClick: () => router.push('/admin/documents/upload'),
      variant: "outline" as const
    },
    {
      title: "Add Stock",
      description: "Update inventory",
      icon: Package,
      onClick: () => router.push('/admin/stock/add'),
      variant: "outline" as const
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common administrative tasks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {actions.map((action, index) => {
          const Icon = action.icon
          return (
            <Button
              key={index}
              variant={action.variant}
              className="w-full justify-start"
              onClick={action.onClick}
            >
              <Icon className="mr-2 h-4 w-4" />
              <div className="flex flex-col items-start">
                <span className="font-medium">{action.title}</span>
                <span className="text-xs text-muted-foreground">{action.description}</span>
              </div>
            </Button>
          )
        })}
      </CardContent>
    </Card>
  )
}