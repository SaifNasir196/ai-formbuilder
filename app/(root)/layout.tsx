import React from 'react'
import { SignedIn } from '@clerk/nextjs';

const layout = ({ children }: Readonly<{
  children: React.ReactNode;
}>) => {
    return (
        <SignedIn>
            <div className='flex'>
                {children}
            </div>
        </SignedIn>
    )

}

export default layout