import React from 'react'
// types
import { editFieldType, fieldType } from '@/lib/type'
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
import { Checkbox } from '../ui/checkbox'


const CheckBoxField = ({ 
    control,
  fieldData,
  index,
  onFieldUpdate,
  onFieldDelete
}: {
  control: Control<FieldValues>,
  fieldData: fieldType,
  index: number,
  onFieldUpdate: (value: editFieldType, index: number) => void,
  onFieldDelete: (index: number) => void
}) => {
  return (
    <FormField
        control={control}
        name={fieldData.fieldName}
        render={() => (
        <div className='flex my-6'>
        <FormItem>
            <div className="mb-4">
            <FormLabel>{fieldData.label}</FormLabel>
            <FormDescription> Select all that apply </FormDescription>
            </div>
            {fieldData?.options?.map((option, optionIndex) => (
            <FormField
                key={optionIndex}
                control={control}
                name={fieldData.fieldName}
                render={({ field }) => {
                return (
                    <FormItem
                        key={optionIndex}
                        className="flex flex-row items-center space-x-3 space-y-0"
                    >
                    <FormControl>
                        <Checkbox
                            checked={field.value?.includes(option.label)}
                            onCheckedChange={(checked) => {
                                return checked
                                ? field.onChange([...field.value || [], option.label])
                                : field.onChange( field.value?.filter((value: string) => value !== option.label))
                            }}
                        />
                    </FormControl>
                    <FormLabel className="font-normal">
                        {option.label}
                    </FormLabel>
                    </FormItem>
                )
                }}
            />
            ))}
            <FormMessage />
        </FormItem>
        
        <FieldOptions defaultValue={fieldData} onUpdate={(value) => onFieldUpdate(value, index)} onDelete={()=> onFieldDelete(index)}/>
        </div>
        )}

    />
  )
}

export default CheckBoxField