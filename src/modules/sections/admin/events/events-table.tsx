"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Calendar, Users, MapPin } from "lucide-react"
import Link from "next/link"

export interface Event {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  location: string
  status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled'
  registrations: number
  maxCapacity: number
  poster?: string
  category: string
}

export const eventColumns: ColumnDef<Event>[] = [
  {
    accessorKey: "name",
    header: "Event",
    cell: ({ row }) => {
      const event = row.original
      return (
        <div className="flex items-center gap-3">
          {event.poster && (
            <img 
              src={event.poster} 
              alt={event.name} 
              className="w-10 h-10 rounded object-cover"
            />
          )}
          <div>
            <div className="font-medium">{event.name}</div>
            <div className="text-sm text-muted-foreground line-clamp-1">
              {event.description}
            </div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "startDate",
    header: "Date",
    cell: ({ row }) => {
      const startDate = new Date(row.getValue("startDate"))
      const endDate = new Date(row.original.endDate)
      return (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <div>
            <div className="font-medium">{startDate.toLocaleDateString()}</div>
            <div className="text-xs text-muted-foreground">
              to {endDate.toLocaleDateString()}
            </div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>{row.getValue("location")}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const statusColors = {
        draft: "secondary",
        published: "default",
        ongoing: "default",
        completed: "secondary",
        cancelled: "destructive"
      }
      return (
        <Badge variant={statusColors[status as keyof typeof statusColors] as any}>
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "registrations",
    header: "Registrations",
    cell: ({ row }) => {
      const registrations = row.getValue("registrations") as number
      const maxCapacity = row.original.maxCapacity
      return (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>{registrations}/{maxCapacity}</span>
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
    id: "actions",
    cell: ({ row }) => {
      const event = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/admin/events/${event.id}`}>
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Edit Event</DropdownMenuItem>
            <DropdownMenuItem>View Registrations</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              Cancel Event
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]