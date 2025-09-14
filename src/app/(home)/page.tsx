import React from 'react'
import Image from 'next/image'
import About from '@/modules/home/about'
import History from '@/modules/home/history'
import Project from '@/modules/home/projects'

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bg-main mt-2">
      <div className='w-[98vw] h-[96vh] bg-neutral-900 rounded-3xl overflow-hidden relative shadow-2xl'>
        <div className='relative w-full h-full'>
          <Image src='https://images.pexels.com/photos/2085832/pexels-photo-2085832.jpeg' fill alt='Hero background' className='object-cover aspect-video' />
          <div className='absolute inset-0 bg-neutral-900/50'></div>
          <div className='absolute inset-0 flex flex-col items-start justify-end font-sans m-12 text-white z-10'>
            <h1 className='text-[8vw] -mb-4 font-bold'>GROBOTS</h1>
            <p className='text-left mb-4 text-lg max-w-lg ml-8'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis optio quas cumque explicabo tempora harum. Veritatis enim asperiores dolor quis?</p>
            <button className='bg-btn-primary-bg  ml-12 text-black hover:cursor-pointer px-6 py-3 rounded-2xl font-semibold hover:bg-btn-primary-hover transition-colors'>Learn More</button>
          </div>
        </div>
      </div>
      <About/>
      <History/>
      <Project/>
    </div>
  )
}

export default Home