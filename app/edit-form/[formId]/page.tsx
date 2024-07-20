"use client"

import { db } from '@/config'
import { forms } from '@/config/schema'
import { and, eq } from 'drizzle-orm'
import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Trash, Share, SquareArrowOutUpRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import FormUI from '@/components/FormUI'
import { editFieldType, FormDataType } from '@/lib/type'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import useCopyToClipboard from '@/app/hooks/useCopyToClipboard'



const EditForm = ({ params }: { params: { formId: number } }) => {
  const { user } = useUser()
  const router = useRouter()
  const [jsonform, setJsonform] = useState<FormDataType | undefined>(undefined)
  const [updateTrigger, setUpdateTrigger] = useState(false)
  const { isCopied, copyToClipboard } = useCopyToClipboard()

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
    }
  }

  const onFieldUpdate = (value: editFieldType, index: number) => {
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
    setJsonform(prevJsonform => {
      const updatedFields = prevJsonform?.fields.filter((_, i) => i !== index);
      const updatedJsonform = { ...prevJsonform, fields: updatedFields } as FormDataType;
      return updatedJsonform;
    });
    setUpdateTrigger(true);
  }
  const onFormDelete = async () => {
    try {
      await db.delete(forms)
        .where(and(eq(forms.id, params.formId), eq(forms.createdBy, user?.primaryEmailAddress?.emailAddress || '')));
      router.push('/forms');
    } catch (error) {
      console.error('Error deleting form:', error);
    }
  }

  
  return (
    <section className='p-10'>
      <div className="flex gap-3 justify-end my-3">
        <AlertDialog>
        <AlertDialogTrigger><Button variant="destructive"><Trash size={18} onClick={() => onFormDelete()}/></Button></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your form
              and all responses to it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>

        <Link href={`/form/${params.formId}`}>
          <Button variant="secondary"> <SquareArrowOutUpRight size={20} className='mr-2'/>Preview</Button>
        </Link>

        <Button onClick={() => copyToClipboard(`/form/${params.formId}`)}>
        {isCopied ? (
          'Copied'
        ) : (
          <p><Share size={20} className='mr-2'/> Share </p>
        )}

          
        </Button>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 border rounded-lg p-4 shadow-md">
          controller
        </div>

        <div className="md:col-span-3 border rounded-lg px-10 pt-44 pb-44 min-h-screen shadow-md flex justify-center">
          <FormUI formId={params.formId} form={jsonform} onFieldUpdate={onFieldUpdate} onFieldDelete={onFieldDelete}/>
        </div>

      </div>

      
    </section>
  )
}

export default EditForm;