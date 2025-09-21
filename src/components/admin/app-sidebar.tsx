"use client"

import * as React from "react"
import {
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  SquareTerminal,
  Package,
  Users,
  Calendar,
  FileText,
  FolderOpen,
} from "lucide-react"

import { NavMain } from "@/components/admin/nav-main"
import { NavProjects } from "@/components/admin/nav-projects"
import { NavUser } from "@/components/admin/nav-user"
import { TeamSwitcher } from "@/components/admin/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "Admin User",
    email: "admin@srmcem.edu.in",
    avatar: "/avatars/admin.jpg",
  },
  teams: [
    {
      name: "Robotics Club SRMCEM",
      logo: GalleryVerticalEnd,
      plan: "Admin Panel",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/admin",
        },
        {
          title: "Analytics",
          url: "/admin/analytics",
        },
        {
          title: "Reports",
          url: "/admin/reports",
        },
      ],
    },
    {
      title: "Stock Management",
      url: "/admin/stock",
      icon: Package,
      items: [
        {
          title: "Robot Inventory",
          url: "/admin/stock",
        },
        {
          title: "Components",
          url: "/admin/stock/components",
        },
        {
          title: "Add Stock",
          url: "/admin/stock/add",
        },
        {
          title: "Stock Reports",
          url: "/admin/stock/reports",
        },
      ],
    },
    {
      title: "Team Management",
      url: "/admin/team",
      icon: Users,
      items: [
        {
          title: "All Members",
          url: "/admin/team",
        },
        {
          title: "Add Member",
          url: "/admin/team/create",
        },
        {
          title: "Roles & Permissions",
          url: "/admin/team/roles",
        },
        {
          title: "Team Analytics",
          url: "/admin/team/analytics",
        },
      ],
    },
    {
      title: "Event Management",
      url: "/admin/events",
      icon: Calendar,
      items: [
        {
          title: "All Events",
          url: "/admin/events",
        },
        {
          title: "Create Event",
          url: "/admin/events/create",
        },
        {
          title: "Event Analytics",
          url: "/admin/events/analytics",
        },
        {
          title: "Registrations",
          url: "/admin/events/registrations",
        },
      ],
    },
    {
      title: "Document Management",
      url: "/admin/documents",
      icon: FolderOpen,
      items: [
        {
          title: "All Documents",
          url: "/admin/documents",
        },
        {
          title: "Upload Document",
          url: "/admin/documents/upload",
        },
        {
          title: "Categories",
          url: "/admin/documents/categories",
        },
        {
          title: "Archive",
          url: "/admin/documents/archive",
        },
      ],
    },
    {
      title: "Blog Management",
      url: "/admin/blogs",
      icon: FileText,
      items: [
        {
          title: "All Posts",
          url: "/admin/blogs",
        },
        {
          title: "Create Post",
          url: "/admin/blogs/create",
        },
        {
          title: "Categories",
          url: "/admin/blogs/categories",
        },
        {
          title: "Blog Analytics",
          url: "/admin/blogs/analytics",
        },
      ],
    },
  ],
  projects: [
    {
      name: "System Settings",
      url: "/admin/settings",
      icon: Frame,
    },
    {
      name: "Database Backup",
      url: "/admin/backup",
      icon: PieChart,
    },
    {
      name: "Logs & Monitoring",
      url: "/admin/logs",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
