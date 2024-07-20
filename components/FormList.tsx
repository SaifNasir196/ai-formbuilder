"use client"
import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { db } from '@/config'
import { forms, responses } from '@/config/schema'
import { desc, eq } from 'drizzle-orm'
import FormItem from './FormItem'
import { FormType } from '@/lib/type'

const FormList = () => {
    const { isLoaded, isSignedIn, user } = useUser()
    const [formList, setFormList] = useState<FormType[]>([])

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            getFormList()
        }
    }, [isLoaded, isSignedIn])
    
    const getFormList = async () => {
        if (!user) return

        const primaryEmail = user.primaryEmailAddress?.emailAddress
        if (!primaryEmail) return

        try {
            const res = await db.select().from(forms)
                .where(eq(forms.createdBy, primaryEmail))
                .orderBy(desc(forms.id))
            // console.log('res', res)
            setFormList(res)
        } catch (error) {
            console.error('Error fetching form list:', error)
        }
    }

    if (!isLoaded) {
        return <div>Loading...</div>
    }

    if (!isSignedIn) {
        return <div>Please sign in to view your forms.</div>
    }

    return (
        <div className='mt-24 mx-auto 2xl:mx-56 grid grid-cols-2 lg:grid-cols-3 gap-6'>
            {formList.map((form, index) => (
                <React.Fragment key={index}>
                    <FormItem form={form}/>
                </React.Fragment>
            ))}
        </div>
    )
}

export default FormList