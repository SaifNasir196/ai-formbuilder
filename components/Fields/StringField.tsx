import React from 'react'
// types
import { editFieldType, Field } from '@/lib/type'
import { Control, FieldValues } from 'react-hook-form'

// components
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from '@/components/ui/input'
import FieldOptions from '@/components/FieldOptions'

const StringField = ({
  control,
  fieldData,
  index,
  onFieldUpdate,
  onFieldDelete
}: {
  control: Control<FieldValues>,
  fieldData: Field,
  index: number,
  onFieldUpdate: (value: editFieldType, index: number) => void,
  onFieldDelete: (index: number) => void
}) => {
  return (
    <FormField
      control={control}
      name={fieldData.fieldName}
      render={({ field }) => (
        <div className='flex my-6'>
          <FormItem>
            <FormLabel> {fieldData.label} </FormLabel>
            <div className='flex w-full flex-col'>
              <FormControl>
                <Input
                  placeholder={fieldData.placeholder}

                  type={fieldData.fieldType}
                  required={fieldData.required}
                  min={fieldData.min || (fieldData.fieldType === 'number' ? Number.MIN_VALUE : 0)}
                  max={fieldData.max || (fieldData.fieldType === 'number' ? Number.MAX_VALUE : 255)}
                  {...field}
                />
              </FormControl>
              <FormMessage className='form-message mt-2' />
            </div>
          </FormItem>
          <FieldOptions defaultValue={fieldData} onUpdate={(value) => onFieldUpdate(value, index)} onDelete={() => onFieldDelete(index)} />
        </div>
      )}
    />
  )
}
export default StringField



