"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Linkedin, Mail, Instagram, Github, Award, Users, Calendar, Search } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Team Member Interface
interface TeamMember {
    _id: string;
    name: string;
    role: string;
    department: string;
    bio: string;
    image: string;
    skills: string[];
    social: {
        email: string;
        linkedin: string;
        github: string;
        instagram: string;
    };
    isAlumni: boolean;
    batch: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

function Team() {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>([]);
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const marqueeRef = useRef<HTMLDivElement>(null);

    // Get current batch year (June of current year + 1)
    const getCurrentBatchYear = () => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11
        
        // If we're past June, use next year's batch
        const batchYear = currentMonth >= 6 ? currentYear + 1 : currentYear;
        return `June ${batchYear}`;
    };

    // Fetch team members from API
    const fetchTeamMembers = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const currentBatch = getCurrentBatchYear();
            console.log('🎓 Fetching leadership members for batch:', currentBatch);
            
            // Fetch active members from the current batch (June of current year + 1)
            const response = await fetch(`/api/TeamMembers/read?isActive=true&batch=${encodeURIComponent(currentBatch)}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Filter to show ONLY leadership/HOD roles
            const leadershipRoles = ['hod', 'head', 'president', 'vice president', 'secretary', 'lead', 'director', 'captain', 'coordinator', 'manager'];
            
            const leadershipMembers = data.filter((member: TeamMember) => {
                return leadershipRoles.some(role => 
                    member.role.toLowerCase().includes(role)
                );
            });
            
            // Sort leadership members by role importance
            const sortedLeadership = leadershipMembers.sort((a: TeamMember, b: TeamMember) => {
                const getRoleRank = (role: string) => {
                    const lowerRole = role.toLowerCase();
                    if (lowerRole.includes('president')) return 1;
                    if (lowerRole.includes('hod') || lowerRole.includes('head')) return 2;
                    if (lowerRole.includes('vice president')) return 3;
                    if (lowerRole.includes('secretary')) return 4;
                    if (lowerRole.includes('director')) return 5;
                    if (lowerRole.includes('lead')) return 6;
                    if (lowerRole.includes('captain')) return 7;
                    if (lowerRole.includes('coordinator')) return 8;
                    if (lowerRole.includes('manager')) return 9;
                    return 10;
                };
                
                const rankA = getRoleRank(a.role);
                const rankB = getRoleRank(b.role);
                
                if (rankA !== rankB) return rankA - rankB;
                return a.name.localeCompare(b.name);
            });
            
            setTeamMembers(sortedLeadership);
            setFilteredMembers(sortedLeadership);
            
            if (sortedLeadership.length > 0) {
                setSelectedMember(sortedLeadership[0]);
            }
            
            console.log('✅ Leadership members fetched successfully:', {
                totalFetched: data.length,
                leadershipCount: sortedLeadership.length,
                batch: currentBatch,
                leaders: sortedLeadership.map((member: TeamMember) => ({
                    name: member.name,
                    role: member.role
                }))
            });
            
        } catch (err) {
            console.error('❌ Error fetching leadership members:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch leadership members');
        } finally {
            setLoading(false);
        }
    };

    // Handle member selection
    const handleMemberSelect = (member: TeamMember) => {
        setSelectedMember(member);
    };

    // Handle search
    useEffect(() => {
        const filtered = teamMembers.filter(member =>
            member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.department.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredMembers(filtered);
        if (filtered.length > 0 && !filtered.includes(selectedMember!)) {
            setSelectedMember(filtered[0]);
        }
    }, [searchQuery, teamMembers, selectedMember]);

    // GSAP marquee animation
    useEffect(() => {
        if (marqueeRef.current && filteredMembers.length > 0) {
            gsap.to(marqueeRef.current, {
                x: '-50%', // Adjust the distance to move
                ease: 'none',
                scrollTrigger: {
                    trigger: marqueeRef.current,
                    start: 'top 80%', // Start when the trail is fully visible
                    end: 'bottom 20%',
                    scrub: true,
                },
            });
        }
    }, [filteredMembers]);

    // Fetch data on component mount and set up auto-refresh
    useEffect(() => {
        fetchTeamMembers();
        
        // Set up automatic refresh every 5 minutes to showcase current HODs
        const refreshInterval = setInterval(() => {
            console.log('🔄 Auto-refreshing team data...');
            fetchTeamMembers();
        }, 5 * 60 * 1000); // 5 minutes
        
        return () => {
            clearInterval(refreshInterval);
        };
    }, []);

    // Loading state
    if (loading) {
        return (
            <div className="team">
                <div className="w-[98vw] h-[96vh] bg-pink-400 rounded-3xl p-4 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                        <p className="text-white text-xl">Loading Team...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="team">
                <div className="w-[98vw] h-[96vh] bg-pink-400 rounded-3xl p-4 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-red-500">
                            <p className="text-xl mb-4">❌ Error loading team data</p>
                            <p className="text-sm">{error}</p>
                            <button
                                onClick={fetchTeamMembers}
                                className="mt-4 px-4 py-2 bg-white text-red-500 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="team">
            <div className="w-[98vw] h-[96vh] rounded-3xl p-4">
                <div className="max-w-full max-h-full grid grid-cols-1 md:grid-cols-2 grid-rows-4 md:grid-rows-4">
                    {/* The Team Heading */}
                    <div className="col-span-1 row-span-1 ml-12 z-30">
                        <h1 className="text-[8vw] md:text-[6vw] font-bold">The Team</h1>
                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search leadership by name, role, or department..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full max-w-md bg-background border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Black Division with Selected Member Image */}
                    <div className="col-span-1 row-span-4 bg-neutral-900 rounded-t-4xl flex items-center justify-center relative overflow-hidden">
                        {selectedMember ? (
                            <div className="relative w-full h-full">
                                <Image
                                    src={selectedMember.image}
                                    alt={selectedMember.name}
                                    fill
                                    className="object-contain"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                                <div className="absolute inset-0"></div>
                            </div>
                        ) : (
                            <div className="text-center text-white">
                                <Users size={48} className="mx-auto mb-4 opacity-50" />
                                <p className="text-xl">Select a leader</p>
                            </div>
                        )}
                    </div>

                    {/* Team Member Info */}
                    <div className="col-span-1 row-span-3 pb-18">
                        <div className="flex flex-col items-start justify-end mt-18 pl-8 pb-6 z-30 bg-neutral-900 rounded-tl-4xl h-full">
                            {selectedMember ? (
                                <>
                                    <div className="my-4">
                                        <h3 className="text-[2.5vw] md:text-[2vw] text-white font-semibold mb-2">{selectedMember.name}</h3>
                                        <p className="text-[1vw] md:text-[0.9vw] font-medium text-green-200 mb-1">
                                            {selectedMember.role} • {selectedMember.department}
                                        </p>
                                        <p className="text-[0.8vw] md:text-[0.7vw] text-green-300">
                                            {selectedMember.batch} {selectedMember.isAlumni ? '(Alumni)' : '(Active)'}
                                        </p>
                                    </div>
                                    <p className="text-[0.9vw] md:text-[0.8vw] font-medium max-w-md mb-4 text-green-100 leading-relaxed">
                                        {selectedMember.bio}
                                    </p>
                                    {/* Skills */}
                                    {selectedMember.skills && selectedMember.skills.length > 0 && (
                                        <div className="mb-4">
                                            <h4 className="text-[1vw] md:text-[0.9vw] font-semibold mb-2 text-green-200">Skills</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedMember.skills.map((skill, index) => (
                                                    <span
                                                        key={index}
                                                        className="bg-green-800 text-green-100 px-2 py-1 rounded text-[0.7vw] md:text-[0.6vw]"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {/* Social Links */}
                                    <div className="flex gap-4 items-center p-4">
                                        {selectedMember.social?.linkedin && selectedMember.social.linkedin !== '#' && (
                                            <a
                                                href={selectedMember.social.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-green-300 hover:text-white transition-colors"
                                                aria-label={`${selectedMember.name}'s LinkedIn`}
                                            >
                                                <Linkedin size={20} />
                                            </a>
                                        )}
                                        {selectedMember.social?.email && (
                                            <a
                                                href={`mailto:${selectedMember.social.email}`}
                                                className="text-green-300 hover:text-white transition-colors"
                                                aria-label={`Email ${selectedMember.name}`}
                                            >
                                                <Mail size={20} />
                                            </a>
                                        )}
                                        {selectedMember.social?.github && selectedMember.social.github !== '#' && (
                                            <a
                                                href={selectedMember.social.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-green-300 hover:text-white transition-colors"
                                                aria-label={`${selectedMember.name}'s GitHub`}
                                            >
                                                <Github size={20} />
                                            </a>
                                        )}
                                        {selectedMember.social?.instagram && selectedMember.social.instagram !== '#' && (
                                            <a
                                                href={selectedMember.social.instagram}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-green-300 hover:text-white transition-colors"
                                                aria-label={`${selectedMember.name}'s Instagram`}
                                            >
                                                <Instagram size={20} />
                                            </a>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="text-center text-green-100">
                                    <Users size={48} className="mx-auto mb-4 opacity-50" />
                                    <p className="text-xl">No leader selected</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Blue Division with Team Member Thumbnails */}
                    <div className="col-span-1 md:col-span-2 row-span-1 bg-neutral-900 overflow-hidden rounded-b-4xl relative">
                        <div ref={marqueeRef} className="flex space-x-2 py-4 px-4">
                            {filteredMembers.map((member) => (
                                <div
                                    key={member._id}
                                    className={`flex-shrink-0 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                                        selectedMember?._id === member._id
                                            ? ''
                                            : 'hover:scale-105'
                                    }`}
                                    onClick={() => handleMemberSelect(member)}
                                    style={{ width: '120px' }}
                                >
                                    <div className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                                        ['hod', 'head', 'president', 'vice president', 'secretary', 'lead', 'director'].some(role => 
                                            member.role.toLowerCase().includes(role)
                                        ) ? 'border-yellow-400' : 'border-white'
                                    }`}>
                                        <Image
                                            src={member.image}
                                            alt={member.name}
                                            width={80}
                                            height={80}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                    <p className="text-white text-sm mt-2 font-semibold truncate w-full text-center">
                                        {member.name.split(' ')[0]}
                                        {['hod', 'head', 'president', 'vice president', 'secretary', 'lead', 'director'].some(role => 
                                            member.role.toLowerCase().includes(role)
                                        ) && (
                                            <span className="ml-1 text-yellow-400">★</span>
                                        )}
                                    </p>
                                    <p className="text-white text-xs truncate w-full text-center">
                                        {member.isAlumni ? 'Alumni' : member.role}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Team;
