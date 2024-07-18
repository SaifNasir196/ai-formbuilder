"use client"

import { db } from '@/config'
import { forms } from '@/config/schema'
import { and, eq } from 'drizzle-orm'
import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Share2Icon, SquareArrowOutUpRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import FormUI from '@/components/FormUI'
import { editFieldType, FormData } from '@/lib/type'
import { Button } from '@/components/ui/button'


const EditForm = ({ params }: { params: { formId: number } }) => {
  const { user } = useUser()
  const router = useRouter()
  const [jsonform, setJsonform] = useState<FormData | undefined>(undefined)
  const [updateTrigger, setUpdateTrigger] = useState(false)

  useEffect(() => {
    user && getFormData()
  }, [user])

  useEffect(() => {
    updateDB()
    return () => {
      setUpdateTrigger(false)
    }
  }, [updateTrigger])
  

  const getFormData = async () => {
    console.log('Getting form data');
    const response = await db.select().from(forms)
      .where(and(eq(forms.id, params.formId), eq(forms.createdBy, user?.primaryEmailAddress?.emailAddress || '')));
    setJsonform(JSON.parse(response[0].jsonform));
  }

  const updateDB = async () => {
    if (jsonform) {
      try {
        const res = await db.update(forms)
          .set({ jsonform: JSON.stringify(jsonform) })
          .where(and(eq(forms.id, params.formId), eq(forms.createdBy, user?.primaryEmailAddress?.emailAddress || '')));
        console.log('DB updated successfully');
      } catch (error) {
        console.error('Error updating DB:', error);
      }
    } else {
      console.log('jsonform is undefined, skipping DB update');
    }

  }

  const onFieldUpdate = (value: editFieldType, index: number) => {
    console.log('Updating form');
    if (!jsonform?.fields[index].label) {
      throw new Error('Field label is missing')
    }
    const updatedJsonform = { ...jsonform };
    updatedJsonform.fields[index].label = value.label;
    updatedJsonform.fields[index].placeholder = value.placeholder;
    setJsonform(updatedJsonform);
    setUpdateTrigger(true); 
  }

  
  const onFieldDelete = (index: number) => {
    // console.log('jsonform before:', jsonform);

    setJsonform(prevJsonform => {
      const updatedFields = prevJsonform?.fields.filter((_, i) => i !== index);
      const updatedJsonform = { ...prevJsonform, fields: updatedFields } as FormData;
      return updatedJsonform;
    });
    setUpdateTrigger(true);
  }

  

  return (
    <section className='p-10'>
      <div className="flex gap-3 justify-end my-3">
        <Button variant="secondary"> <SquareArrowOutUpRight size={20} className='mr-2'/>Preview</Button>
        <Button> <Share2Icon size={20} className='mr-2'/> Share</Button>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 border rounded-lg p-4 shadow-md">
          controller
        </div>

        <div className="md:col-span-3 border rounded-lg px-10 pt-44 pb-44 min-h-screen shadow-md flex justify-center">
          <FormUI form={jsonform} onFieldUpdate={onFieldUpdate} onFieldDelete={onFieldDelete}/>
        </div>

      </div>

      
    </section>
  )
}

export default EditForm;