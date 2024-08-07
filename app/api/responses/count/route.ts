import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const user = await currentUser();
  if (!user){
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formId = request.nextUrl.searchParams.get('formId');
  if (!formId) {
    return NextResponse.json({ error: 'Form ID is required' }, { status: 400 });
  }

  try {

    const count = await prisma.formSubmission.count({
      where: {
        formId: parseInt(formId),
        form: {
          userId: user.id,
        },
      },
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error fetching response count:', error);
    return NextResponse.json({ error: 'Failed to fetch response count' }, { status: 500 });
  }
}