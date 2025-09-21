"use client"

import { useState } from "react"
import { DataTable } from "@/components/common"
import { Button } from "@/components/ui/button"
import { UserPlus, Download } from "lucide-react"
import { userColumns, User } from "./users-table"
import { useRouter } from "next/navigation"

interface UsersListProps {
  users: User[]
  loading: boolean
}

export function UsersList({ users, loading }: UsersListProps) {
  const router = useRouter()

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-10 bg-gray-200 rounded w-20 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
        </div>
        <div className="h-96 bg-gray-100 rounded animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts and permissions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => router.push('/admin/users/create')}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      <DataTable
        columns={userColumns}
        data={users}
        searchKey="name"
        searchPlaceholder="Search users..."
      />
    </div>
  )
}