import { FormData, Form } from '@/lib/type'
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
import { SquareArrowOutUpRight, BookCopy, Edit2 } from 'lucide-react'
import { useCreateForm } from '@/app/hooks/useForms'  

const FormItem = ({
    form,
    refreshData
}: { 
    form: Form,
    refreshData: () => void
}) => {
    const formJson: FormData = JSON.parse(form.jsonform)
    const createForm = useCreateForm()

    const handleDuplicate = async () => {
        createForm.mutate({ message: form.id.toString(), duplicated: true }, {
            onSuccess: () => {
                refreshData()
            }
        })
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
                    <AlertDialogTitle>Are you sure you want to duplicate this form?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action will create a new form with the same content.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDuplicate}>Duplicate</AlertDialogAction>
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