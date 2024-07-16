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
import { jsonformType, editFieldType } from '@/lib/type'
import FieldOptions from '@/components/FieldOptions'

const EditForm = ({ params }: { params: { formId: number } }) => {
  const { user } = useUser()
  const router = useRouter()
  const [jsonform, setJsonform] = useState<jsonformType | undefined>(undefined)
  const [updateTrigger, setUpdateTrigger] = useState(false)
  useEffect(() => {
    user && getFormData()
  }, [user])
  useEffect(() => {
    setJsonform(jsonform)
    
    setUpdateTrigger(false)
  })

  const getFormData = async () => {
    const response = await db.select().from(forms)
    .where(and(eq(forms.id, params.formId), eq(forms.createdBy, user?.primaryEmailAddress?.emailAddress || '')))
      
    const parsedForm = parseJsonFormString(response[0].jsonform)
    setJsonform(parsedForm)
    console.log('Parsed form:', parsedForm)
  }

  const updateDB = async () => {
    const res = await db.update(forms)
    .set({ jsonform: JSON.stringify(jsonform) })
    .where(and(eq(forms.id, params.formId), eq(forms.createdBy, user?.primaryEmailAddress?.emailAddress || '')))
    console.log('Updated:', res)
  }

  const onFieldUpdate = (value: editFieldType, index: number) => {
    if (!jsonform?.fields[index].label) {
      throw new Error('Field label is missing')
    }
    jsonform.fields[index].label = value.label
    jsonform.fields[index].placeholder = value.placeholder
    setUpdateTrigger(true);

  }
  

  return (
    <section className='p-10'>
      <h3 className="flex gap-2 items-center my-5 cursor-pointer" onClick={() => router.back()}>
        <ChevronLeft size={24} /> Back
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 border rounded-lg p-4 shadow-md">
          controller
        </div>

        <div className="md:col-span-3 border rounded-lg px-80 pt-48 h-screen shadow-md">
          <FormUI form={jsonform} onFieldUpdate={onFieldUpdate}/>
        </div>

      </div>

      
    </section>
  )
}

export default EditForm