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
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import FieldOptions from '@/components/FieldOptions'


const RadioField = ({
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
            name="type"
            render={({ field }) => (
                <div className='flex my-6'>
                <FormItem className="space-y-3">
                <FormLabel>{fieldData.label}</FormLabel>
                <FormControl>
                    <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={fieldData.placeholder}
                        className="flex flex-col space-y-1 ml-1"
                    >
                        {
                            fieldData?.options && fieldData.options.map((option, index: number)  => (
                                <FormItem key={index} className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                    <RadioGroupItem value={option.value} />
                                    </FormControl>
                                    <FormLabel className="font-normal"> {option.label} </FormLabel>
                                </FormItem>
                            ))
                        }
                   
                    </RadioGroup>
                </FormControl>
                <FormMessage />
                </FormItem>
                <FieldOptions defaultValue={fieldData} onUpdate={(value) => onFieldUpdate(value, index)} onDelete={()=> onFieldDelete(index)}/>
                </div>
            )}
            />
  )
}

export default RadioField