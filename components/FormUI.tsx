import React from 'react'
import { jsonformType } from '@/lib/type'
import { FileEdit } from 'lucide-react'
import { Input } from './ui/input'
import { Label } from './ui/label'

const FormUI = ({ form }: {form: jsonformType | undefined}) => {
  return (
    <article className='border p-5'>
      <h2 className='font-bold text-center text-2xl text-primary'> {form?.formTitle} </h2>
      <h3 className='text-sm text-gray-400 text-center'> {form?.formHeading} </h3>

      {
        form?.fields.map((field, index) => (
          <div key={index} className='my-5'>
            <Label htmlFor={field.fieldName}> {field.label} </Label>
            <Input 
              id={field.fieldName} 
              name={field.fieldName} 
              type={field.fieldType} 
              placeholder={field.placeholder} 
              required={field.required} 
            />
          </div>
        ))
      }
      

    </article>
  )
}

export default FormUI