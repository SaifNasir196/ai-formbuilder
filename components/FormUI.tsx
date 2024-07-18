import React from 'react'
import { FormData, editFieldType } from '@/lib/type'
import { Input } from './ui/input'
import { Label } from './ui/label'
import FieldOptions from './FieldOptions'
import { createDynamicSchema } from '@/lib/utils'
import { FieldValues, useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { FormDataSchema } from '@/lib/data'
import { Form } from "@/components/ui/form"
import StringField from './Fields/StringField'
import RadioField from './Fields/RadioField'
import SelectField from './Fields/SelectField'
import CheckBoxField from './Fields/CheckBoxField'



const FormUI = ({
  form,
  onFieldUpdate,
  onFieldDelete
}: {
  form: FormData | undefined,
  onFieldUpdate: (value: editFieldType, index: number) => void,
  onFieldDelete: (index: number) => void
}) => {
  
  const formObject = useForm({
    resolver: zodResolver(createDynamicSchema(form)),
  });

  const onSubmit = async (values: FieldValues) => {
    const isValid = await formObject.trigger(Object.keys(FormDataSchema.shape));
    console.log(isValid);
    if (isValid) {
      console.log(values);
    }
  };

  return (
    <article className='border p-5 rounded-2xl shadow-sm w-3/4 xl:w-1/2 h-fit'>
      {JSON.stringify(form)}
      <h2 className='font-bold text-center text-2xl text-primary'> {form?.formTitle} </h2>
      <h3 className='text-sm text-gray-400 text-center'> {form?.formHeading} </h3>
      
      <Form {...formObject}>
        <form onSubmit={formObject.handleSubmit(onSubmit)}>
          {
            form?.fields.map((field, index) => (
              <>
              {
                ['string', 'email', 'number', 'tel', 'url', 'date', 'time'].includes(field.fieldType) ? (
                  <StringField
                    control={formObject.control} 
                    fieldData={field}
                    index={index}
                    onFieldUpdate={onFieldUpdate}
                    onFieldDelete={()=> onFieldDelete(index)}
                  />
                ) : field.fieldType === 'radio' ? (
                  <RadioField
                    control={formObject.control}
                    fieldData={field}
                    index={index}
                    onFieldUpdate={onFieldUpdate}
                    onFieldDelete={onFieldDelete}
                  />
                ) : field.fieldType === 'select' ? (
                  <SelectField
                    control={formObject.control}
                    fieldData={field}
                    index={index}
                    onFieldUpdate={onFieldUpdate}
                    onFieldDelete={onFieldDelete}
                  />
                ) : field.fieldType === 'checkbox' ? (
                  <CheckBoxField control={formObject.control} fieldData={field} index={index} onFieldUpdate={onFieldUpdate} onFieldDelete={onFieldDelete}/>
                ) : (
                  <>

                  <div className='flex items-center  gap-2' key={index}>
                    {/* field */}
                    <div  className='my-5 flex-grow'>
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
                  </>
                )
              }


              </>
            ))
          }

        </form>
      </Form>

      

    </article>
  )
}

export default FormUI