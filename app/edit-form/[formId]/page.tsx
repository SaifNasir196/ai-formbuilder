"use client"
import { db } from '@/config'
import { forms } from '@/config/schema'
import { and, eq, StringChunk } from 'drizzle-orm'
import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { parse } from 'path'
import { parseJsonFormString } from '@/lib/utils'
import { ArrowLeft, ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import FormUI from '@/components/FormUI'
import { jsonformType } from '@/lib/type'

const EditForm = ({ params }: { params: { formId: number } }) => {
  const { user } = useUser()
  const router = useRouter()
  const [jsonform, setJsonform] = useState<jsonformType | undefined>(undefined)

  useEffect(() => {
    user && getFormData()
  }, [user])

  const getFormData = async () => {
    const response = await db.select().from(forms)
    .where(and(eq(forms.id, params.formId), eq(forms.createdBy, user?.primaryEmailAddress?.emailAddress || '')))
      
    const parsedForm = parseJsonFormString(response[0].jsonform)
    setJsonform(parsedForm)
    console.log('Parsed form:', parsedForm)
  }
  
  console.log('jsonform', jsonform);

  return (
    <section className='p-10'>
      <h3 className="flex gap-2 items-center my-5 cursor-pointer" onClick={() => router.back()}>
        <ChevronLeft size={24} /> Back
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 border rounded-lg p-4 shadow-md">
          controller
        </div>

        <div className="md:col-span-3 border rounded-lg p-4 h-screen">
          <FormUI form={jsonform}/>
        </div>

      </div>

      
    </section>
  )
}

export default EditForm