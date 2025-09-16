import React from 'react'

function Hero() {
  return (
    <div className='w-[95vw] h-[96vh] bg-neutral-900 rounded-3xl overflow-hidden relative mt-2'>
        <div className='relative w-full h-full'>
          <video src="/v1.mp4" className='w-full h-full object-cover' autoPlay loop muted></video>
          <div className='absolute inset-0 bg-neutral-900/50'></div>
            <div className='absolute inset-0 flex flex-col items-start justify-end font-sans m-6 md:m-12 text-white z-10'>
                <h1 className='text-4xl md:text-6xl lg:text-[8vw] font-bold'>GROBOTS</h1>
                <p className='text-left mb-4 text-base md:text-lg max-w-lg ml-4 md:ml-8'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis optio quas cumque explicabo tempora harum. Veritatis enim asperiores dolor quis?</p>
                <button className='bg-btn-primary-bg md:ml-12 text-black hover:cursor-pointer px-4 py-2 md:px-6 md:py-3 rounded-2xl font-semibold hover:bg-btn-primary-hover transition-colors'>Learn More</button>
            </div>
        </div>
    </div>
  )
}

export default Hero