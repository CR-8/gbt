import React from 'react'
import Image from 'next/image'
import { Linkedin, Github, Instagram, Mail } from 'lucide-react'

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
}

interface TeamMemberCardProps {
  member: TeamMember
}

function TeamMemberCard({ member }: TeamMemberCardProps) {
  return (
    <div className="group relative">
      {/* Main Card */}
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4 text-center">
        <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden bg-gray-200">
          <Image
            src={member.image}
            alt={member.name}
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">
          {member.name}
        </h3>
        <p className="text-xs text-gray-600">
          {member.Role}
        </p>
      </div>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
        <div className="bg-gray-900 text-white rounded-lg p-4 shadow-lg min-w-[250px]">
          <div className="flex items-center gap-3 mb-3">
            <Image
              src={member.image}
              alt={member.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <h4 className="font-semibold text-sm">{member.name}</h4>
              <p className="text-xs text-gray-300">{member.Role}</p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex gap-2">
            {member.social?.email && member.social.email !== "" && (
              <a
                href={`mailto:${member.social.email}`}
                className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Mail size={14} />
              </a>
            )}
            {member.social?.linkedin && member.social.linkedin !== "#" && (
              <a
                href={member.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Linkedin size={14} />
              </a>
            )}
            {member.social?.github && member.social.github !== "#" && (
              <a
                href={member.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Github size={14} />
              </a>
            )}
            {member.social?.instagram && member.social.instagram !== "#" && (
              <a
                href={member.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Instagram size={14} />
              </a>
            )}
          </div>
        </div>

        {/* Tooltip Arrow */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  )
}

export default TeamMemberCard