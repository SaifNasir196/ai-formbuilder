import { NextResponse } from 'next/server';
import { model } from "@/lib/utils";
import { PROMPT } from '@/lib/data';


export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    const chat = model.startChat({ history: [] });
    const result = await chat.sendMessage("Description: " + message + PROMPT);
    // console.log('Response:', result.response.text());
    return NextResponse.json({ response: result.response.text() });
  } catch (error) {
    console.log('Error:', error);
    return NextResponse.json({ error: 'Error processing your request' }, { status: 500 });
  }
}