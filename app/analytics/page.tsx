import React from 'react'

import { useTotalStats } from '../hooks/useForms'
import FormStats from './FormStats'

const page = () => {


  return (
    <section className='px-20 py-20 flex flex-col items-center'>
      {/* Total stats */}
      <FormStats />

    </section>

  )
}

export default page