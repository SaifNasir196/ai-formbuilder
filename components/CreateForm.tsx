"use client"
import React, { useRef, useState } from 'react'
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
import { db } from '@/config'
import { forms } from '@/config/schema'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { PROMPT } from '@/lib/data'

const CreateForm = () => {
    const ref = useRef<HTMLTextAreaElement>(null)
    const [loading, setLoading] = useState(false);
    const { user } = useUser();
    const router = useRouter();
    const closeRef = useRef<HTMLButtonElement>(null)


    const handleSubmit = async () => {
        if (ref.current) {
            try {
                setLoading(true);
                // send request
                const response = await fetch('/api/gemini', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: "Description: " + ref.current.value + PROMPT }),
                });

                // validate response
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const emailAddress = user?.primaryEmailAddress?.emailAddress;
                if (!emailAddress || typeof emailAddress !== 'string') {
                    throw new Error("User email address not available");
                }

                // parse response
                const data = await response.json();

                // insert form into database
                const res = await db.insert(forms).values({
                    jsonform: data?.response || "",
                    createdBy: user.primaryEmailAddress?.emailAddress as string,
                    createdAt: new Date(),
                }).returning({ id: forms.id });

                // redirect to form page
                if ( !res[0].id && res.length === 0) {
                    throw new Error("Failed to create form");
                }

                closeRef.current?.click();
                router.push(`/edit-form/${res[0].id}`);

                
            } catch (error) {
                console.error("Error creating form, try again later :(", error);
            } finally {
                setLoading(false);
            }
        };
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
                    disabled={loading}
                >
                    {loading ? (
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