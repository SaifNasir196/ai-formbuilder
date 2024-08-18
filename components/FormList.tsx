"use client"
import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import FormItem from './FormItem'
import { useForms } from '@/app/hooks/useForms'
import { Skeleton } from './ui/skeleton'


const FormList = ({ query }: { query: string }) => {
    const { isLoaded, isSignedIn } = useUser()
    const { data: formList, isLoading, isError, error, refetch } = useForms()

    if (!isLoaded || isLoading) (
        <div className='mt-20 mx-auto 2xl:mx-56 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 sm: gap-6'>
            {[...Array(6)].map((_, index) => <Skeleton key={index} className="w-80 h-64" />)}
        </div>
    )

    if (!isSignedIn)
        return <h1>Please sign in to view your forms.</h1>

    if (isError)
        return <div>Error loading forms: {error.message}</div>;

    if (!formList || formList.length === 0)
        return <div className='text-4xl mt-20'>Create forms and grow your business!</div>

    const filteredItems = formList.filter((form) =>
        JSON.parse(form.jsonform).formTitle.toLowerCase().includes(query.toLowerCase()))

    return (
        <div className='mt-20 mx-auto 2xl:mx-56 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 sm: gap-6 transition-all'>
            {filteredItems.map((form, index) => (
                <React.Fragment key={index}>
                    <FormItem form={form} refreshData={refetch} />
                </React.Fragment>
            ))}
        </div>
    )
}

export default FormList