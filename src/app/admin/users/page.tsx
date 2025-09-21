"use client"

import { AdminLayout } from '@/modules/layouts'
import { UsersList } from '@/modules/sections/admin/users'
import { useUsers } from '@/modules/hooks'

export default function UsersPage() {
  const { users, loading, error } = useUsers()

  return (
    <AdminLayout>
      <UsersList users={users} loading={loading} />
    </AdminLayout>
  )
}