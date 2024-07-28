"use client"

import React from 'react'
import { useUser } from '@clerk/nextjs'
import FormUI from '@/components/FormUI'
import { useForm } from '@/app/hooks/useForms'  // Import the hook
import { FormData } from '@/lib/type'
import { Skeleton } from '@/components/ui/skeleton'


const DisplayForm = ({ params }: { params: { formId: number } }) => {
    const { user } = useUser()
    const { data: form, isLoading, isError, error } = useForm(params.formId)

    if (isLoading) {
        return (
            <section className='mx-60 pt-44 pb-44 flex justify-center'>
                <div className='border p-5 rounded-2xl shadow-sm w-3/4 xl:w-1/2 h-fit'>
                    <Skeleton className="w-3/4 h-8 mx-auto mb-4" />
                    <Skeleton className="w-1/2 h-4 mx-auto mb-8" />
                    {[...Array(5)].map((_, index) => (
                        <div key={index} className="mb-6">
                            <Skeleton className="w-1/4 h-4 mb-2" />
                            <Skeleton className="w-full h-10" />
                        </div>
                    ))}
                    <Skeleton className="w-full h-10 mt-16" />
                </div>
            </section>
        )
    }

    if (isError) {
        return <div>Error loading form: {error.message}</div>
    }

    if (!form) {
        return <div>Form not found</div>
    }

    const jsonform: FormData = JSON.parse(form.jsonform)

    return (
        <section className='mx-60 pt-44 pb-44 flex justify-center'>
            <FormUI 
                formId={params.formId} 
                onFieldUpdate={() => {}} 
                onFieldDelete={() => {}}
            />
        </section>
    )
}

export default DisplayForm