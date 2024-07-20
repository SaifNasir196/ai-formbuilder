"use client"

import { db } from '@/config'
import { forms } from '@/config/schema'
import { and, eq } from 'drizzle-orm'
import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import FormUI from '@/components/FormUI'
import { FormDataType } from '@/lib/type'


const DisplayForm = ({ params }: { params: { formId: number } }) => {
    const { user } = useUser()
    const [jsonform, setJsonform] = useState<FormDataType | undefined>(undefined)

    useEffect(() => {
        user && getFormData()
    }, [user])


    const getFormData = async () => {
        const response = await db.select().from(forms)
        .where(and(eq(forms.id, params.formId), eq(forms.createdBy, user?.primaryEmailAddress?.emailAddress || '')));
        setJsonform(JSON.parse(response[0].jsonform));
    }

    return (
        <section className='mx-60 pt-44 pb-44 flex justify-center'>
            <FormUI formId={params.formId} form={jsonform} onFieldUpdate={() => {}} onFieldDelete={() => {}}/>
        </section>
    )
}

export default DisplayForm;