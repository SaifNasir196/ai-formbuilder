import React from 'react'
import { jsonformType } from '@/lib/type'
import { Input } from './ui/input'
import { Label } from './ui/label'
import FieldOptions from './FieldOptions'
import { editFieldType } from '@/lib/type'


const FormUI = ({
  form,
  onFieldUpdate,
  onFieldDelete
}: {
  form: jsonformType | undefined,
  onFieldUpdate: (value: editFieldType, index: number) => void,
  onFieldDelete: (index: number) => void
}) => {
  
  return (
    <article className='border p-5 rounded-2xl shadow-sm w-3/4 xl:w-1/2 h-fit'>
      <h2 className='font-bold text-center text-2xl text-primary'> {form?.formTitle} </h2>
      <h3 className='text-sm text-gray-400 text-center'> {form?.formHeading} </h3>

      {
        form?.fields.map((field, index) => (
            <div className='flex items-center  gap-2'>
              {/* field */}
              <div key={index} className='my-5 flex-grow'>
                <Label htmlFor={field.fieldName}> {field.label} </Label>
                <Input 
                  id={field.fieldName} 
                  name={field.fieldName} 
                  type={field.fieldType} 
                  placeholder={field.placeholder} 
                  required={field.required} 
                  className='w-full'
                />
              </div>

              <FieldOptions defaultValue={field} onUpdate={(value) => onFieldUpdate(value, index)} onDelete={()=> onFieldDelete(index)}/>

              
            </div>
        ))
      }
      

    </article>
  )
}

export default FormUI