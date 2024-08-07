// app/api/send-feedback/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { renderAsync } from '@react-email/render';
import FeedbackEmail from '@/components/Emails/FeedbackEmail';
import { createElement } from 'react';
import { FeedbackData } from '@/lib/type';

if (!process.env.RESEND_API_KEY)
  throw new Error('RESEND_API_KEY is not set');

const resend = new Resend(process.env.RESEND_API_KEY);



export async function POST(request: Request) {
  const data: FeedbackData = await request.json();
  
  console.log('Parsed data:', data);


  try {
    const htmlContent = await renderAsync(
      createElement(FeedbackEmail, data)
    );

    console.log('Email content created');

    console.log('Sending email');


    const result = await resend.emails.send({
      from: 'Your AI Form Builder <onboarding@resend.dev>',
      to: ['muhammadsaif713@gmail.com'],
      subject: `New Feedback Submission from ${data.name}`,
      html: htmlContent
    });
    
    console.log('Email sent', result);


    return NextResponse.json({ message: 'Feedback sent successfully', data: result });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to send feedback', error: (error as Error).message }, { status: 500 });
  }
}