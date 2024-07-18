import React, { useRef } from 'react'
import { Edit, Trash } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { fieldType, editFieldType  } from '@/lib/type'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import { usePathname } from 'next/navigation'

const FieldOptions = ({ 
    defaultValue,
    onUpdate,
    onDelete
}:{ 
    defaultValue: fieldType,
    onUpdate: (value: editFieldType) => void,
    onDelete: () => void,
}) => {
    const label = useRef<HTMLInputElement>(null)
    const placeholder = useRef<HTMLInputElement>(null)
    const { toast } = useToast()
    const path = usePathname()

    return (
        path.includes('/form') ? (
            <div className=""></div>
        ) : (
        <div className="mt-7 flex gap-1">
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
                        onClick={() => {
                            onUpdate({
                                label: label.current?.value || '',
                                placeholder: placeholder.current?.value || ''
                            })
                            toast({
                                title: "Field Updated Successfully",
                                variant: 'success'
                            })
                        }}
                    >
                        Update
                    </Button>
                    </PopoverContent>
                </Popover>


                <AlertDialog>
                <AlertDialogTrigger>
                    <Trash className='h-5 w-5 text-red-500'/>
                </AlertDialogTrigger>

                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your form and all its data.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => {
                        toast({
                            title: "Field Deleted Successfully",
                            variant: 'destructive'
                        })
                        onDelete()
                        }}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialog>

        </div>
        )
    )

}

export default FieldOptions