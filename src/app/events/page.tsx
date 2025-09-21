import React from 'react'
import Grid from '@/modules/sections/events/grid'
import Welcome from '@/modules/sections/events/welcome'

function Events() {
  return (
    <div className='container mx-4'>
      <Welcome />
      <Grid />
    </div>
  )
}


export default Events