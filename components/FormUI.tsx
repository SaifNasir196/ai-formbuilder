import React, { useMemo } from 'react'
import { FormData, editFieldType } from '@/lib/type'
import { Input } from './ui/input'
import { Label } from './ui/label'
import FieldOptions from './FieldOptions'
import { createDynamicSchema, getDefaultValues, parseFormSubmission } from '@/lib/utils/utils'
import { FieldValues, useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { FormSubmission } from '@/lib/type'
import { Form } from "@/components/ui/form"
import StringField from './Fields/StringField'
import RadioField from './Fields/RadioField'
import SelectField from './Fields/SelectField'
import CheckBoxField from './Fields/CheckBoxField'
import SwitchField from './Fields/SwitchField'
import { Button } from './ui/button'
import { toast } from './ui/use-toast'
import { useForm as useQueryForm } from '@/app/hooks/useForms'
import { useCreateSubmission } from '@/app/hooks/useResponses'
import { FormSubmissionSchema } from '@/lib/data'
import { usePathname } from 'next/navigation'

const FormUI = ({
  formId,
  onFieldUpdate,
  onFieldDelete
}: {
  formId: number
  onFieldUpdate: (value: editFieldType, index: number) => void,
  onFieldDelete: (index: number) => void
}) => {
  const { data: form, isLoading, isError } = useQueryForm(formId)
  const createResponse = useCreateSubmission()
  const path = usePathname()


  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error loading form</div>
  if (!form) return <div>Form not found</div>

  const defaultValues = useMemo(() => getDefaultValues(JSON.parse(form.jsonform)), [form]);

  const formObject = useForm({
    resolver: zodResolver(createDynamicSchema(JSON.parse(form.jsonform))),
    defaultValues: defaultValues,
  });

  const onSubmit = async (values: FieldValues) => {
    const isValid = await formObject.trigger(Object.keys(FormSubmissionSchema.shape));
    if (isValid) {
      createResponse.mutate(
        { formId, submission: JSON.stringify(values) },
        {
          onSuccess: () => {
            formObject.reset(defaultValues);
            toast({
              title: "Response submitted successfully",
              variant: 'success'
            })
          },
          onError: () => {
            toast({
              title: "Failed to submit response",
              variant: 'warning'
            })
          }
        }
      )
    }
  };

  const parsedForm = JSON.parse(form.jsonform) as FormData;

  return (
    <article className='border p-5 rounded-2xl shadow-sm w-3/4 xl:w-1/2 h-fit'>
      <h2 className='font-bold text-center text-2xl text-primary'> {parsedForm.formTitle} </h2>
      <h3 className='text-sm text-gray-400 text-center'> {parsedForm.formHeading} </h3>

      <Form {...formObject}>
        <form onSubmit={formObject.handleSubmit(onSubmit)}>
          {parsedForm.fields.map((field, index) => (
            <React.Fragment key={index}>
              {
                ['string', 'email', 'number', 'tel', 'url', 'date', 'time'].includes(field.fieldType) ? (
                  <StringField
                    control={formObject.control}
                    fieldData={field}
                    index={index}
                    onFieldUpdate={onFieldUpdate}
                    onFieldDelete={() => onFieldDelete(index)}
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
                  <CheckBoxField
                    control={formObject.control}
                    fieldData={field}
                    index={index}
                    onFieldUpdate={onFieldUpdate}
                    onFieldDelete={onFieldDelete}
                  />
                ) : field.fieldType === 'switch' ? (
                  <SwitchField
                    control={formObject.control}
                    fieldData={field}
                    index={index}
                    onFieldUpdate={onFieldUpdate}
                    onFieldDelete={onFieldDelete}
                  />
                ) : (
                  <div className='flex items-center  gap-2' key={index}>
                    <div className='my-5 flex-grow'>
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
                    <FieldOptions defaultValue={field} onUpdate={(value) => onFieldUpdate(value, index)} onDelete={() => onFieldDelete(index)} />
                  </div>
                )
              }
            </React.Fragment>
          ))}

          <Button className='w-full mt-16' type='submit' disabled={path.includes('/builder')}> Submit </Button>
        </form>
      </Form>
    </article>
  )
}

export default FormUI