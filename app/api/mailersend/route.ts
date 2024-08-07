// app/api/send-bulk-email/route.ts
import { NextResponse } from 'next/server';
import { BulkEmailTemplate } from '@/components/Emails/BulkEmailTemplate';
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import { Recipient as RecipientType } from '@/lib/type';



if (!process.env.MAILERSEND_API_KEY)
  throw new Error('MAILERSEND_API_KEY is not set');

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { templateId, recipients, sender } = await request.json();
    const sentFrom = new Sender(sender.email, sender.name);

    const bulkEmails: EmailParams[] = [];

    recipients.forEach((recipient: RecipientType) => {
      const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo([new Recipient(recipient.email, recipient.name)])
        .setTemplateId(templateId)
        .setSubject('Subject')
        .setHtml("BulkEmailTemplate({ recipientName: recipient.name })");
      bulkEmails.push(emailParams);
    })
    
    const response = await mailerSend.email.sendBulk(bulkEmails);

    console.log('Emails sent successfully:', response);
    return NextResponse.json({ message: 'Emails sent successfully', response });
  } catch (error) {
    console.error('Error sending emails:', error);
    return NextResponse.json({ error: 'Failed to send emails' }, { status: 500 });
  }
}
