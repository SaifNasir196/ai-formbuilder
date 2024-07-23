"use client"

// const updateForm = async ({ formId, jsonform }: { formId: number, jsonform: FormDataType }) => {
//   await axios.put(`/api/forms/${formId}`, { jsonform });
// }

// const deleteForm = async (formId: number) => {
//   await axios.delete(`/api/forms/${formId}`);
// }

import React from 'react'
import { useUser } from '@clerk/nextjs'
import { Trash, Copy, CopyCheck, SquareArrowOutUpRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import FormUI from '@/components/FormUI'
import { editFieldType, FormData } from '@/lib/type'
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
import { useDeleteForm, useForm, useUpdateForm } from '@/app/hooks/useForms'

const EditForm = ({ params }: { params: { formId: number } }) => {
  const { user } = useUser()
  const router = useRouter()
  const { isCopied, copyToClipboard } = useCopyToClipboard()

  const { data: form, isLoading, isError } = useForm(params.formId)
  const updateForm = useUpdateForm()
  const deleteForm = useDeleteForm()

  console.log('data', form);

  if (isLoading || !form?.jsonform) return <div>Loading...</div>

  const jsonform = JSON.parse(form.jsonform) as FormData

  const onFieldUpdate = (value: editFieldType, index: number) => {
    if (!jsonform?.fields[index].label)
      throw new Error('Field label is missing')

    const updatedJsonform = { ...jsonform };
    updatedJsonform.fields[index].label = value.label;
    updatedJsonform.fields[index].placeholder = value.placeholder;
    updateForm.mutate({ formId: params.formId, jsonform: updatedJsonform });
  }

  const onFieldDelete = (index: number) => {
    if (!jsonform) return;
    const updatedFields = jsonform.fields.filter((_, i) => i !== index);
    const updatedJsonform = { ...jsonform, fields: updatedFields };
    updateForm.mutate({ formId: params.formId, jsonform: updatedJsonform });
  }

  const onFormDelete = async () => {
    deleteForm.mutate(params.formId, {
      onSuccess: () => {
        router.push('/forms')
      }
    });
  }

  if (isError) return <div>Error loading form</div>
  if (!form?.jsonform) return <div>Form not found</div>

  return (
    <section className='p-10'>
      <div className="flex gap-3 justify-end my-3">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive"><Trash size={18} /></Button>
          </AlertDialogTrigger>
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
              <AlertDialogAction onClick={onFormDelete}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Link href={`/form/${params.formId}`}>
          <Button variant="secondary"> <SquareArrowOutUpRight size={20} className='mr-2'/>Preview</Button>
        </Link>

        <Button className='w-28' onClick={() => copyToClipboard(process.env.NEXT_PUBLIC_URL + `/form/${params.formId}`)}>
          {isCopied ? (
            <><CopyCheck size={20} className='mr-2'/> Copied</> 
            ) : (
            <> <Copy size={20} className='mr-2'/> Copy </> 
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 border rounded-lg p-4 shadow-md">
          Controller
        </div>

        <div className="md:col-span-3 border rounded-lg px-10 pt-44 pb-44 min-h-screen shadow-md flex justify-center">
          <FormUI formId={params.formId} onFieldUpdate={onFieldUpdate} onFieldDelete={onFieldDelete}/>
        </div>
      </div>
    </section>
  )
}

export default EditForm