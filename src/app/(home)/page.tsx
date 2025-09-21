import React from 'react'
import Hero from '@/modules/sections/hero'
import About from '@/modules/sections/about'
import History from '@/modules/sections/history'
import Project from '@/modules/sections/projects'
import Team from '@/modules/sections/team'

function Home() {
  return (
    <div className="flex flex-col items-center justify-center mt-2">
      <Hero/>
      <About/>
      <History/>
      <Project/>
      <Team/>
    </div>
  )
}

export default Home