"use client"
import React from 'react'
import Image from 'next/image'
import { Button } from './ui/button'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { navLinks } from '@/lib/data'
import { cn } from '@/lib/utils/utils'
import { SignInButton } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import CreateForm from './CreateForm'
import { useUser } from '@clerk/nextjs'
import { User } from 'lucide-react'

const Header = ({ loggedIn }: { loggedIn: boolean }) => {
  const path = usePathname();
  const { isSignedIn } = useUser();
  if (!path.includes('/form/')) return (
    <header className="navbar bg-base-100 w-full border-b drop-shadow-md">
      <div className="navbar-start ">
        <Link href="/" className="cursor-pointer ml-3">
          <Image src='/logo.png' alt='logo' width={70} height={70} quality={100} priority />
        </Link>
      </div>

      {isSignedIn ? (
        <>
          <nav className="navbar-center ">
            <ul className="flex w-[22rem] flex-wrap items-center justify-center gap-y-1 text-[0.9rem] font-medium text-gray-500 sm:w-[initial] sm:flex-nowrap sm:gap-5">
              {navLinks.map((link) => (
                <li className=" flex items-center justify-center relative" key={link.path}>
                  <Link
                    className={cn(
                      "px-5 py-3 flex w-full items-center justify-center transition",
                      "hover:text-gray-950 dark:text-gray-500 dark:hover:text-gray-300",
                      {
                        "text-gray-950 dark:text-gray-200": path.includes(link.path) === true,
                      }
                    )}
                    href={link.path}
                  >
                    {link.name}
                    {path.includes(link.path) && (
                      <motion.span
                        className="bg-gray-200 rounded-full absolute inset-0 -z-10 dark:bg-gray-800"
                        layoutId="activeSection"
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 25,
                        }}
                      ></motion.span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="navbar-end gap-10">
            <CreateForm />
            <UserButton />
          </div>
        </>
      ) : (
        <div className="navbar-end">
          <SignInButton>
            <Link href={'/sign-in'}>
              <Button> Get Started </Button>
            </Link>
          </SignInButton>
        </div>
      )}
    </header>
  )
}

export default Header;