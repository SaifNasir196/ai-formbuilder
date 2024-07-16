"use client"
import { db } from '@/config'
import { forms } from '@/config/schema'
import { and, eq } from 'drizzle-orm'
import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import FormUI from '@/components/FormUI'
import { jsonformType, editFieldType } from '@/lib/type'

const EditForm = ({ params }: { params: { formId: number } }) => {
  const { user } = useUser()
  const router = useRouter()
  const [jsonform, setJsonform] = useState<jsonformType | undefined>(undefined)
  const [updateTrigger, setUpdateTrigger] = useState(false)

  useEffect(() => {
    user && getFormData()
  }, [user])

  useEffect(() => {
    setJsonform(jsonform);
    updateDB();
    setUpdateTrigger(false);
  }, [updateTrigger])

  const getFormData = async () => {
    const response = await db.select().from(forms)
      .where(and(eq(forms.id, params.formId), eq(forms.createdBy, user?.primaryEmailAddress?.emailAddress || '')));
    
    setJsonform(JSON.parse(response[0].jsonform));
  }
  console.log('jsonform:', jsonform);

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
  
  const onFieldDelete = (index: number) => {
    const res = jsonform?.fields.splice(index, 1);
    console.log('Deleted:', res);
    setUpdateTrigger(true);
  }

  

  return (
    <section className='p-10'>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 border rounded-lg p-4 shadow-md">
          controller
        </div>

        <div className="md:col-span-3 border rounded-lg px-10 pt-48 h-screen shadow-md flex justify-center">
          <FormUI form={jsonform} onFieldUpdate={onFieldUpdate} onFieldDelete={onFieldDelete}/>
        </div>

      </div>

      
    </section>
  )
}

export default EditForm;