import { FormData, Form } from '@/lib/type'
import React, { useState } from 'react'
import { cn } from '@/lib/utils/utils'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link'
import { Button } from './ui/button'
import { SquareArrowOutUpRight, BookCopy, Edit2, MousePointerClick, View, CircleCheck, ArrowDown, ChevronDown, ChevronUp } from 'lucide-react'
import { useCreateForm } from '@/app/hooks/useForms'
import { formatDistance } from 'date-fns'
import { DropdownMenuItemIndicator } from '@radix-ui/react-dropdown-menu'


const FormItem = ({
    form,
    refreshData
}: {
    form: Form,
    refreshData: () => void
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [duplicate, setDuplicate] = useState(false)
    const [preview, setPreview] = useState(false)
    const formJson: FormData = JSON.parse(form.jsonform)
    const createForm = useCreateForm()

    const handleDuplicate = async () => {
        createForm.mutate({ message: form.id.toString(), duplicated: true }, {
            onSuccess: () => {
                refreshData()
            }
        })
    }

    return (
        <Card className='w-80 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all group' >
            <CardHeader>
                <div className="flex justify-between">
                    <CardTitle> {formJson.formTitle} </CardTitle>
                    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                        <DropdownMenuTrigger>
                            <Button
                                variant="ghost"
                                size="icon"
                                className='transition-all text-gray-500'
                            >
                                <ChevronDown className={cn("transition-transform duration-200 outline-none hover:outline-none focus:outline-none",
                                    isOpen && "rotate-180")} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {form.published ? (
                                <DropdownMenuItem asChild>
                                    <Link href={`/responses?formId=${form.id}`}>View responses</Link>
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem asChild>
                                    <Link href={`/edit-form/${form.id}`}>Edit</Link>
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem asChild>
                                <Link href={`/form/${form.id}`}>Preview</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setDuplicate(true)}>Duplicate</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>
                <CardDescription className='flex flex-col items-start justify-between gap-2'>
                    {formatDistance(form.createdAt, new Date(), { addSuffix: true })}

                    {true && (
                        <span className='flex items-center gap-2 mt-2 '>
                            <View size={22} className='text-primary' />
                            <span >{form.submissions}</span>
                            <MousePointerClick size={22} className='text-primary' />
                            <span> {form.submissions.toLocaleString()} </span>
                        </span>
                    )}
                </CardDescription>

            </CardHeader>



            <CardContent>

                <AlertDialog open={duplicate} onOpenChange={setDuplicate}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to duplicate this form?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action will create a new form with the same content.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDuplicate}>Duplicate</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </CardContent>


        </Card >


    )
}

export default FormItem