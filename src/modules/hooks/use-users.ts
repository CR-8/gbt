"use client"

import { useState, useEffect } from 'react'

interface User {
  id: string
  name: string
  email: string
  phone: string
  institution: string
  year: string
  registrationDate: string
  status: string
  role: string
  eventsRegistered: number
  avatar: string
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/users')
      
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      
      const data = await response.json()
      setUsers(data.users || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      // Fallback data for development
      setUsers([
        {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          phone: "+91 9876543210",
          institution: "SRMCEM",
          year: "2024",
          registrationDate: "2024-01-15",
          status: "active",
          role: "student",
          eventsRegistered: 3,
          avatar: "/avatars/01.png"
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane@example.com",
          phone: "+91 9876543211",
          institution: "SRMCEM",
          year: "2023",
          registrationDate: "2024-02-10",
          status: "active",
          role: "admin",
          eventsRegistered: 5,
          avatar: "/avatars/02.png"
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return { users, loading, error, refetch: fetchUsers }
}