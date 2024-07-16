import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'

const Hero = () => {
  return (
    <section className="text-gray-900 bg-white">
        <div className="mx-auto max-w-screen-xl px-4 py-32 lg:py-64 lg:flex lg:items-center">
            <div className="mx-auto max-w-3xl text-center">
                <h1 className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl">
                    Create Forms in minutes <span className="sm:block"> Distribute in seconds. </span>
                </h1>

                <p className="mx-auto mt-4 max-w-xl sm:text-xl/relaxed">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nesciunt illo tenetur fuga ducimus numquam ea!
                </p>

                <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <Button className='py-6 px-8'>
                        <Link href="/signup">Get Started</Link>
                    </Button>
                    <Button variant="outline" className='py-6 px-8'>
                        <Link href="/">Learn More</Link>
                    </Button>
                </div>
            </div>
        </div>
    </section>
  )
}

export default Hero