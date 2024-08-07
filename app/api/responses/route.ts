import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  const user = await currentUser();
  if (!user){
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const formId = request.nextUrl.searchParams.get('formId');
  if (!formId) {
    return NextResponse.json({ error: 'Missing formId' }, { status: 400 });
  }

  try {
    const formSubmissions = await prisma.formSubmission.findMany({
      where: {
        formId: parseInt(formId),
        form: {
          userId: user?.id,
        },
      },
    });

    return NextResponse.json(formSubmissions);
  } catch (error) {
    console.error('Error fetching responses:', error);
    return NextResponse.json({ error: 'Failed to fetch responses' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await currentUser();
  if (!user){
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { formId, submission } = await request.json();

    console.log('formId:', formId);
    console.log('response:', submission);

    // return NextResponse.json({ error: 'Form not found' }, { status: 404 });

    const res = await prisma.formSubmission.create({ 
      data: {
        form: {
          connect: {
            id: parseInt(formId)
          },
        },
        submission: submission,
      },
      select: {
        id: true,
      },
    });

    return NextResponse.json({ id: res.id }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Form not found' }, { status: 404 });
      }
    }
    console.error('Error creating response:', error);
    return NextResponse.json({ error: 'Failed to create response' }, { status: 500 });
  }
}