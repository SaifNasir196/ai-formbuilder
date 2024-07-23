"use client"

import React from 'react'
import { useUser } from '@clerk/nextjs'
import FormUI from '@/components/FormUI'
import { useForm } from '@/app/hooks/useForms'  // Import the hook
import { FormData } from '@/lib/type'

const DisplayForm = ({ params }: { params: { formId: number } }) => {
    const { user } = useUser()
    const { data: form, isLoading, isError, error } = useForm(params.formId)

    if (isLoading) {
        return <div>Loading...</div>
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