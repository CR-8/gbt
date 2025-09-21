"use client"

import { useState, useEffect } from 'react'

interface Event {
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

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/events')
      
      if (!response.ok) {
        throw new Error('Failed to fetch events')
      }
      
      const data = await response.json()
      setEvents(data.events || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      // Fallback data for development
      setEvents([
        {
          id: "1",
          name: "Robotics Workshop 2024",
          description: "Hands-on workshop for building autonomous robots",
          startDate: "2024-03-15",
          endDate: "2024-03-16",
          location: "Engineering Lab A",
          status: "published",
          registrations: 45,
          maxCapacity: 50,
          category: "Workshop",
          poster: "/images/workshop-2024.jpg"
        },
        {
          id: "2",
          name: "AI & Machine Learning Symposium",
          description: "Industry experts discussing latest AI trends",
          startDate: "2024-04-20",
          endDate: "2024-04-20",
          location: "Main Auditorium",
          status: "ongoing",
          registrations: 120,
          maxCapacity: 150,
          category: "Symposium"
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  return { events, loading, error, refetch: fetchEvents }
}