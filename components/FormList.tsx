"use client"
import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { db } from '@/config'
import { forms, responses } from '@/config/schema'
import { desc, eq } from 'drizzle-orm'
import FormItem from './FormItem'
import { FormType } from '@/lib/type'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query';


const fetchForms = async (): Promise<FormType[]> => {
  const response = await axios.get('/api/forms');
  return response.data;
};

const FormList = () => {
    const { isLoaded, isSignedIn, user } = useUser()
    // const [formList, setFormList] = useState<FormType[]>([])

    // useEffect(() => {
    //     if (isLoaded && isSignedIn) {
    //         getFormList()
    //     }
    // }, [isLoaded, isSignedIn])
    
    // const getFormList = async () => {
    //     if (!user) return

    //     const primaryEmail = user.primaryEmailAddress?.emailAddress
    //     if (!primaryEmail) return

    //     try {
    //         const res = await db.select().from(forms)
    //             .where(eq(forms.createdBy, primaryEmail))
    //             .orderBy(desc(forms.id))
    //         // console.log('res', res)
    //         setFormList(res)
    //     } catch (error) {
    //         console.error('Error fetching form list:', error)
    //     }
    // }

    const {
        data: formList,
        isLoading,
        isError,
        error,
        refetch
    } = useQuery({
        queryKey: ['forms'],
        queryFn: fetchForms,
        enabled: !!user, // Only run the query if the user is authenticated
        retry: 3, // Retry 3 times on failure
        staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    });

    if (!isLoaded || isLoading)
        return <div>Loading...</div>

    if (!isSignedIn)
        return <div>Please sign in to view your forms.</div>

    if (isError)
        return <div>Error loading forms: {error.message}</div>;
        
    console.log('formList', formList);
    if (!formList || formList.length === 0)
        return <div>Create forms and grow your business!</div>

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