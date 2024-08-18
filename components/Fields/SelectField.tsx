import React from 'react'
// types
import { editFieldType, Field } from '@/lib/type'
import { Control, FieldValues } from 'react-hook-form'

// components
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import FieldOptions from '@/components/FieldOptions'


const SelectField = ({
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
                        <FormLabel>{fieldData.label}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder={fieldData.placeholder} />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {fieldData?.options?.map((option, index: number) => (
                                    <SelectItem key={index} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <FormMessage />
                    </FormItem>
                    <FieldOptions defaultValue={fieldData} onUpdate={(value) => onFieldUpdate(value, index)} onDelete={() => onFieldDelete(index)} />
                </div>
            )}
        />

    )
}

export default SelectField