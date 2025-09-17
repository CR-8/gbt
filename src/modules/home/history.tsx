'use client'
import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface HistoryEvent {
  year: string
  title: string
  description: string
  status?: 'completed' | 'current' | 'ongoing'
  image?: string
}

const historyData: HistoryEvent[] = [
  {
    year: '2013',
    title: 'INCEPTION',
    description: 'SANDCM ROBOTICS CLUB WAS FOUNDED WITH A VISION TO NURTURE TECH TALENTS. Our journey began with a small group of passionate students who shared a common dream of advancing robotics technology and education.',
    status: 'completed',
    image: 'https://images.pexels.com/photos/2085832/pexels-photo-2085832.jpeg'
  },
  {
    year: '2015',
    title: 'FIRST NATIONAL EVENT',
    description: 'SUCCESSFULLY HOSTED OUR INAUGURAL UG NATIONAL LEVEL ROBOTICS COMPETITION GANTAVYA. This milestone marked our emergence as a significant player in the national robotics community, attracting participants from across the country.',
    status: 'completed',
    image: 'https://images.pexels.com/photos/2085832/pexels-photo-2085832.jpeg'
  },
  {
    year: '2020',
    title: 'WORKSHOPS & WEBINARS',
    description: 'LAUNCHED ROBOTICS WORKSHOPS AND WEBINARS, REACHING STUDENTS across multiple institutions. During the pandemic, we adapted and continued our mission through digital platforms, expanding our reach globally.',
    status: 'ongoing',
    image: 'https://images.pexels.com/photos/2085832/pexels-photo-2085832.jpeg'
  },
  {
    year: '2025',
    title: 'ROBO WAR CHAMPIONS',
    description: '3RD IN 60 KG ROBO WAR IIT KANPUR, 30 KG 1ST AND 15 KG 2ND IN ROBO WAR IIT ROORKEE. Our latest achievements showcase the culmination of years of dedication, innovation, and technical excellence.',
    status: 'current',
    image: 'https://images.pexels.com/photos/2085832/pexels-photo-2085832.jpeg'
  }
]

function History() {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !scrollRef.current) return

    const container = containerRef.current
    const scrollContainer = scrollRef.current
    
    // Get the scroll width
    const scrollWidth = scrollContainer.scrollWidth
    const containerWidth = container.offsetWidth

    // GSAP horizontal scroll animation
    const horizontalScroll = gsap.to(scrollContainer, {
      x: -(scrollWidth - containerWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: () => `+=${scrollWidth - containerWidth}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    })

    // Animate timeline dots
    gsap.set('.timeline-dot', { scale: 0.5, opacity: 0.5 })
    
    ScrollTrigger.batch('.timeline-item', {
      onEnter: (elements) => {
        elements.forEach((element, index) => {
          const dot = element.querySelector('.timeline-dot')
          const content = element.querySelector('.timeline-content')
          
          gsap.to(dot, {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            delay: index * 0.1,
            ease: 'back.out(1.7)'
          })
          
          gsap.fromTo(content, 
            { y: 50, opacity: 0 },
            { 
              y: 0, 
              opacity: 1, 
              duration: 0.8,
              delay: index * 0.1 + 0.2,
              ease: 'power2.out'
            }
          )
        })
      },
      start: 'left 80%',
      end: 'right 20%'
    })

    return () => {
      horizontalScroll.kill()
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <div>
      <div 
        ref={containerRef}
        className='w-screen rounded-3xl overflow-hidden relative'
      >
        {/* Fixed title */}
        <div className="flex items-start justify-start ml-12 z-30">
          <h1 className="text-[10vw] font-bold ">
            Our History
          </h1>
        </div>

        {/* Progress indicator */}
        <div className="flex items-start justify-end mr-12 z-30">
          <div className="flex space-x-2">
           
          </div>
        </div>

        {/* Horizontal scrolling container */}
        <div
        ref={scrollRef}
        className="flex h-[67vh]"
        style={{ width: `${historyData.length * 100}vw` }}
        >
        {historyData.map((event, index) => (
            <div
            key={index}
            className="timeline-panel flex-shrink-0 w-[100vw] relative flex items-center"
            >
            {/* Circuit pattern overlay */}
            <div className="absolute inset-0 opacity-5">
                <svg
                width="100%"
                height="100%"
                className="absolute inset-0"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                >
                <rect width="100%" height="100%" fill={`url(#circuit-${index})`} />
                </svg>
            </div>

            {/* Content container */}
            <div className="timeline-content relative z-10 w-full h-full flex items-center px-16">
                {/* Left side - Image */}
                <div className="w-1/2 h-full flex items-center justify-center pr-12">
                <div className="relative w-full max-w-lg h-3/4 rounded-2xl overflow-hidden shadow-2xl shadow-cyan-400/20 border border-cyan-400/30">
                    <Image
                    src={event.image!}
                    alt={event.title}
                    fill
                    className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"></div>

                    {/* Year overlay on image */}
                    <div className="absolute bottom-6 left-6">
                    <div className="px-6 py-3 rounded-full text-lg font-bold backdrop-blur-sm">
                        {event.year}
                    </div>
                    </div>
                </div>
                </div>

                {/* Right side - Text content */}
                <div className="w-1/2 h-full flex flex-col justify-center pl-12">
                <div className="max-w-xl">
                    {/* Status indicator */}
                    <div className="flex items-center gap-3 mb-6">
                    <div
                        className={`w-4 h-4 rounded-full ${
                        event.status === "current"
                            ? "bg-cyan-400 animate-pulse"
                            : event.status === "ongoing"
                            ? "bg-purple-400 animate-pulse"
                            : "bg-green-400"
                        }`}
                    ></div>
                    <span className="text-gray-700 text-sm uppercase tracking-wider font-medium">
                        {event.status === "current"
                        ? "Current Achievement"
                        : event.status === "ongoing"
                        ? "Ongoing Initiative"
                        : "Milestone Achieved"}
                    </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
                    {event.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-700 text-lg leading-relaxed mb-8">
                    {event.description}
                    </p>
                </div>
                </div>
            </div>
            </div>
        ))}
        </div>


      </div>
    </div>
  )
}

export default History