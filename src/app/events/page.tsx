import React from 'react'
import Grid from '@/modules/events/grid'
import Welcome from '@/modules/events/welcome'

function Events() {
  return (
    <div className='container mx-4'>
      <Welcome />
      <Grid />
    </div>
  )
}


export default Events