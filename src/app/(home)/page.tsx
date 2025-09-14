import React from 'react'
import Hero from '@/modules/home/hero'
import About from '@/modules/home/about'
import History from '@/modules/home/history'
import Project from '@/modules/home/projects'
import Team from '@/modules/home/team'

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bg-main mt-2">
      <Hero/>
      <About/>
      <History/>
      <Project/>
      <Team/>
    </div>
  )
}

export default Home