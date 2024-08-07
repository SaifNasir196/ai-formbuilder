import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { formId: string } }
) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formId = params.formId;

  try {
    const form = await prisma.form.findUnique({
      where: {
        id: parseInt(formId),
        userId: user.id,
      },
      select: {
        visits: true,
        submissions: true,
      },
    });

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    const visits = form.visits || 0;
    const submissions = form.submissions || 0;

    const submissionRate = visits > 0 ? (submissions / visits) * 100 : 0;
    const bounceRate = 100 - submissionRate;

    return NextResponse.json({ visits, submissions, submissionRate, bounceRate });
  } catch (error) {
    console.error('Error fetching form stats:', error);
    return NextResponse.json({ error: 'Failed to fetch form stats' }, { status: 500 });
  }
}