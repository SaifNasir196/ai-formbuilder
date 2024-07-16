import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey!);

export async function POST(request: Request) {
  try {
    console.log('Server-side env vars:', {
    DATABASE_URL_CONFIG: process.env.DATABASE_URL_CONFIG,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    });
    const { message } = await request.json();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = model.startChat({
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
      },
      history: []
    });
    const result = await chat.sendMessage(message);
    return NextResponse.json({ response: result.response.text() });
  } catch (error) {
    return NextResponse.json({ error: 'Error processing your request' }, { status: 500 });
  }
}