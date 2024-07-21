"use client"
import React, { useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { PROMPT } from '@/lib/data'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

interface CreateFormResponse {
  id: number;
}

const createForm = async (description: string): Promise<CreateFormResponse> => {
  const response = await axios.post('/api/forms', {
    message: description
  });
  return response.data;
}

const CreateForm = () => {
    const ref = useRef<HTMLTextAreaElement>(null)
    const router = useRouter();
    const closeRef = useRef<HTMLButtonElement>(null)

    const createFormMutation = useMutation({
      mutationFn: createForm,
      onSuccess: (data) => {
        closeRef.current?.click();
        router.push(`/edit-form/${data.id}`);
      },
      onError: (error) => {
        console.error("Error creating form, try again later :(", error);
      }
    })

    const handleSubmit = () => {
        if (ref.current?.value) {
            createFormMutation.mutate(ref.current.value);
        }
    };

    return (
        <div>
            <Dialog>
                <TooltipProvider>
                    <Tooltip>
                    <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                            <Button> + Create Form</Button>
                        </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <div className="flex flex-col gap-2">
                        <Progress value={66} />
                        <h2 className='text-sm text-gray-700'> 2/3 credits used</h2>
                        <h2 className='text-sm text-gray-700 w-56'> Upgrade for unlimited AI features and Google integration</h2>
                        </div>
                    </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <DialogContent>
                    <DialogHeader >
                        <DialogTitle>Create New Form</DialogTitle>
                        <DialogDescription>
                            <Textarea className='my-4' ref={ref} placeholder="Create a form for my career's workshop. Oh and ask for their field, thanks!" />
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-end">
                    <DialogClose asChild >
                        <Button type="button" variant="secondary" className='w-24' ref={closeRef}>
                        Close
                        </Button>
                    </DialogClose>
                    <Button 
                        type="button"
                        variant="default"
                        onClick={handleSubmit}
                        className='w-24'
                        disabled={createFormMutation.isPending}
                    >
                        {createFormMutation.isPending ? (
                          <Loader2 className='animate-spin'/>
                        ):  "Create"}
                    </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default CreateForm