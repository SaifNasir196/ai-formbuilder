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
import { Button } from './ui/button'


const fetchForms = async (): Promise<FormType[]> => {
  const response = await axios.get('/api/forms');
  return response.data;
};

const FormList = ({ query }: { query: string }) => {
    const { isLoaded, isSignedIn, user } = useUser()
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
        
    if (!formList || formList.length === 0)
        return <div>Create forms and grow your business!</div>
    
    const filteredItems = formList.filter((form) => 
        JSON.parse(form.jsonform).formTitle.toLowerCase().includes(query.toLowerCase()))

    return (
        <div className='mt-20 mx-auto 2xl:mx-56 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 sm: gap-6'>
            {filteredItems.map((form, index) => (
                <React.Fragment key={index}>
                    <FormItem form={form} refreshData={refetch}/>
                </React.Fragment>
            ))}
        </div>
    )
}

export default FormList