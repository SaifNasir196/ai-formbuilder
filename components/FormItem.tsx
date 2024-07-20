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
import { Edit2, Share, Trash } from 'lucide-react'


const FormItem = ({ form }: { form: FormType }) => {
    const formJson: FormDataType = JSON.parse(form.jsonform)
    return (
        <Card className='drop-shadow-sm'>
        <CardHeader>
            <CardTitle> {formJson.formTitle} </CardTitle>
            <CardDescription> {formJson.formHeading}</CardDescription>
        </CardHeader>
        {/* <CardContent>
            
        </CardContent> */}
        <CardFooter className='gap-2 justify-end'>
            <Link href={`/edit-form/${form.id}`}>
                <Button variant="secondary"><Edit2 size={18}/></Button>
            </Link>

            <Link href={`/form/${form.id}`}>
                <Button ><Share size={18} /> </Button>
            </Link>
            
        </CardFooter>
        </Card>
    )
}

export default FormItem