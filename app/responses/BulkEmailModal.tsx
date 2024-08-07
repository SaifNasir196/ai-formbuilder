
'use client';

import React, { useRef } from 'react';
import { Recipient } from '@/lib/type';
import {

    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
    DialogClose,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button';
import { useMailerSend } from '@/app/hooks/useMailerSend';

const MAX_RECIPIENTS = 100;

type BulkEmailModalProps = {
    recipients: Recipient[];
    handleAction: (templateId: number,) => void;
};

export const BulkEmailModal = ({ recipients }: { recipients: Recipient[] }) => {
    const subject = useRef<HTMLInputElement>(null);
    const body = useRef<HTMLTextAreaElement>(null);
    const sendBulkEmail = useMailerSend();

    const recipientCount = recipients.length;
    // console.log('recipientCount', recipientCount);
    const batchCount = Math.ceil(recipientCount / MAX_RECIPIENTS);
    const sender = "onboarding@resend.dev";

    const handleSendEmails = async (templateId: string) => {
        if (!subject.current || !body.current) return;

        try {
            const result = await sendBulkEmail.mutateAsync({
                templateId: '',
                recipients: recipients,
                sender: {
                    email: 'muhammadsaif713@gmail.com',
                    name: 'Saif Nasir',
                },
            });
            console.log('Emails sent:', result);
        } catch (error) {
            console.error('Failed to send emails:', error);
        }
    };

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Send Bulk Email</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-6">
                <div className="">
                    <Label htmlFor="subject"> Subject</Label>
                    <Input ref={subject} />
                </div>

                <div className=''>
                    <Label htmlFor="body"> Body </Label>
                    <Textarea ref={body} className='h-96' />
                </div>

            </div>

            {batchCount > 1 && (
                <DialogDescription>
                    Your email will be sent in {batchCount} batches due to recipient limit.
                </DialogDescription>
            )}

            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="secondary">Cancel</Button>
                </DialogClose>

                <Button onClick={() => handleSendEmails('1')}>Send to {recipientCount} recipients</Button>

            </DialogFooter>

        </DialogContent>
    );
};