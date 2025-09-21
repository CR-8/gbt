"use client"

import { AdminLayout } from '@/modules/layouts'
import { EventsList } from '@/modules/sections/admin/events'
import { useEvents } from '@/modules/hooks'

export default function EventsPage() {
  const { events, loading, error } = useEvents()

  return (
    <AdminLayout>
      <EventsList events={events} loading={loading} />
    </AdminLayout>
  )
}