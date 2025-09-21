'use client'

import React, { useState, useEffect } from 'react'
import TeamMemberCard from './TeamMemberCard'

interface SocialLinks {
  email: string
  linkedin: string
  github: string
  instagram: string
}

interface TeamMember {
  _id: string
  name: string
  Role: string
  image: string
  yearOfLeaving: number
  social: SocialLinks
  isActive: boolean
  isAlumni: boolean
}

interface YearGroup {
  year: number
  members: TeamMember[]
}

interface RoleGroup {
  role: string
  yearGroups: YearGroup[]
}

function ChronologicalTeam() {
  const [teamData, setTeamData] = useState<RoleGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTeamData()
  }, [])

  const fetchTeamData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/team/read')
      const data: TeamMember[] = await response.json()

      const groupedData = groupByRoleAndYear(data)
      setTeamData(groupedData)
    } catch (err) {
      setError('Failed to fetch team data')
      console.error('Error fetching team data:', err)
    } finally {
      setLoading(false)
    }
  }

  const groupByRoleAndYear = (members: TeamMember[]): RoleGroup[] => {
    // Define role hierarchy order
    const roleOrder = ['HOD', 'Coordinator', 'Assistant Coordinator']

    // Separate current members and alumni
    const currentMembers = members.filter(member => member.isActive && !member.isAlumni)
    const alumniMembers = members.filter(member => member.isAlumni)

    // Group current members by role, then by year
    const currentGrouped = roleOrder.map(role => {
      const roleMembers = currentMembers.filter(member => member.Role === role)

      // Group by year of leaving
      const yearGroups = roleMembers.reduce((acc, member) => {
        const year = member.yearOfLeaving || new Date().getFullYear()
        if (!acc[year]) {
          acc[year] = []
        }
        acc[year].push(member)
        return acc
      }, {} as Record<number, TeamMember[]>)

      // Convert to array and sort years descending (newest first)
      const sortedYearGroups: YearGroup[] = Object.entries(yearGroups)
        .map(([year, members]) => ({
          year: parseInt(year),
          members
        }))
        .sort((a, b) => b.year - a.year)

      return {
        role,
        yearGroups: sortedYearGroups
      }
    }).filter(group => group.yearGroups.length > 0)

    // Group alumni by year of leaving
    const alumniYearMap = alumniMembers.reduce((acc, member) => {
      const year = member.yearOfLeaving || new Date().getFullYear()
      if (!acc[year]) {
        acc[year] = []
      }
      acc[year].push(member)
      return acc
    }, {} as Record<number, TeamMember[]>)

    const alumniGrouped: RoleGroup = {
      role: 'Alumni',
      yearGroups: Object.entries(alumniYearMap)
        .map(([year, members]) => ({
          year: parseInt(year),
          members
        }))
        .sort((a, b) => b.year - a.year)
    }

    // Combine current members and alumni
    const result = [...currentGrouped]
    if (alumniGrouped.yearGroups.length > 0) {
      result.push(alumniGrouped)
    }

    return result
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg text-gray-600">Loading team data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {teamData.map((roleGroup, roleIndex) => (
        <div key={roleGroup.role} className="mb-16">
          {/* Role Title */}
          <h2 className="text-4xl font-bold text-center mb-12 text-red-600 border-b-2 border-red-200 pb-4">
            {roleGroup.role === 'Assistant Coordinator' ? 'Assistant Coordinators' : roleGroup.role + 's'}
          </h2>

          {/* Year Groups */}
          {roleGroup.yearGroups.map((yearGroup) => (
            <div key={yearGroup.year} className="mb-12">
              {/* Year Title */}
              <h3 className="text-2xl font-semibold text-center mb-8 text-gray-800">
                {yearGroup.year} Batch
              </h3>

              {/* Members Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center">
                {yearGroup.members.map((member) => (
                  <TeamMemberCard
                    key={member._id}
                    member={member}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default ChronologicalTeam