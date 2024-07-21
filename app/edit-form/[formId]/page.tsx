"use client"

import React from 'react'
import { useUser } from '@clerk/nextjs'
import { Trash, Copy, CopyCheck, SquareArrowOutUpRight } from 'lucide-react'
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
import axios from 'axios'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const fetchForm = async (formId: number): Promise<FormDataType> => {
  const response = await axios.get(`/api/forms/${formId}`);
  return response.data.form;
}

const updateForm = async ({ formId, jsonform }: { formId: number, jsonform: FormDataType }) => {
  await axios.put(`/api/forms/${formId}`, { jsonform });
}

const deleteForm = async (formId: number) => {
  await axios.delete(`/api/forms/${formId}`);
}

const EditForm = ({ params }: { params: { formId: number } }) => {
  const { user } = useUser()
  const router = useRouter()
  const { isCopied, copyToClipboard } = useCopyToClipboard()
  const queryClient = useQueryClient()

  const { data: jsonform, isLoading, isError } = useQuery({
    queryKey: ['form', params.formId],
    queryFn: () => fetchForm(params.formId),
    enabled: !!user
  })

  const updateMutation = useMutation({
    mutationFn: updateForm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form', params.formId] })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: deleteForm,
    onSuccess: () => {
      router.push('/forms')
    }
  })

  const onFieldUpdate = (value: editFieldType, index: number) => {
    if (!jsonform?.fields[index].label) {
      throw new Error('Field label is missing')
    }
    const updatedJsonform = { ...jsonform };
    updatedJsonform.fields[index].label = value.label;
    updatedJsonform.fields[index].placeholder = value.placeholder;
    updateMutation.mutate({ formId: params.formId, jsonform: updatedJsonform });
  }

  const onFieldDelete = (index: number) => {
    if (!jsonform) return;
    const updatedFields = jsonform.fields.filter((_, i) => i !== index);
    const updatedJsonform = { ...jsonform, fields: updatedFields };
    updateMutation.mutate({ formId: params.formId, jsonform: updatedJsonform });
  }

  const onFormDelete = async () => {
    deleteMutation.mutate(params.formId);
  }

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error loading form</div>
  if (!jsonform) return <div>Form not found</div>

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
          <FormUI formId={params.formId} form={jsonform} onFieldUpdate={onFieldUpdate} onFieldDelete={onFieldDelete}/>
        </div>
      </div>
    </section>
  )
}

export default EditForm