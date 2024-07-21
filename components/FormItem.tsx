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
import Link from 'next/link'
import { Button } from './ui/button'
import { Share, BookCopy } from 'lucide-react'


const FormItem = ({ form }: { form: FormType }) => {
    const formJson: FormDataType = JSON.parse(form.jsonform)
    return (
        <Link href={`/edit-form/${form.id}`}>
        <Card className='drop-shadow-sm hover:shadow-md'>
        <CardHeader>
            <CardTitle> {formJson.formTitle} </CardTitle>
            <CardDescription> {formJson.formHeading}</CardDescription>
        </CardHeader>
        
        <CardContent>
            40 reponses
        </CardContent>

        <CardFooter className='gap-2 justify-end'>
            <Link href="/">
                <Button variant="secondary"><BookCopy size={20}/></Button>
            </Link>

            <Link href={`/form/${form.id}`}>
                <Button ><Share size={18} /> </Button>
            </Link>
            
        </CardFooter>
        </Card>
        </Link>
    )
}

export default FormItem