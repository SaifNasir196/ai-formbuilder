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
import { Switch } from "@/components/ui/switch"

const SwitchField = ({
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
            <div className='flex'>
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div >
                    <FormLabel> {fieldData.label} </FormLabel>
                    <FormDescription> {fieldData.placeholder} </FormDescription>
                </div>
                <div>
                    <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                </div>
            </FormItem>
            <FieldOptions defaultValue={fieldData} onUpdate={(value) => onFieldUpdate(value, index)} onDelete={()=> onFieldDelete(index)}/>
            </div>
            )}
        />
    )
}

export default SwitchField