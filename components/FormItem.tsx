import { FormDataType, FormType } from '@/lib/type'
import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import Link from 'next/link'
import { Button } from './ui/button'
import { SquareArrowOutUpRight, BookCopy, Edit, Edit2 } from 'lucide-react'
import axios from 'axios'
import { QueryObserverResult } from '@tanstack/react-query'

const FormItem = ({
    form,
    refreshData
}: { 
    form: FormType,
    refreshData: () => Promise<QueryObserverResult<FormType[], Error>>
}) => {
    const formJson: FormDataType = JSON.parse(form.jsonform)

    const handleDuplicate = async () => {
        await axios.post('/api/forms', {
            message: form.id,
            duplicated: true
        });
        refreshData();
    }

    return (
        <Card className='w-80 drop-shadow-sm hover:shadow-md transition-all' >
        <CardHeader>
            <CardTitle> {formJson.formTitle} </CardTitle>
            <CardDescription> {formJson.formHeading}</CardDescription>
        </CardHeader>
        
        <CardContent>
            40 reponses
        </CardContent>

        <CardFooter className='gap-2 justify-end'>
            <Link href={`/edit-form/${form.id}`}>
                <Button variant="secondary" ><Edit2 size={18} /> </Button>
            </Link>

            <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="secondary" onMouseDown={e => e.stopPropagation()}  ><BookCopy size={20}/></Button>
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
                <AlertDialogAction onClick={handleDuplicate} >Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialog>

            <Link href={`/form/${form.id}`}>
                <Button ><SquareArrowOutUpRight size={18} /> </Button>
            </Link>
            
        </CardFooter>
        </Card>
    )
}

export default FormItem