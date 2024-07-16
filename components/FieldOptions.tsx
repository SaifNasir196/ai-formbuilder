import React, { useRef } from 'react'
import { Edit, Trash } from 'lucide-react'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'
import { fieldType, editFieldType  } from '@/lib/type'

const FieldOptions = ({ defaultValue, onUpdate }: {defaultValue: fieldType , onUpdate: (arg0: editFieldType) => void  }) => {
    const label = useRef<HTMLInputElement>(null)
    const placeholder = useRef<HTMLInputElement>(null)
    return (
        <div className="">

            <Popover>
                <PopoverTrigger>
                    <Edit className='h-5 w-5 text-gray-500'/>
                    
                </PopoverTrigger>
                <PopoverContent>
                    <h2>Edit Fields</h2>
                    <div className="">
                        <Label>Label name </Label>
                        <Input
                            type='text'
                            ref={label}
                            placeholder='Enter Label' 
                            defaultValue={defaultValue.label}
                            required={true} 
                            className='w-full '
                        />
                    </div>
                    <div className="">
                        <Label> Placeholder </Label>
                        <Input 
                            type='text'
                            ref={placeholder}
                            placeholder='Enter Label' 
                            defaultValue={defaultValue.placeholder}
                            required={true} 
                            className='w-full '
                        />
                    </div>
                    <Button
                        className='mt-2'
                        onClick={() => onUpdate({
                            label: label.current?.value || '',
                            placeholder: placeholder.current?.value || ''
                        })}
                    >
                        Update
                    </Button>
                    </PopoverContent>
                </Popover>
                <Trash className='h-5 w-5 text-red-500'/>
        </div>
    )
}

export default FieldOptions